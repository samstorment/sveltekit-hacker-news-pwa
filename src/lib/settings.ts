import { writable } from "svelte/store";

type Hand = 'left' | 'right'

type Settings = {
    posts: {
        hand: Hand
    },
    comments: {
        hand: Hand,
        hnLinks: boolean
    }
}

export const settings = writable<Settings>({
    posts: {
        hand: 'right'
    },
    comments: {
        hand: 'right',
        hnLinks: true
    }
});