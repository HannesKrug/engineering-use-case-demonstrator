/********************************************************************************
 * Copyright (c) 2025 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ********************************************************************************/

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
