import { getPages, type Comment, type Item } from '$lib/util.js';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch, url }) {
	const p = url.searchParams.get("p") ?? "1";	
	let pageNum = parseInt(p);
	
	// await new Promise(res => setTimeout(() => res("Hi"), 400));

	if (isNaN(pageNum) || pageNum <= 0) {
		pageNum = 1;
	}

	const res = await fetch(`https://api.hnpwa.com/v0/item/${params.id}.json`)
	const item: Item = await res.json();

	if (!item) {
		error(404, "Not Found");
	}

	const pages = getPages(item);
	pageNum = Math.min(pageNum, pages.length);
	item.comments = pages[pageNum - 1] ?? [];

	return {
		item: item,
		pageLimit: pages.length,
		page: pageNum
	};
}