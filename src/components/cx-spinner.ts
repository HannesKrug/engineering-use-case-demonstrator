import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * This component displays a spinner. Can be used as a loading indicator.
 *
 * **Note**: You might want to use the `cx-loading-indicator` component instead.
 */
@customElement("cx-spinner")
export class CxSpinner extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      width: var(--width, 2rem);
      aspect-ratio: 1;
      animation: rotate 1s linear infinite;
    }

    .spinner {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: calc(var(--width, 2rem) / 8) solid transparent;
      border-top-color: var(--webvis-blue, currentColor);
      box-sizing: border-box;
    }

    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;

  render() {
    return html`<div class="spinner"></div>`;
  }
}
