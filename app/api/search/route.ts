import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

// Built once at build time; the browser downloads the index and searches it locally, so no function runs.
export const revalidate = false;

export const { staticGET: GET } = createFromSource(source);
