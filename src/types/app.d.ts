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
