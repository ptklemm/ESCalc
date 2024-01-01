import { PropertyData } from "./PropertyData";
export type Stat = {
    Index: number;
    Code: string;
    Function: string;
    Set: string;
    Value: string;
}

export class Property {
    public Code: string;
    public IsActive: boolean;
    public Description: string;
    public DescriptionParameter: string;
    public DescriptionMin: string;
    public DescriptionMax: string;
    public Notes: string;
    public Stats: Stat[];

    constructor(data: PropertyData) {
        this.Code = data.code;
        this.IsActive = Boolean(data["*done"]);
        this.Description = data["*desc"];
        this.DescriptionParameter = data["*param"];
        this.DescriptionMin = data["*min"];
        this.DescriptionMax = data["*max"];
        this.Notes = data["*notes"];

        this.Stats = [];
        for (let i = 1; i < 8; i++) {
            this.Stats.push({
                Index: i,
                Code: data[`stat${i}` as keyof PropertyData],
                Function: data[`func${i}` as keyof PropertyData],
                Set: data[`set${i}` as keyof PropertyData],
                Value: data[`val${i}` as keyof PropertyData]
            });
        }
    }
}

export class MagicProperty {
    public Name: string;
    public Parameter: string;
    public Min: number;
    public Max: number;
    // public Property: Property;

    constructor(property: Property, parameter: string, min: number, max: number) {
        this.Name = property.Code;
        this.Parameter = parameter;
        this.Min = min;
        this.Max = max;
        // this.Property = property;
    }
}