import { error, redirect } from '@sveltejs/kit';

export async function load({ params, url, fetch }) {

    const id = url.searchParams.get('id');

    if (id === null) throw error(404);

    throw redirect(302, `/item/${id}`);
}