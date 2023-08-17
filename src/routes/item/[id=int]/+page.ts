import { redirect } from '@sveltejs/kit';


export type Comment = {
	deleted?: boolean;
	user: string;
	time_ago: string;
	content: string;
	comments: Comment[];
	level: number;
	parent?: Comment;
	id: string;
	visible_comment_count: number;
	comments_count: number;
}

export async function load({ params, fetch, url }) {

	const p = url.searchParams.get("p");	
	const page = p ?? "1";


	let pageNum = parseInt(page);

	if (isNaN(pageNum) || pageNum <= 0) {
		throw redirect(301, `/item/${params.id}?p=1`);
	}

	const res = await fetch(`https://api.hnpwa.com/v0/item/${params.id}.json`)
	const item: Comment = await res.json();

	const MIN_PER_PAGE = 100;
	const MAX_PER_PAGE = 300;

	const pageBreaks = getPageBreaks(item, MIN_PER_PAGE, MAX_PER_PAGE);
	const numPages = pageBreaks.length + 1;

	if (pageNum > numPages) {
		throw redirect(301, `/item/${params.id}?p=${numPages}`);
	}
	
	if (item.comments_count <= MAX_PER_PAGE) {
		return { 
			item: item as any,
			pageLimit: 1,
			page: 1
		};
	}

	let startIndex = pageNum === 1 ? 0 : pageBreaks[pageNum - 2];
	let endIndex = pageNum === numPages ? item.comments.length : pageBreaks[pageNum - 1];

	item.comments = item.comments.slice(startIndex, endIndex);

	return {
		item: item as any,
		pageLimit: numPages,
		page: pageNum
	}
}


function getPageBreaks(item: Comment, hardLowerLimit: number, roughUpperLimit: number) {
	let total = 0;

	let pages: number[] = [];

	for (let i = 0; i < item.comments.length; i++) {
		const comment = item.comments[i];
		if (comment.deleted === true) continue;

		const prevTotal = total;
		total += comment.comments_count;

		if (total >= roughUpperLimit && prevTotal >= hardLowerLimit) {
			pages.push(i);
			total = comment.comments_count;
		}
	}

	return pages;
}

// function commentCount(item: Comment) {
// 	let count = item.comments.filter(c => c.deleted !== true).length;

// 	count += item.comments.reduce((a, e) => a + commentCount(e), 0);

// 	item.visibile_comment_count = count;

// 	return count;
// }
