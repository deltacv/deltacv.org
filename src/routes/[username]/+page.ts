import { redirect, error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// Use ** to skip the (small-header) group dir — parentheses break absolute globs in Vite
const authorModules = import.meta.glob(
    '/src/routes/**/people/*/author.ts',
    { eager: true }
);

const authors = Object.entries(authorModules).map(([path, mod]: [string, any]) => {
    // path like /src/routes/(small-header)/people/serivesmejia/author.ts
    const folder = path.split('/').slice(-2, -1)[0];
    return { ...mod.author, href: `/people/${folder}` };
});

export const load: PageLoad = ({ params }) => {
    const match = authors.find(a => a.shortSlash === params.username);
    if (match) {
        redirect(302, match.href);
    }
    error(404, 'Not Found');
};
