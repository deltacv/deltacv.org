import type { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

// ─── Config ──────────────────────────────────────────────────────────────────

const MIN_WORD_LEN = 3;

const STOP_WORDS = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'to', 'of', 'in', 'for', 'on', 'with',
    'at', 'by', 'from', 'up', 'about', 'into', 'this', 'that', 'it', 'its',
    'and', 'or', 'but', 'not', 'so', 'if', 'as', 'all', 'how', 'more',
    'also', 'just', 'than', 'too', 'very', 'only', 'each', 'both', 'same',
    'such', 'no', 'our', 'we', 'they', 'you', 'he', 'she', 'his', 'her',
    'their', 'there', 'when', 'what', 'which', 'who', 'use', 'used', 'using',
]);

// ─── Types ────────────────────────────────────────────────────────────────────

/** One letter shard: word → list of post slugs containing that word */
export type LetterShard = Record<string, string[]>;

/** Manifest returned at /api/blog/search */
export type SearchManifest = { letters: string[] };

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Strip YAML frontmatter and markdown syntax to plain text. */
function stripContent(raw: string): string {
    let text = raw.replace(/^---[\s\S]*?---\s*/m, '');
    text = text.replace(/<[^>]+>/g, ' ');
    text = text.replace(/```[\s\S]*?```/g, ' ');
    text = text.replace(/`[^`]+`/g, ' ');
    text = text.replace(/!\[.*?\]\(.*?\)/g, ' ');
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    text = text.replace(/^#{1,6}\s+/gm, '');
    text = text.replace(/[*_~>`]/g, '');
    return text.toLowerCase();
}

/** Tokenize text into meaningful words (no stop words, min length). */
export function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length >= MIN_WORD_LEN && !STOP_WORDS.has(w));
}

interface InvertedIndex {
    /** letter → LetterShard */
    byLetter: Map<string, LetterShard>;
}

/** Extract tags array from raw SVX frontmatter (simple yaml array format). */
function extractTags(raw: string): string[] {
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) return [];
    const tagsMatch = fmMatch[1].match(/^tags:\s*\[([^\]]*)\]/m);
    if (!tagsMatch) return [];
    return tagsMatch[1]
        .split(',')
        .map((t) => t.trim().replace(/^["']|["']$/g, '').toLowerCase())
        .filter(Boolean);
}

/** Build the full inverted index from all posts in postsDir. */
function buildInvertedIndex(postsDir: string): InvertedIndex {
    const byLetter = new Map<string, LetterShard>();

    if (!fs.existsSync(postsDir)) return { byLetter };

    const files = fs.readdirSync(postsDir).filter((f: string) => f.endsWith('.svx'));

    for (const file of files) {
        const slug = file.replace('.svx', '');
        const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8');

        // Index body content tokens
        const tokens = new Set(tokenize(stripContent(raw)));

        // Also index tags directly (they're exact terms, add as-is)
        for (const tag of extractTags(raw)) {
            tokens.add(tag);
        }

        for (const word of tokens) {
            const letter = word[0];
            if (!byLetter.has(letter)) byLetter.set(letter, {});
            const shard = byLetter.get(letter)!;
            if (!shard[word]) shard[word] = [];
            shard[word].push(slug);
        }
    }

    return { byLetter };
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

/**
 * Vite plugin: generates a letter-sharded inverted search index.
 *
 * Routes:
 *   /api/blog/search        → { letters: ['a','b','c',...] }
 *   /api/blog/search/k      → { "kotlin": ["slug1","slug2"], "key": [...] }
 *
 * - Build: emitted via `this.emitFile()` → no static/ pollution
 * - Dev:   in-memory Vite middleware → nothing written to disk
 */
export function searchIndexPlugin(): Plugin {
    return {
        name: 'search-index',

        // --- PRODUCTION BUILD ---
        generateBundle() {
            const { byLetter } = buildInvertedIndex(
                path.join(process.cwd(), 'src', 'posts'),
            );

            const letters = [...byLetter.keys()].sort();

            // Manifest
            this.emitFile({
                type: 'asset',
                fileName: 'api/blog/search/index',
                source: JSON.stringify({ letters } satisfies SearchManifest),
            });

            // One shard per letter
            for (const letter of letters) {
                this.emitFile({
                    type: 'asset',
                    fileName: `api/blog/search/${letter}`,
                    source: JSON.stringify(byLetter.get(letter)),
                });
            }

            console.log(
                `[search-index] emitted ${letters.length} letter shard(s).`,
            );
        },

        // --- DEV SERVER ---
        configureServer(server) {
            const postsDir = path.join(server.config.root, 'src', 'posts');

            server.middlewares.use(
                '/api/blog/search',
                (req: IncomingMessage, res: ServerResponse, next: () => void) => {
                    const { byLetter } = buildInvertedIndex(postsDir);
                    const letters = [...byLetter.keys()].sort();
                    const url = (req.url ?? '/').split('?')[0].replace(/\/$/, '') || '/';

                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Cache-Control', 'no-store');

                    if (url === '/') {
                        res.end(JSON.stringify({ letters } satisfies SearchManifest));
                        return;
                    }

                    // /api/blog/search/k  → single letter
                    const match = url.match(/^\/([a-z0-9])$/);
                    if (match) {
                        const shard = byLetter.get(match[1]);
                        if (shard) {
                            res.end(JSON.stringify(shard));
                            return;
                        }
                    }

                    next();
                },
            );
        },
    };
}
