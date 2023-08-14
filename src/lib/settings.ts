import { browser } from "$app/environment";
import { writable } from "svelte/store";

type Hand = 'lefty' | 'righty';
type Theme = 'light' | 'dark' | 'system';

type Settings = {
    posts: {
        hand: Hand
    },
    comments: {
        hand: Hand,
        hnLinks: boolean
    },
    theme: Theme
}

export const settings = writable<Settings>({
    posts: {
        hand: 'righty'
    },
    comments: {
        hand: 'righty',
        hnLinks: true
    },
    theme: getTheme()
});

function getTheme(): Theme {
    if (browser) {
        const theme = localStorage.getItem("theme") as Theme ?? "system";

        let colorMode = theme;

        if (colorMode === "system") {
            colorMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        if (colorMode === "dark") {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        return theme;
    }

    return "system";
}

function createThemeStore() {
    const { subscribe, set, update } = writable<Theme>(getTheme());

	return {
		subscribe,
		setDark: () => {
            localStorage.setItem("theme", "dark");
            document.documentElement.classList.add("dark");
            set("dark");
        },
		setLight: () => {
            localStorage.setItem("theme", "light");
            document.documentElement.classList.remove("dark");
            set("light");
        },
		setSystem: () => {
            localStorage.removeItem("theme");
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            set("system");
        }
	};
}

export const theme = createThemeStore();

function getHand(): Hand {
    if (browser) {
        return localStorage.getItem("hand") as Hand ?? "righty";
    }

    return "righty";
}

function createHandStore() {
    const { subscribe, set, update } = writable<Hand>(getHand());

	return {
		subscribe,
        set: (hand: Hand) => {
            localStorage.setItem("hand", hand);

            hand === "lefty" 
                ? document.documentElement.classList.add("lefty")
                : document.documentElement.classList.remove("lefty");

            set(hand);
        }
	};
}

export const hand = createHandStore();