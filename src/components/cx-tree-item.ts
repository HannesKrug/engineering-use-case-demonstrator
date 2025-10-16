import { css, html, LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { Loader } from "../loader";
import {
  getManufacturerData,
  isAAS,
  isBOM,
  isCAD,
  isModelData,
  isPart,
} from "../utils";
import { visDB } from "../visualizer-db";

/**
 * This component represents a tree item in the Catena-X tree view.
 *
 * @see `cx-tree`
 */
@customElement("cx-tree-item")
export class CxTreeItem extends LitElement {
  /**
   * Reference to the loader which is used to load the data from the underlying Catena-X JSON files.
   */
  @property({ type: Object }) loader: Loader | undefined;

  /**
   * The underlying data of the tree item which will be displayed.
   */
  @property({ type: Object }) data:
    | App.AAS
    | App.Part
    | App.BOM
    | App.CAD
    | App.ModelData
    | undefined;

  /**
   * The depth of the tree item in the tree hierarchy.
   */
  @property({ type: Number }) depth: number = 0;

  /**
   * The ID of the parent item in the tree hierarchy.
   */
  @property({ type: String }) parentTreeItemId: string = "/";

  /**
   * The transform matrix of the tree item in the 3D viewer (if applicable).
   */
  @property({ type: Object }) transform: Float32Array = new Float32Array([
    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
  ]);

  /**
   * The owner of the tree item.
   */
  @property({ type: String }) owner: string = "";

  /**
   * Flag indicating whether the child items of a tree item have been loaded.
   */
  @state() childItemsLoaded: boolean = false;

  /**
   * Holds a list of child item data.
   */
  @state() childData: (
    | App.AAS
    | App.Part
    | App.BOM
    | App.CAD
    | App.ModelData
  )[] = [];

  /**
   * Flag indicating whether the tree item is expanded (i.e., its child items are visible).
   */
  @state() expanded = false;

  /**
   * Flag indicating whether the associated 3D model is rendered in the 3D viewer.
   */
  @state() shows3DModel = false;

  /**
   * The ID of the tree item in the tree hierarchy.
   */
  @state() treeItemId: string = "";

  /**
   * Holds a list of child item metadata.
   */
  @state() childMetaData: { transform?: Float32Array; owner: string }[] = [];

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      border-left: 1px solid #ccc;
    }

    .wrapper {
      display: flex;
      gap: 0.1rem;
      width: 100%;
    }

    .color-indicator {
      width: 0.5rem;
    }

    .container {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.5rem;
    }

    .container:hover.container:not(.disabled) {
      cursor: pointer;
      background-color: #f0f0f0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      font-size: 1.2rem;
    }

    .subheader {
      font-size: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
    }

    .disabled {
      opacity: 0.5;
    }

    .container:hover.disabled {
      cursor: not-allowed;
    }

    .disabled:active {
      pointer-events: none;
    }

    .content {
      display: grid;
      grid-template-columns: 1fr 4fr;
      gap: 0.5rem;
      font-size: 0.8rem;
      align-items: flex-end;
    }

    .content span {
      border-bottom: 1px dotted #ccc;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  `;

  render() {
    if (this.data === undefined) {
      return html`<span>Node is undefined</span>`;
    }
    const containerClasses = classMap({
      container: true,
      disabled: false,
    });
    return html`
      <div class="wrapper">
        <div
          class="color-indicator"
          style="background-color: ${this._getOwnerColor()}"
        ></div>
        <div class=${containerClasses}>${this._renderContent()}</div>
      </div>
      ${this.expanded
        ? this.childItemsLoaded
          ? html`
              ${this.childData.map(
                (childItem, idx) =>
                  html`<cx-tree-item
                    .loader=${this.loader}
                    .data=${childItem}
                    .depth=${this.depth + 1}
                    .parentTreeItemId=${this.treeItemId}
                    .transform=${this.childMetaData[idx] === undefined ||
                    this.childMetaData[idx].transform === undefined
                      ? new Float32Array([
                          1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
                        ])
                      : this.childMetaData[idx].transform}
                    .owner=${this.childMetaData[idx] === undefined
                      ? ""
                      : this.childMetaData[idx].owner}
                  ></cx-tree-item>`
              )}
            `
          : html`<cx-loading-indicator text="Loading child data...">
            </cx-loading-indicator>`
        : nothing}
    `;
  }

  private _renderContent() {
    if (isAAS(this.data)) {
      return this._renderAAS();
    } else if (isPart(this.data)) {
      return this._renderPart();
    } else if (isBOM(this.data)) {
      return this._renderBOM();
    } else if (isCAD(this.data)) {
      return this._renderCAD();
    } else if (isModelData(this.data)) {
      return this._renderModelData();
    } else {
      return html`<span>Unknown data type</span>`;
    }
  }

  private _renderAAS() {
    if (!isAAS(this.data)) {
      return html`<span>Invalid AAS data</span>`;
    }
    const disabledClassMap = classMap({
      disabled: !this.data.access,
    });
    return html`
      <div class="header ${disabledClassMap}">
        <span>AAS</span>
        ${this.data.access
          ? this._renderExpandButton()
          : html`<cx-icon-button
              icon="lock"
              size="small"
              type="tertiary"
            ></cx-icon-button>`}
      </div>
      <div class="content ${disabledClassMap}">
        <span>idShort</span>
        <span>${this.data.idShort}</span>
      </div>
    `;
  }

  private _renderPart() {
    if (!isPart(this.data)) {
      return html`<span>Invalid Part data</span>`;
    }
    return html`
      <div class="header">
        <span>PartTypeInformation</span>
      </div>
      <div class="content">
        <span>Manufacturer</span>
        <span>${this.data.partTypeInformation.manufacturerPartId}</span>
        <span>Name At Manufacturer</span>
        <span>${this.data.partTypeInformation.nameAtManufacturer}</span>
      </div>
    `;
  }

  private _renderBOM() {
    if (!isBOM(this.data)) {
      return html`<span>Invalid BOM data</span>`;
    }
    return html`
      <div class="header">
        <span>SingleLevelBOMAs-X</span>
      </div>
      <div class="content">
        <span>Catena-X ID</span>
        <span>${this.data.catenaXId}</span>
      </div>
      <div class="subheader">ChildItems</div>
      <div class="content">
        ${this.data.childItems.map(
          (childItem) => html` <span>Business Partner</span>
            <span>${childItem.businessPartner}</span>
            <span>Catena-X ID</span>
            <span>${childItem.catenaXId}</span>`
        )}
      </div>
    `;
  }

  private _renderCAD() {
    if (!isCAD(this.data)) {
      return html`<span>Invalid CAD data</span>`;
    }
    return html`
      <div class="header">
        <span>3dDataAs-X</span>
        ${this._renderExpandButton()}
      </div>
      <div class="content">
        <span>Catena-X ID</span>
        <span>${this.data.catenaXId}</span>
      </div>
      <div class="subheader">ChildItems</div>
      <div class="content">
        ${this.data.childItems.map(
          (childItem) => html` <span>Catena-X ID</span>
            <span>${childItem.catenaXId}</span>
            <span>Transformation</span>
            <span>${childItem.transformation?.toString()}</span>`
        )}
      </div>
    `;
  }

  private _renderModelData() {
    if (!isModelData(this.data)) {
      return html`<span>Invalid ModelData</span>`;
    }
    return html`
      <div class="header">
        <span>3dModel</span>
        ${this._render3DButton(this.data.file)}
      </div>
      <div class="content">
        <span>Catena-X ID</span>
        <span>${this.data.catenaXId}</span>
      </div>
    `;
  }

  private _renderExpandButton() {
    return html`
      <cx-icon-button
        @click=${() => {
          this.expanded = !this.expanded;
        }}
        icon=${this.expanded ? "minus" : "plus"}
        size="small"
        type="secondary"
      >
      </cx-icon-button>
    `;
  }

  private _render3DButton(file: string) {
    return html`
      <cx-icon-button
        @click=${() => {
          this.shows3DModel
            ? this._unvisualizeModelData()
            : this._visualizeModelData(file);
          this.shows3DModel = !this.shows3DModel;
        }}
        icon=${this.shows3DModel ? "badge-3d-filled" : "badge-3d"}
        size="small"
        type="primary"
      >
      </cx-icon-button>
    `;
  }

  private _visualizeModelData(file: string) {
    const ctx = webvis.getContext();
    if (visDB.has(this.treeItemId) || ctx === undefined) {
      return;
    }
    const nodeId = ctx.add({
      dataURI: file,
      initialProperties: {
        enabled: true,
      },
    });
    ctx
      .setProperty(nodeId, webvis.Property.LOCAL_TRANSFORM, this.transform)
      .then(() => {
        ctx.getViewer().fitView();
      });
    ctx.setProperty(
      nodeId,
      webvis.Property.APPEARANCE_URI,
      this._getOwnerColor().replace("#", "")
    );
    visDB.set(this.treeItemId, { webvisNodeId: nodeId });
  }

  private _unvisualizeModelData() {
    const ctx = webvis.getContext();
    if (!visDB.has(this.treeItemId) || ctx === undefined) {
      return;
    }
    const nodeId = visDB.get(this.treeItemId)?.webvisNodeId;
    ctx.remove(nodeId);
    visDB.delete(this.treeItemId);
  }

  protected async update(changedProperties: PropertyValues): Promise<void> {
    super.update(changedProperties);
    if (
      changedProperties.has("data") &&
      this.data !== undefined &&
      this.loader !== undefined
    ) {
      this.owner = this._getOwner();
      // Model data and parts do not have child items.
      if (isModelData(this.data) || isPart(this.data)) {
        this.childItemsLoaded = true;
        return;
      }
      this.childItemsLoaded = false;
      try {
        await this._loadChildItems();
        this.childItemsLoaded = true;
      } catch (error) {
        console.error(error);
      }
    }
  }

  private async _loadChildItems() {
    if (this.data === undefined || this.loader === undefined) {
      console.error("Data or loader is undefined");
      return;
    }
    if (isAAS(this.data)) {
      this.childData = [
        this.data.part,
        this.data.cad,
        ...(this.data.bom ? [this.data.bom] : []),
      ];
      this.childMetaData = [
        {
          owner: this.data.part.partTypeInformation.manufacturerPartId,
        },
        {
          owner: this.data.part.partTypeInformation.manufacturerPartId,
        },
        {
          owner: this.data.part.partTypeInformation.manufacturerPartId,
        },
      ];
    } else if (isBOM(this.data)) {
      for (let childItem of this.data.childItems) {
        if (childItem.catenaXId === undefined) {
          console.error("CatenaX ID is undefined");
          return;
        }
        let childNode = await this.loader.loadAAS(
          `${childItem.catenaXId}.json`
        );
        this.childData = [...this.childData, childNode];
        this.childMetaData = [
          ...this.childMetaData,
          {
            owner: (childNode as App.AAS).part.partTypeInformation
              .manufacturerPartId,
          },
        ];
      }
    } else if (isCAD(this.data)) {
      for (let childItem of this.data.childItems) {
        if (childItem.catenaXId === undefined) {
          console.error("CatenaX ID is undefined");
          return;
        }
        let childNode;
        if (childItem.catenaXId.startsWith("AAS")) {
          childNode = await this.loader.loadAAS(`${childItem.catenaXId}.json`);
          if (this.depth > 1) {
            childNode.access = false;
          }
        } else {
          childNode = await this.loader.loadModel(
            `${childItem.catenaXId}.json`
          );
        }
        this.childData = [...this.childData, childNode];
        this.childMetaData = [
          ...this.childMetaData,
          {
            transform:
              childItem.transformation ||
              new Float32Array([
                1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
              ]),
            owner: childItem.catenaXId.startsWith("AAS")
              ? (childNode as App.AAS).part.partTypeInformation
                  .manufacturerPartId
              : this.owner,
          },
        ];
      }
    } else {
      console.error("Unknown data type");
    }
  }

  private _getOwner(): string {
    if (isAAS(this.data)) {
      return this.data.part.partTypeInformation.manufacturerPartId;
    } else if (isPart(this.data)) {
      return this.data.partTypeInformation.manufacturerPartId;
    } else {
      return this.owner;
    }
  }

  private _getOwnerColor(): string {
    const mData = getManufacturerData();
    if (mData === undefined || mData[this.owner] === undefined) {
      return "none";
    }
    return mData[this.owner].color;
  }

  connectedCallback(): void {
    super.connectedCallback();

    // Set the indentation of the tree item based on the depth.
    this.style.marginLeft = this.depth > 0 ? "1rem" : "0";

    // Set the tree ID based on the Catena-X ID.
    let tmpId;
    if (isAAS(this.data)) {
      tmpId = this.data.idShort;
    } else if (isPart(this.data)) {
      tmpId = this.data.catenaXId;
    } else if (isBOM(this.data)) {
      tmpId = this.data.catenaXId;
    } else if (isCAD(this.data)) {
      tmpId = this.data.catenaXId;
    } else if (isModelData(this.data)) {
      tmpId = this.data.catenaXId;
    } else {
      tmpId = "";
    }
    this.treeItemId = this.parentTreeItemId + tmpId + "/";
  }
}
