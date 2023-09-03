import { redis } from '$lib/redis/index.js';
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

    const redisId = `category:${params.category}:${page}`;
    const cached = await redis.GET(redisId);

    let items: any[];

    if (cached) {
        items = JSON.parse(cached);
    } else {
        const res = await fetch(`https://api.hnpwa.com/v0/${category}/${page}.json`);
        items = await res.json();
        redis.SETEX(redisId, 60 * 5, JSON.stringify(items));
    }

	return {
		category: categoryName(params.category as Category),
		categoryLabel: params.category,
		page: pageNum,
		items,
		pageLimit: limit
	};
}