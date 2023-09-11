import { error, json } from '@sveltejs/kit';
import { load as loadHtml } from 'cheerio';

export async function GET({ fetch, params, url }) {

    const site = url.searchParams.get('url');
    
    if (!site) {
        return json({ url: undefined });
    }

    let text: string | undefined;

    try {
        const res = await fetch(site);
        const html = await res.text(); 

        const $ = loadHtml(html);
        const ogImage = $("[name=og:image], [property=og:image], [name=twitter:image], [property=twitter:image]");
        
        text = ogImage.attr("content");

        if (!text) {
            return json({ url: text });
        }

        if (text.startsWith('www.')) {
            text = `https://${text}`;
        }

        let siteUrl = new URL(text, site);

        return json({ url: siteUrl.href });
        
    } catch (err) {
        return json({ url: undefined })
    }
}