import { writable } from "svelte/store";

type NavState = 'hidden' | 'visible' | 'auto';

export const navState = writable<NavState>('auto');