/**
 * Loader class for controlling the loading of Catena-X data.
 */
export class Loader {
  /**
   * Counter for generating unique {@link App.AAS} IDs.
   */
  private static _counter = 0;

  /**
   * @param baseDir Base path to where the mocked Catena-X data is stored.
   */
  constructor(public baseDir: string) {}

  /**
   * Loads the Asset Administration Shell (AAS) from the given path and
   * constructs a {@link App.AAS} from it.
   *
   * @param aasPath The path to the AAS JSON file relative to the {@link baseDir | base directory}.
   * @returns An {@link App.AAS}holding data from the AAS structure to visualize in the tree.
   */
  public async loadAAS(aasPath: string): Promise<App.AAS> {
    try {
      const response = await fetch(this.joinWithBase(aasPath));
      const aas = await response.json();

      const node: Partial<App.AAS> = {
        id: Loader._counter++,
        idShort: aas.idShort,
        access: true,
      };

      for (let submodelDescriptor of aas.submodelDescriptors) {
        const idShort = submodelDescriptor.idShort.toLowerCase();

        if (idShort.startsWith("part")) {
          const path: string =
            submodelDescriptor.endpoints[0].protocolInformation.href;
          try {
            node.part = await this._load<App.Part>(path);
          } catch (error) {
            throw new Error(
              `Error loading PartTypeInformation from ${path}: ${error}`
            );
          }
        }

        if (idShort.startsWith("3d")) {
          const path: string =
            submodelDescriptor.endpoints[0].protocolInformation.href;
          try {
            node.cad = await this._load<App.CAD>(path);
          } catch (error) {
            throw new Error(`Error loading 3dData from ${path}: ${error}`);
          }
        }

        if (idShort.startsWith("single-level-bom")) {
          const path: string =
            submodelDescriptor.endpoints[0].protocolInformation.href;
          try {
            node.bom = await this._load<App.BOM>(path);
          } catch (error) {
            throw new Error(
              `Error loading SingleLevelBOM from ${path}: ${error}`
            );
          }
        }
      }

      if (node.part === undefined) {
        throw new Error("Part not found in node");
      }

      if (node.cad === undefined) {
        throw new Error("CAD not found in node");
      }

      return node as App.AAS;
    } catch (error) {
      throw new Error(`Error loading AAS from ${aasPath}: ${error}`);
    }
  }

  /**
   * Loads the model data from the given path.
   *
   * @param modelPath The path to the model JSON file relative to the {@link baseDir | base directory}.
   * @returns The 3D model data.
   */
  public async loadModel(modelPath: string): Promise<App.ModelData> {
    return this._load<App.ModelData>(modelPath);
  }

  private async _load<T>(path: string): Promise<T> {
    const response = await fetch(this.joinWithBase(path));
    const part = (await response.json()) as T;
    return part;
  }

  private joinWithBase(path: string): string {
    if (this.baseDir.endsWith("/")) {
      return `${this.baseDir}${path}`;
    }
    return `${this.baseDir}/${path}`;
  }
}
