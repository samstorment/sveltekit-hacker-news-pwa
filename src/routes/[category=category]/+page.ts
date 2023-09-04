import { pageLimit, type Category, categoryName, type Item, type ItemBasic } from '$lib/util.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params, fetch, url }) {

    const page = url.searchParams.get('p') ?? "1";
	const pageNum = parseInt(page);
    const category = params.category as Category;
    
    if (isNaN(pageNum) || pageNum <= 0) {
        throw redirect(301, `/${params.category}?p=1`)
    }
    
    const limit = pageLimit(category);
    
    if (pageNum > limit) {
        throw redirect(301, `/${params.category}?p=${limit}`);
    }

    const hnCategory = categoryName(category);

    const res = await fetch(`https://api.hnpwa.com/v0/${hnCategory}/${page}.json`);
    const items: ItemBasic[] = await res.json();

	return {
		category: hnCategory,
		categoryLabel: params.category,
		page: pageNum,
		items,
		pageLimit: limit
	};
}