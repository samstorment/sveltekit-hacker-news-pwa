import { redirect } from '@sveltejs/kit';



export async function load({ params, fetch, url }) {
	
	async function pageLimit(category: string) {
		const res = await fetch(`https://api.hnpwa.com/v0`);
		const { endpoints } = await res.json();
	
		const topic = endpoints.find((e: any) => e.topic === category);
	
		return topic.maxPages;
	}

    let category = params.category;

	if (category === "top") category = "news";
	else if (category === "new") category = "newest";

	let page = url.searchParams.get('p') ?? "1";
	let pageNum = parseInt(page);

	if (isNaN(pageNum) || pageNum <= 0) {
		throw redirect(301, `/${params.category}?p=1`)
	}

	var limit = await pageLimit(category);
	
	if (pageNum > limit) {
		throw redirect(301, `/${params.category}?p=${limit}`);
	}

	return {
		category,
		categoryLabel: params.category,
		page: pageNum,
		items: fetch(`https://api.hnpwa.com/v0/${category}/${pageNum}.json`).then((r) => r.json()),
		pageLimit: limit
	};
}