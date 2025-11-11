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
