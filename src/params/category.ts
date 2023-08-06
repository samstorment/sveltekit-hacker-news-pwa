const categories = new Set(['top', 'new', 'show', 'ask', 'jobs']);

export const match = (name: string) => categories.has(name);