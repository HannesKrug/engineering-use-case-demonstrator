//--------------------------------------------------------------------------------------------
// Visualizer DB
// This file contains the database for the visualizer. It is used to store the mapping
// between the webvis node ID and the Catena-X 3dModel aspect model.
//--------------------------------------------------------------------------------------------

export type VisDBValue = {
  webvisNodeId: number;
};

/**
 * Keep tracl of which 3dModel (Catena-X aspect model) has been loaded in webvis.
 */
export const visDB: Map<string, VisDBValue> = new Map();
