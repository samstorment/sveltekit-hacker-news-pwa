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

export function getPageBreaks(item: Comment, hardLowerLimit: number, roughUpperLimit: number) {
	let total = 0;

	let pages: number[] = [0];

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

	pages.push(item.comments.length);

	return pages;
}

export function getPage(item: Comment, pageNumber: number) {
	const MIN_PER_PAGE = 100;
	const MAX_PER_PAGE = 300;

	const pageBreaks = getPageBreaks(item, MIN_PER_PAGE, MAX_PER_PAGE);
	const numPages = pageBreaks.length - 1;

	if (pageNumber > numPages) {
		return [];
	}

	let startIndex = pageBreaks[pageNumber - 1];
	let endIndex = pageBreaks[pageNumber];
	
	return item.comments.slice(startIndex, endIndex);
}

export function getPages(item: Comment, start = 1, end = Infinity) {
	let pages: Comment[][] = [];

	let pageNumber = start;
	
	while (pageNumber <= end) {
		let page = getPage(item, pageNumber++);
		if (page.length === 0) break;
		pages.push(page);
	}

	return pages;
}

export function findItemInPage(page: Comment[], id: string) {
	
	let idNum = parseInt(id);

	function search(item: Comment, id: string) {	
		let result: Comment | null = null;
		
		if (parseInt(item.id) === idNum) {
			result = item;
		} else if (item.comments) {
			item.comments.some((child) => {
				result = search(child, id);
				return result;
			});
		}
		return result;
    }

	return search({ comments: page } as Comment, id);
}