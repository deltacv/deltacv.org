export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    authorName: string;
    authorHref: string;
    tags: string[];
}

const MIN_WORD_LEN = 2;

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

/** Strip YAML frontmatter, svelte tags, and markdown syntax to plain text. */
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

/** Tokenize text into words (no stop words, min length). */
export function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length >= MIN_WORD_LEN && !STOP_WORDS.has(w));
}

interface PostIndex {
    posts: BlogPost[];
    invertedIndex: Map<string, Set<string>>;
}

let cachedIndex: PostIndex | null = null;

function buildIndex(): PostIndex {
    const rawFiles = import.meta.glob('/src/posts/*.svx', {
        query: '?raw',
        import: 'default',
        eager: true,
    }) as Record<string, string>;

    const postModules = import.meta.glob('/src/posts/*.svx', {
        eager: true,
    }) as Record<string, any>;

    const authorModules = import.meta.glob('/src/routes/**/people/*/author.ts', {
        eager: true,
    }) as Record<string, any>;

    const authors = Object.entries(authorModules).map(([path, mod]) => {
        const folder = path.split('/').slice(-2, -1)[0];
        return {
            ...mod.author,
            href: `/people/${folder}`,
        };
    });

    const invertedIndex = new Map<string, Set<string>>();

    const posts: BlogPost[] = Object.entries(postModules).map(([path, mod]) => {
        const slug = path.split('/').pop()!.replace('.svx', '');
        const email = mod.metadata?.author || '';
        const resolvedAuthor = authors.find((a) => a.email === email);
        const tags: string[] = Array.isArray(mod.metadata?.tags) ? mod.metadata.tags : [];

        // Raw body for fulltext indexing
        const rawContent = rawFiles[path] || '';
        const tokens = new Set<string>();

        // Index body content
        for (const token of tokenize(stripContent(rawContent))) {
            tokens.add(token);
        }

        // Index title, description, tags, and author name
        const metaText = `${mod.metadata?.title || ''} ${mod.metadata?.description || ''} ${resolvedAuthor?.name || ''}`;
        for (const token of tokenize(metaText)) {
            tokens.add(token);
        }

        for (const tag of tags) {
            tokens.add(tag.toLowerCase());
            for (const t of tokenize(tag)) {
                tokens.add(t);
            }
        }

        for (const word of tokens) {
            if (!invertedIndex.has(word)) {
                invertedIndex.set(word, new Set());
            }
            invertedIndex.get(word)!.add(slug);
        }

        return {
            slug,
            title: mod.metadata?.title || slug,
            description: mod.metadata?.description || '',
            date: mod.metadata?.date || '',
            authorName: resolvedAuthor?.name || '',
            authorHref: resolvedAuthor?.href || '',
            tags,
        };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { posts, invertedIndex };
}

export function getBlogData(): PostIndex {
    if (!cachedIndex || import.meta.env.DEV) {
        cachedIndex = buildIndex();
    }
    return cachedIndex;
}

export function getAllPosts(): BlogPost[] {
    return getBlogData().posts;
}

export function searchPosts(query: string): string[] {
    const trimmed = query.trim();
    const { posts, invertedIndex } = getBlogData();

    if (!trimmed) {
        return posts.map((p) => p.slug);
    }

    const ql = trimmed.toLowerCase();

    // 1. Direct metadata match (instant match on title, description, author, tags)
    const metaMatchedSlugs = new Set(
        posts
            .filter((post) =>
                post.title.toLowerCase().includes(ql) ||
                post.description.toLowerCase().includes(ql) ||
                post.authorName.toLowerCase().includes(ql) ||
                post.tags.some((t) => t.toLowerCase().includes(ql))
            )
            .map((p) => p.slug)
    );

    // 2. Tokenized full-text inverted index search with prefix matching and AND semantics
    const tokens = tokenize(trimmed);
    if (tokens.length === 0) {
        return Array.from(metaMatchedSlugs);
    }

    let fulltextMatchedSlugs: Set<string> | null = null;
    const allWords = Array.from(invertedIndex.keys());

    for (const token of tokens) {
        const matchingWords = allWords.filter((w) => w.startsWith(token));
        const tokenSlugs = new Set<string>();
        for (const word of matchingWords) {
            const slugs = invertedIndex.get(word);
            if (slugs) {
                for (const s of slugs) tokenSlugs.add(s);
            }
        }

        if (fulltextMatchedSlugs === null) {
            fulltextMatchedSlugs = tokenSlugs;
        } else {
            const prev = fulltextMatchedSlugs;
            fulltextMatchedSlugs = new Set(Array.from(tokenSlugs).filter((s) => prev.has(s)));
        }
    }

    // Combine metadata matches and fulltext matches
    const combined = new Set<string>(metaMatchedSlugs);
    if (fulltextMatchedSlugs) {
        for (const slug of fulltextMatchedSlugs) {
            combined.add(slug);
        }
    }

    return Array.from(combined);
}

