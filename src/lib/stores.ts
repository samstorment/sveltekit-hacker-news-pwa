import { writable } from "svelte/store";



export const navState = writable<'visible' | 'hidden' | 'auto'>();
export const scrollY = writable(0);

export const transition = writable<any>(undefined);