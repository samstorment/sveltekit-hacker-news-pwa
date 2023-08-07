import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
    const user = await fetch(`https://api.hnpwa.com/v0/user/${params.username}.json`).then((r) => r.json());

    if (!user) throw error(404);

    return user;
}