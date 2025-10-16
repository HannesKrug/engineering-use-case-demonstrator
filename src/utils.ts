/**
 * @deprecated Used in an older version of the app
 */
export async function createNodePathMap(
  modelFile: string
): Promise<Map<string, number>> {
  const nodePathStrings = getNodePathStrings(modelFile);
  const nodePathHandleMap: webvis.NodePathHandleMap | undefined = await webvis
    .getContext()
    ?.requestNodePathHandleMap(nodePathStrings);
  if (nodePathHandleMap === undefined) {
    throw new Error("Node Path Handle Map is undefined");
  }
  const nodeIds = Object.values(nodePathHandleMap).map(
    (nodePathHandle) => nodePathHandle.nodeID
  );
  return new Map(
    nodePathStrings.map((nodePath, index) => [nodePath, nodeIds[index]])
  );
}

/**
 * @deprecated Used in an older version of the app
 */
function getNodePathStrings(modelFile: string): string[] {
  const searchParams = new URLSearchParams(modelFile.split("?")[1]);
  const nodePathStrings = searchParams.get("nodePathStrings");
  if (nodePathStrings === null) {
    throw new Error("nodePathStrings is null");
  }
  return nodePathStrings.split(",");
}

/**
 * Gets the base data for the manufacturers (AAS path and color).
 * @returns The base data for the manufacturers.
 */
export function getManufacturerData(): {
  [manufacturer: string]: { aas: string; color: string };
} {
  const data = {
    "Participant 1": { aas: "AAS_P1.json", color: "#b8af4a" },
    "Participant 2": { aas: "AAS_P2.json", color: "#3d746d" },
    "Participant 3": { aas: "AAS_P3.json", color: "#3f3064" },
    "Participant 4": { aas: "AAS_P4.json", color: "#e65e31" },
    "Participant 5": { aas: "AAS_P5.json", color: "#8c2f39" },
  };
  return data;
}

//---------------------------------------------------------------------------------------
// Type Guards for the Catena-X aspect models
//---------------------------------------------------------------------------------------

export function isAAS(data: unknown): data is App.AAS {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "part" in data &&
    "cad" in data
  );
}

export function isPart(data: unknown): data is App.Part {
  return (
    typeof data === "object" && data !== null && "partTypeInformation" in data
  );
}

export function isBOM(data: unknown): data is App.BOM {
  return (
    typeof data === "object" &&
    data !== null &&
    "childItems" in data &&
    Array.isArray(data.childItems) &&
    data.childItems.length > 0 &&
    "businessPartner" in data.childItems[0]
  );
}

export function isCAD(data: unknown): data is App.CAD {
  return (
    typeof data === "object" &&
    data !== null &&
    "childItems" in data &&
    Array.isArray(data.childItems) &&
    data.childItems.length > 0 &&
    !isBOM(data)
  );
}

export function isModelData(data: unknown): data is App.ModelData {
  return (
    typeof data === "object" &&
    data !== null &&
    "catenaXId" in data &&
    "file" in data
  );
}
