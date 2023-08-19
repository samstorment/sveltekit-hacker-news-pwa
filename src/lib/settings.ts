import { browser } from "$app/environment";
import { writable } from "svelte/store";

export type Hand = 'lefty' | 'righty';
export type Theme = 'light' | 'dark' | 'system';

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

    function setDark() {
        localStorage.setItem("theme", "dark");
        document.documentElement.classList.add("dark");
        set("dark");
    }

    function setLight() {
        localStorage.setItem("theme", "light");
        document.documentElement.classList.remove("dark");
        set("light");
    }

    function setSystem() {
        localStorage.removeItem("theme");
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        set("system");
    }

	return {
		subscribe,
        set: (theme: Theme) => {
            if (theme === "dark") setDark();
            else if (theme === "light") setLight();
            else if (theme === "system") setSystem();
        },
		setDark,
		setLight,
		setSystem
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


export type Tab = 'settings' | 'about';
export const activeTab = writable<Tab>("settings");