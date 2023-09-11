import { pageLimit, type Category, categoryName, type Item, type ItemBasic } from '$lib/util.js';
import { redirect, type LoadEvent } from '@sveltejs/kit';

export async function load(event) {

    const { params, fetch, url } = event;

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

    async function getImage(item: ItemBasic) {

        if (item.url.startsWith("item")) return { url: undefined };

        const res = await fetch(`/api/og?url=${item.url}`);
        const data: { url: string | undefined } = await res.json();
        return data;
    }

	return {
		category: hnCategory,
		categoryLabel: params.category,
		page: pageNum,
		items: items.map(item => {
            return {
                ...item,
                ogImage: getImage(item)
            }
        }),
		pageLimit: limit
	};
}
