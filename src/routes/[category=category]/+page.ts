// import { pageLimit, type Category, categoryName } from '$lib/util.js';
// import { redirect } from '@sveltejs/kit';



// export async function load({ params, fetch, url }) {
	
// 	// async function fetchPageLimit(category: string) {
// 	// 	const res = await fetch(`https://api.hnpwa.com/v0`);
// 	// 	const { endpoints } = await res.json();
// 	// 	const topic = endpoints.find((e: any) => e.topic === category);
// 	// 	return topic.maxPages;
// 	// }

// 	let page = url.searchParams.get('p') ?? "1";
// 	let pageNum = parseInt(page);

// 	if (isNaN(pageNum) || pageNum <= 0) {
// 		throw redirect(301, `/${params.category}?p=1`)
// 	}

// 	var limit = pageLimit(params.category as Category);
	
// 	if (pageNum > limit) {
// 		throw redirect(301, `/${params.category}?p=${limit}`);
// 	}

// 	return {
// 		category: categoryName(params.category as Category),
// 		categoryLabel: params.category,
// 		page: pageNum,
// 		items: fetch(`/api/${params.category}?p=${pageNum}`).then((r) => r.json()),
// 		pageLimit: limit
// 	};
// }