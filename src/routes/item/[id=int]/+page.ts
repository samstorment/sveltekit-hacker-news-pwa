export type Comment = {
	deleted?: boolean;
	user: string;
	time_ago: string;
	content: string;
	comments: Comment[];
	level: number;
	parent?: Comment;
	id: string;
	visibile_comment_count: number;
}

export async function load({ params, fetch, url }) {

	const res = await fetch(`https://api.hnpwa.com/v0/item/${params.id}.json`)
	const item = await res.json();

	commentCount(item);

	return {
		item
	}
}


function commentCount(item: Comment) {
	let count = item.comments.filter(c => c.deleted !== true).length;

	count += item.comments.reduce((a, e) => a + commentCount(e), 0);

	item.visibile_comment_count = count;

	return count;
}