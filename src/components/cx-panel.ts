import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { getManufacturerData } from "../utils";
import { visDB } from "../visualizer-db";

/**
 * This component displays a panel with a tab bar and a tree view.
 */
@customElement("cx-panel")
export class CxPanel extends LitElement {
  /**
   * Base data for the manufacturers (AAS path and color).
   */
  private _data: {
    [manufacturer: string]: {
      aas: string;
      color: string;
    };
  } = getManufacturerData();

  /**
   * The path to the AAS that is currently selected.
   */
  @state() aasPath: string | undefined = undefined;

  _handleTabClick = async (index: number) => {
    this.aasPath = this._data[Object.keys(this._data)[index]].aas;
    visDB.clear();
    await webvis.getContext()?.clear();
    await webvis.getContext()?.setProperty(0, webvis.Property.GHOSTED, false);
  };

  static styles = css`
    :host {
      width: 30%;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 1rem 0;
    }
  `;

  render() {
    return html`
      <cx-tabbar
        .tabs=${Object.keys(this._data).map((manufacturer) => manufacturer)}
        .colors=${Object.values(this._data).map((data) => data.color)}
        .onTabClick=${this._handleTabClick}
      ></cx-tabbar>
      <cx-tree .aasPath=${this.aasPath}></cx-tree>
    `;
  }

  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    webvis.addContextCreatedListener(async () => {
      await this._handleTabClick(0);
    });
  }
}
