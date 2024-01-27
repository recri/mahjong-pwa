// docs for router https://github.com/thepassle/app-tools/blob/master/router/README.md

import { html } from 'lit';

import { Router } from '@thepassle/app-tools/router.js';

// @ts-ignore
// import { title } from '@thepassle/app-tools/router/plugins/title.js';

import './pages/mahjong/mahjong-app.js';

/* global globalThis */
if (!(globalThis as any).URLPattern) {
  await import('urlpattern-polyfill');
}

const baseURL: string = (import.meta as any).env.BASE_URL;

// This function will resolve a path with whatever Base URL was passed to the vite build process.
// Use of this function throughout the starter is not required, but highly recommended, especially if you plan to use GitHub Pages to deploy.
// If no arg is passed to this function, it will return the base URL.

export function resolveRouterPath(unresolvedPath?: string) {
  let resolvedPath = baseURL;
  if (unresolvedPath) {
    resolvedPath += unresolvedPath;
  }

  return resolvedPath;
}

export const router = new Router({
  routes: [
    {
      path: resolveRouterPath(),
      title: 'Mahjong',
      render: () => html`<mahjong-app></mahjong-app>`,
    },
  ],
});
