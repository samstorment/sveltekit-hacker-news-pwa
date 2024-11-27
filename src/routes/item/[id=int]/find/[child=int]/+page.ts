import { getPages, type Comment, findItemInPage, type Item } from '$lib/util.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ params, fetch, url }) {

	let childNum = Number(params.child);

	if (isNaN(childNum) || childNum < 0) {
		redirect(303, `/item/${params.id}`);
	}

	const res = await fetch(`https://api.hnpwa.com/v0/item/${params.id}.json`)
	const item: Item = await res.json();

	if (!item) {
		error(404, "Not Found");
	}
	
	const pages = getPages(item);

	let pageNumber = 0;
	let found: Comment | null = null;

	for (let p of pages) {
		pageNumber++;
		found = findItemInPage(p, params.child);
		if (found) break;
	}

	if (!found) {
		error(404, "Not Found");
	}

	if (pageNumber === 1) {
		redirect(303, `/item/${params.id}#${params.child}`);
	}

	redirect(303, `/item/${params.id}?p=${pageNumber}#${params.child}`);
}