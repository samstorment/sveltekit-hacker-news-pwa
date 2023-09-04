import { pageLimit, type Category, categoryName } from '$lib/util.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params, fetch, url }) {

    const page = url.searchParams.get('p') ?? "1";
	const pageNum = parseInt(page);
    
    if (isNaN(pageNum) || pageNum <= 0) {
        throw redirect(301, `/${params.category}?p=1`)
    }
    
    const limit = pageLimit(params.category as Category);
    
    if (pageNum > limit) {
        throw redirect(301, `/${params.category}?p=${limit}`);
    }

    const category = categoryName(params.category as Category);

    const res = await fetch(`https://api.hnpwa.com/v0/${category}/${page}.json`);
    const items = await res.json();

	return {
		category: categoryName(params.category as Category),
		categoryLabel: params.category,
		page: pageNum,
		items,
		pageLimit: limit
	};
}