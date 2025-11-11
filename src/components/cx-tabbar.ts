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
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

/**
 * This component displays a tab bar.
 */
@customElement("cx-tabbar")
export class CxTabbar extends LitElement {
  /**
   * The tabs to display.
   */
  @property({ type: Array }) tabs: string[] = [];

  /**
   * The colors of the individual tabs.
   */
  @property({ type: Array }) colors: string[] = [];

  /**
   * The index of the selected tab.
   */
  @property({ type: Number }) selectedTab = 0;

  /**
   * Callback function that is called when a tab is clicked.
   */
  @property({ type: Object }) onTabClick?: (index: number) => void;

  _handleTabClick = (index: number) => {
    this.selectedTab = index;
    this.onTabClick?.(index);
  };

  static styles = css`
    :host {
      display: flex;
      margin: 0 0.5rem;
      overflow-x: auto;
      padding-bottom: 1rem;
      gap: 0.5rem;
    }

    button {
      display: flex;
      border: none;
      border-bottom: 4px solid transparent;
      background: transparent;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.5rem 1rem;
      white-space: nowrap;
    }

    button:hover {
      background: #f0f0f0 !important;
    }
  `;

  render() {
    return html`
      ${this.tabs.map(
        (tab, index) => html`
          <button
            @click=${() => this._handleTabClick(index)}
            style=${styleMap({
              background:
                index === this.selectedTab ? this.colors[index] : "transparent",
              borderBottom: `4px solid ${this.colors[index]}`,
            })}
          >
            ${tab}
          </button>
        `
      )}
    `;
  }
}
