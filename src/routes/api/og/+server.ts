import { error, json } from '@sveltejs/kit';
import { load as loadHtml } from 'cheerio';

export async function GET({ fetch, params, url }) {

    const site = url.searchParams.get('site');

    if (!site) {
        return json({ url: undefined });
    }

    try {
        const res = await fetch(site);
        const html = await res.text(); 

        const $ = loadHtml(html);
        const ogImage = $("[name=og:image], [property=og:image], [name=twitter:image], [property=twitter:image]");
        
        const text = ogImage.attr("content");

        return json({ url: text });
        
    } catch (err) {
        return json({ url: undefined })
    }
}