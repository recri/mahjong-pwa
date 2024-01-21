import { LitElement, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import './pages/mahjong/mahjong-app.js';

import { router } from './router.js';

@customElement('app-index')
export class AppIndex extends LitElement {
  static styles = css`
    :root {
      --font-family: sans-serif;
    }

    main {
      padding-left: 16px;
      padding-right: 16px;
      padding-bottom: 16px;
    }
  `;

  firstUpdated() {
    router.addEventListener('route-changed', () => {
      if ('startViewTransition' in document) {
        (document as any).startViewTransition(() => this.requestUpdate());
      } else {
        this.requestUpdate();
      }
    });
  }

  render() {
    // router config can be round in src/router.ts
    return router.render();
  }
}
