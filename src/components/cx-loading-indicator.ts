import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * This component displays a loading indicator with a spinner and a text.
 */
@customElement("cx-loading-indicator")
export class CxLoadingIndicator extends LitElement {
  /**
   * The text to display next to the spinner.
   */
  @property({ type: String }) text: string = "Loading...";

  static styles = css`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
    }
  `;

  render() {
    return html`<cx-spinner></cx-spinner><span>${this.text}</span>`;
  }
}
