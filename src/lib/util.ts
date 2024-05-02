export interface ItemBasic {
	id: number,
	title: string,
	points: number,
	user: string,
	time: number,
	time_ago: string,
	comments_count: number,
	type: ItemType,
	url: string,
	domain: string
}

export interface Item extends ItemBasic {
	content: string,
	comments: Comment[],
	dead?: boolean,
	deleted?: boolean,
	poll?: PollChoice[]
}

export interface Comment extends Omit<ItemBasic, 'title' | 'points' | 'domain'> {
	content: string,
	comments: Comment[],
	level: number,
	dead?: boolean,
	deleted?: boolean,
	parent?: Comment
}

type ItemType = 'link' | 'job' | 'comment' | 'poll';

export type Page = Comment[];

export type Category = 'top' | 'new' | 'ask' | 'show' | 'jobs';

export interface User {
	created_time: number,
	created: string,
	id: string,
	karma: number
}

type PollChoice = {
	item: string;
	points: number;
}

export function pageLimit(category: Category) {
	return {
		'top': 10, 'new': 10, 'ask': 2, 'show': 2, 'jobs': 1
	}[category];
}

export function categoryName(category: Category) {
	if (category === 'top') return 'news'; 
	if (category === 'new') return 'newest';
	return category; 
}

export function getPageBreaks(item: Item, hardLowerLimit: number, roughUpperLimit: number) {
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

export function getPage(item: Item, pageNumber: number) {
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

export function getPages(item: Item, start = 1, end = Infinity) {
	let pages: Page[] = [];

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
		
		if (item.id === idNum) {
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

export function run<T>(fn: () => T): T {
	return fn();
}

export function points(item: Item | ItemBasic) {
	let label = item.points === 1 ? 'point' : 'points';
	return `${item.points} ${label}`;
}

export function comments(item: Item | ItemBasic | Comment) {

	let label = run(() => {
		if (item.type === "comment") {
			return item.comments_count === 1 ? "reply" : "replies";
		}  
		return item.comments_count === 1 ? "comment" : "comments";
	});

	return `${item.comments_count} ${label}`;
}


export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
};