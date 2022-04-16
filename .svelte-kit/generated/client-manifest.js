export { matchers } from './client-matchers.js';

export const components = [
	() => import("../../src/routes/__layout.svelte"),
	() => import("../../src/routes/__error.svelte"),
	() => import("../../src/routes/index.svelte"),
	() => import("../../src/routes/locationtracker.svelte"),
	() => import("../../src/routes/contactme.svelte"),
	() => import("../../src/routes/profile/__error.svelte"),
	() => import("../../src/routes/profile/[id]/__error.svelte"),
	() => import("../../src/routes/profile/[id]/[profile]/index.svelte"),
	() => import("../../src/routes/profile.svelte"),
	() => import("../../src/routes/bazaar.svelte"),
	() => import("../../src/routes/minion.svelte"),
	() => import("../../src/routes/mayor.svelte"),
	() => import("../../src/routes/news.svelte"),
	() => import("../../src/routes/ah.svelte")
];

export const dictionary = {
	"": [[0, 2], [1]],
	"locationtracker": [[0, 3], [1]],
	"contactme": [[0, 4], [1]],
	"profile/[id]/[profile]": [[0, , , 7], [1, 5, 6]],
	"profile": [[0, 8], [1]],
	"bazaar": [[0, 9], [1]],
	"minion": [[0, 10], [1]],
	"mayor": [[0, 11], [1]],
	"news": [[0, 12], [1]],
	"ah": [[0, 13], [1]]
};