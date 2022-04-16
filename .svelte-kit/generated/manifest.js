const c = [
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
	() => import("../../src/routes/about.svelte"),
	() => import("../../src/routes/mayor.svelte"),
	() => import("../../src/routes/news.svelte"),
	() => import("../../src/routes/ah.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/locationtracker.svelte
	[/^\/locationtracker\/?$/, [c[0], c[3]], [c[1]]],

	// src/routes/contactme.svelte
	[/^\/contactme\/?$/, [c[0], c[4]], [c[1]]],

	// src/routes/profile/[id]/[profile]/index.svelte
	[/^\/profile\/([^/]+?)\/([^/]+?)\/?$/, [c[0], , , c[7]], [c[1], c[5], c[6]], (m) => ({ id: d(m[1]), profile: d(m[2])})],

	// src/routes/profile.svelte
	[/^\/profile\/?$/, [c[0], c[8]], [c[1]]],

	// src/routes/bazaar.svelte
	[/^\/bazaar\/?$/, [c[0], c[9]], [c[1]], null, 1],

	// src/routes/minion.svelte
	[/^\/minion\/?$/, [c[0], c[10]], [c[1]]],

	// src/routes/about.svelte
	[/^\/about\/?$/, [c[0], c[11]], [c[1]]],

	// src/routes/mayor.svelte
	[/^\/mayor\/?$/, [c[0], c[12]], [c[1]]],

	// src/routes/news.svelte
	[/^\/news\/?$/, [c[0], c[13]], [c[1]]],

	// src/routes/ah.svelte
	[/^\/ah\/?$/, [c[0], c[14]], [c[1]]]
];

// we import the root layout/error components eagerly, so that
// connectivity errors after initialisation don't nuke the app
export const fallback = [c[0](), c[1]()];