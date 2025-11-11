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

declare module App {
  export type AAS = {
    id: number;
    idShort: string;
    access: boolean;
    part: Part;
    cad: CAD;
    bom?: BOM;
  };

  export type Part = {
    catenaXId: string;
    partSiteInformationAsPlanned: [
      {
        catenaXsiteId: string;
        function: string;
        functionValidFrom: string;
        functionValidUntil: string;
      }
    ];
    partTypeInformation: {
      classification: string;
      manufacturerPartId: string;
      nameAtManufacturer: string;
    };
  };

  export type ModelData = {
    catenaXId: string;
    file: string;
  };

  export type CAD = {
    catenaXId: string;
    childItems: {
      catenaXId: string;
      transformation: Float32Array;
    }[];
  };

  export type BOM = {
    catenaXId: string;
    childItems: {
      businessPartner: string;
      catenaXId: string;
      createdOn: string;
      lastModifiedOn: string;
      quantity: {
        measurementUnit: string;
        quantityNumber: number;
      };
      validityPeriod: {
        validFrom: string;
        validTo: string;
      };
    }[];
  };
}
