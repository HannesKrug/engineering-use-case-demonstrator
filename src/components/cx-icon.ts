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
