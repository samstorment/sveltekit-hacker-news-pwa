import { getPages, type Comment } from '$lib/util.js';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch, url }) {
	const p = url.searchParams.get("p") ?? "1";	
	let pageNum = parseInt(p);    
	
	if (isNaN(pageNum) || pageNum <= 0) {
		pageNum = 1;
	}
    
	const res = await fetch(`https://api.hnpwa.com/v0/item/${params.id}.json`)
	const item: Comment = await res.json();
	
	if (!item) {
		throw error(404, "Not Found");
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