import { Item, BodyLocation } from './Item';

export enum Slot {
    Empty = "",
    Primary1 = "Primary1",
    Secondary1 = "Secondary1",
    Primary2 = "Primary2",
    Secondary2 = "Secondary2",
    Body = "Body",
    Helm = "Helm",
    Gloves = "Gloves",
    Belt = "Belt",
    Boots = "Boots",
    Amulet = "Amulet",
    LeftRing = "LeftRing",
    RightRing = "RightRing"
}

export enum SlotType {
    Empty = Slot.Empty,
    Primary = "Primary",
    Secondary = "Secondary",
    Body = Slot.Body,
    Helm = Slot.Helm,
    Gloves = Slot.Gloves,
    Belt = Slot.Belt,
    Boots = Slot.Boots,
    Amulet = Slot.Amulet,
    Ring = "Ring"
}

export const SlotTypeToBodyLocations = (slotType: SlotType) => {
    switch (slotType) {
        case SlotType.Primary:
        case SlotType.Secondary:
            return [BodyLocation.LeftArm, BodyLocation.RightArm];
        case SlotType.Body:
            return [BodyLocation.Torso];
        case SlotType.Helm:
            return [BodyLocation.Head];
        case SlotType.Gloves:
            return [BodyLocation.Gloves];
        case SlotType.Belt:
            return [BodyLocation.Belt];
        case SlotType.Boots:
            return [BodyLocation.Feet];
        case SlotType.Amulet:
            return [BodyLocation.Neck];
        case SlotType.Ring:
            return [BodyLocation.LeftRing, BodyLocation.RightRing];
        case SlotType.Empty:
        default:
            return [BodyLocation.None];    
    }
}

export const GetSlotType = (slot: Slot) => {
    switch(slot) {
        case Slot.Primary1:
        case Slot.Primary2:
            return SlotType.Primary;
        case Slot.Secondary1:
        case Slot.Secondary2:
            return SlotType.Secondary;
        case Slot.LeftRing:
        case Slot.RightRing:
            return SlotType.Ring;
        case Slot.Body:
        case Slot.Helm:
        case Slot.Gloves:
        case Slot.Belt:
        case Slot.Boots:
        case Slot.Amulet:
            return SlotType[slot];
        case Slot.Empty:
        default:
            return SlotType.Empty;
    }
}

export const SLOT_TYPE_OPTIONS = [
    {label: SlotType.Empty, value: SlotType.Empty},
    {label: SlotType.Primary, value: SlotType.Primary},
    {label: SlotType.Secondary, value: SlotType.Secondary},
    {label: SlotType.Body, value: SlotType.Body},
    {label: SlotType.Helm, value: SlotType.Helm},
    {label: SlotType.Gloves, value: SlotType.Gloves},
    {label: SlotType.Belt, value: SlotType.Belt},
    {label: SlotType.Boots, value: SlotType.Boots},
    {label: SlotType.Amulet, value: SlotType.Amulet},
    {label: SlotType.Ring, value: SlotType.Ring}
];

export interface Inventory {
    [index: string]: Item | null;
    
    Primary1:   Item | null;
    Secondary1: Item | null;
    Primary2:   Item | null;
    Secondary2: Item | null;
    Body:       Item | null;
    Helm:       Item | null;
    Gloves:     Item | null;
    Belt:       Item | null;
    Boots:      Item | null;
    Amulet:     Item | null;
    LeftRing:   Item | null;
    RightRing:  Item | null;
}

export const NewInventory = (): Inventory => {
    return {
        Primary1:   null,
        Secondary1: null,
        Primary2:   null,
        Secondary2: null,
        Body:       null,
        Helm:       null,
        Gloves:     null,
        Belt:       null,
        Boots:      null,
        Amulet:     null,
        LeftRing:   null,
        RightRing:  null
    }
}