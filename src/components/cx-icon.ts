import { customElement, property } from "lit/decorators.js";
import { css, LitElement, nothing } from "lit";
import { until } from "lit-html/directives/until.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";

/**
 * This component displays an icon.
 *
 * Icons are loaded from the `../assets/icons` directory. Thus, the `icon` property
 * should be set to the name of the icon file without the `.svg` extension.
 *
 * If you want to add a new icon, simply add the SVG file to the `../assets/icons` directory.
 */
@customElement("cx-icon")
export default class CxIcon extends LitElement {
  /**
   * The name of the icon to display. This should be the name of the SVG file in the
   * `../assets/icons` directory without the `.svg` extension.
   */
  @property({ type: String })
  public icon?: string;

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `;

  protected render() {
    const importedIcon = import(`../assets/icons/${this.icon}.svg?raw`).then(
      (iconModule) => unsafeSVG(iconModule.default)
    );
    return until(importedIcon, nothing);
  }
}
