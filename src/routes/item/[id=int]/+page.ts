export async function load({ params, fetch, url }) {
	return {
		item: fetch(`https://api.hnpwa.com/v0/item/${params.id}.json`).then((r) => r.json()),
	}
}