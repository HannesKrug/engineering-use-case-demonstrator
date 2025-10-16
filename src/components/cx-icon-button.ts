import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

/**
 * This component displays an icon button.
 *
 * @see `cx-icon`
 */
@customElement("cx-icon-button")
export default class CxIconButton extends LitElement {
  /**
   * The name of the icon to display.
   */
  @property({ type: String }) icon: string = "";

  /**
   * The size of the button.
   */
  @property({ type: String }) size: "tiny" | "small" | "medium" | "large" =
    "medium";

  /**
   * The type of the button.
   */
  @property({ type: String })
  type: "primary" | "secondary" | "tertiary" = "primary";

  static styles = css`
    button {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0.1rem;
      padding: 0.5rem;
      border-radius: 50%;
      border: none;
      cursor: pointer;
    }

    button.primary {
      background-color: var(--cx-primary-color);
    }

    button.primary:active {
      background-color: var(--cx-primary-color-active);
    }

    button.secondary {
      background-color: var(--cx-secondary-color);
    }

    button.secondary:active {
      background-color: var(--cx-secondary-color-active);
    }

    button.tertiary {
      background-color: var(--cx-tertiary-color);
    }

    button.tertiary:active {
      background-color: var(--cx-tertiary-color-active);
    }

    button.tiny {
      width: 1.5rem;
      height: 1.5rem;
      padding: 0.25rem;
    }

    button.small {
      width: 2rem;
      height: 2rem;
      padding: 0.5rem;
    }

    button.medium {
      width: 3rem;
      height: 3rem;
      padding: 0.75rem;
    }

    button.large {
      width: 4rem;
      height: 4rem;
      padding: 1rem;
    }

    cx-icon {
      color: black;
      width: 100%;
      height: 100%;
    }
  `;

  protected render() {
    const buttonClasses = classMap({
      primary: this.type === "primary",
      secondary: this.type === "secondary",
      tertiary: this.type === "tertiary",
      tiny: this.size === "tiny",
      small: this.size === "small",
      medium: this.size === "medium",
      large: this.size === "large",
    });
    return html`<button class=${buttonClasses}>
      <cx-icon icon=${this.icon}></cx-icon>
    </button>`;
  }
}
