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
