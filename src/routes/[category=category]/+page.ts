import { pageLimit, type Category, categoryName, type Item, type ItemBasic, type AlgoliaSearchResults, algoliaSearchHitToItemBasic } from '$lib/util.js';
import { redirect, type LoadEvent } from '@sveltejs/kit';

export async function load(event) {

    const { params, fetch, url } = event;

    const page = url.searchParams.get('p') ?? "1";
	const pageNum = parseInt(page);
    const category = params.category as Category;
    // defaulting to algolia right now because api.hnpwa.com has had stale data lately
    const useAlgoliaFrontPage = url.searchParams.get('algolia')?.toLowerCase() === 'true';

    
    if (isNaN(pageNum) || pageNum <= 0) {
        redirect(301, `/${params.category}?p=1`);
    }
    
    let limit = pageLimit(category);
    
    if (pageNum > limit) {
        redirect(301, `/${params.category}?p=${limit}`);
    }

    const hnCategory = categoryName(category);

    let items: ItemBasic[] = [];

    if (useAlgoliaFrontPage && category === 'top') {
        const res = await fetch(`https://hn.algolia.com/api/v1/search?tags=front_page,story&hitsPerPage=${30}&page=${pageNum-1}`);
        const searchResults = await res.json() as AlgoliaSearchResults;

        // nbPages = number of pages
        limit = searchResults.nbPages;

        if (pageNum > limit) {
            redirect(301, `/${params.category}?p=${limit}`);
        }

        items = searchResults.hits.map(algoliaSearchHitToItemBasic);
    } else {   
        const res = await fetch(`https://api.hnpwa.com/v0/${hnCategory}/${page}.json`);
        items = await res.json();
    }

	return {
		category: hnCategory,
		categoryLabel: params.category,
		page: pageNum,
        items,
		pageLimit: limit
	};
}