import { redis } from '$lib/redis/index.js';
import { getPages, type Comment } from '$lib/util.js';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch, url }) {
	const p = url.searchParams.get("p") ?? "1";	
	let pageNum = parseInt(p);
	
	// await new Promise(res => setTimeout(() => res("Hi"), 400));

	if (isNaN(pageNum) || pageNum <= 0) {
		pageNum = 1;
	}
    
    const redisId = `item:${params.id}`;
    const cached = await redis.GET(redisId);

	let item: Comment;

	if (cached) {
		item = JSON.parse(cached);
	} else {	
		const res = await fetch(`https://api.hnpwa.com/v0/item/${params.id}.json`)
		item = await res.json();
	}

	if (!item) {
		throw error(404, "Not Found");
	}

	if (item && !cached) {
		const now = new Date().getTime();
		const itemTime = new Date(item.time * 1000).getTime();
		let ageMs = now - itemTime;
		let ageDays = ageMs / 1000 / 60 / 60 / 24;

		if (ageDays >= 30) {
			redis.SET(redisId, JSON.stringify(item));
		} else {
			redis.SETEX(redisId, 60 * 5, JSON.stringify(item));
		}
	}

	const pages = getPages(item);
	pageNum = Math.min(pageNum, pages.length);
	item.comments = pages[pageNum - 1] ?? [];

	return {
		item: item as any,
		pageLimit: pages.length,
		page: pageNum
	};
}