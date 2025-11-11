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

import { css, html, LitElement, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Loader } from "../loader";

/**
 * This component displays a tree visualization of an AAS and the linked Catena-X aspect models within it as `cx-tree-item` components.
 */
@customElement("cx-tree")
export class CxTree extends LitElement {
  /**
   * The path to the AAS of the participant to visualize.
   */
  @property({ type: String }) aasPath: string | undefined;

  /**
   * The (root) AAS of the participant.
   * This is set when the AAS is loaded.
   */
  @state() root: App.AAS | undefined;

  /**
   * The loader to use for loading the AAS.
   * **Note**: The loader uses the `VITE_CX_DATA_URL` environment variable to determine the base directory for loading the AAS.
   */
  @state() loader: Loader = new Loader(
    new URL(import.meta.env.VITE_CX_DATA_URL, document.baseURI).toString()
  );

  /**
   * Whether the AAS is currently being loaded.
   */
  @state() isLoading = false;

  /**
   * Whether an error occurred while loading the AAS.
   */
  @state() hasError = false;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 0 0.5rem;
      flex-grow: 1;
      overflow-y: auto;
      height: 1px;
    }
  `;

  render() {
    return html`
      <h1>Catena-X View</h1>
      ${this._renderTree()}
    `;
  }

  _renderTree = () => {
    if (this.isLoading) {
      return html`<cx-loading-indicator
        text="Loading the AAS of the participant..."
      ></cx-loading-indicator>`;
    }

    if (this.hasError) {
      return html`<p>Error loading data.</p>`;
    }

    if (this.root === undefined) {
      return html`<p>No data available.</p>`;
    }

    return html`<cx-tree-item
      .loader=${this.loader}
      .data=${this.root}
      .depth=${0}
      .owner=${this.root.part.partTypeInformation.manufacturerPartId}
      parentTreeItemId="/"
    ></cx-tree-item>`;
  };

  protected async update(changedProperties: PropertyValues): Promise<void> {
    super.update(changedProperties);
    if (
      changedProperties.has("aasPath") &&
      this.aasPath !== undefined &&
      this.loader !== undefined
    ) {
      this.isLoading = true;
      try {
        this.root = await this.loader.loadAAS(this.aasPath);
      } catch (error) {
        console.error(error);
        this.hasError = true;
      } finally {
        this.isLoading = false;
      }
    }
  }
}
