import _ from 'lodash';

import MiscellaneousJson from '../data/json/Miscellaneous.json';
import ArmorJson from '../data/json/Armor.json';
import WeaponJson from '../data/json/Weapons.json';
import PropertyJson from '../data/json/Properties.json';
import UniqueItemJson from '../data/json/UniqueItems.json';

import { MiscellaneousItemData } from './MiscellaneousItemData';
import { ArmorItemData } from './ArmorItemData';
import { WeaponItemData } from './WeaponItemData';
import { PropertyData } from './PropertyData';
import { UniqueItemData } from './UniqueItemData';

import { Item, ArmorItem, WeaponItem, UniqueItem } from './Item';
import { Property } from './Property';
import { ItemType } from './ItemType';

export enum Category {
    Armor = "Armor",
    Weapons = "Weapons",
    UniqueArmor = "UniqueArmor",
    UniqueWeapons = "UniqueWeapons",
    Sets = "Sets",
    Gems = "Gems",
    Runewords = "Runewords",
    Gemwords = "Gemwords",
    Properties = "Properties"
}

const ThrowingWeapons = [
    ItemType.ThrowingAxe, 
    ItemType.ThrowingKnife
];

const AmazonWeapons = [
    ItemType.AmazonBow1,
    ItemType.AmazonBow2,
    ItemType.AmazonJavelin,
    ItemType.AmazonSpear
];

const AssassinWeapons = [
    ItemType.Assassin2HKatana,
    ItemType.HandToHand1,
    ItemType.HandToHand2
];

const NecromancerWeapons = [
    ItemType.NecromancerDagger, 
    ItemType.NecromancerPolearm
];

const SorceressWeapons = [
    ItemType.Orb,
    ItemType.SorceressManaBlade
];

export class ItemCatalog {
    private miscellaneous: Item[];
    private armor: ArmorItem[];
    private weapons: WeaponItem[];
    private properties: Property[];
    private uniques: UniqueItem[];

    constructor() {
        this.miscellaneous = [];
        this.armor = [];
        this.weapons = [];
        this.properties = [];
        this.uniques = [];

        // ToDo: Figure out why Typescript thinks this is an object
        (MiscellaneousJson as MiscellaneousItemData[]).forEach((miscItemData: MiscellaneousItemData) => {
            this.miscellaneous.push(new Item(miscItemData));
        });

        ArmorJson.forEach((itemData: ArmorItemData) => {
            this.armor.push(new ArmorItem(itemData));
        });

        WeaponJson.forEach((itemData: WeaponItemData) => {
            this.weapons.push(new WeaponItem(itemData));
        });

        PropertyJson.forEach((propertyData: PropertyData) => {
            this.properties.push(new Property(propertyData));
        });

        UniqueItemJson.forEach((uniqueItemData: UniqueItemData) => {
            this.uniques.push(new UniqueItem(this, uniqueItemData));
        })

        console.log(this.GetUniqueItemByName('Eye of the Witch'))
    }

    //#region Armor
    get Armor() {return this.armor}
    get Helms() {return this.GetItemsByType(this.armor, ItemType.Helm, [ItemType.Circlet, ItemType.Pelt, ItemType.PrimalHelm])}
    get Circlets() {return this.GetItemsByType(this.armor, ItemType.Circlet)}
    get Pelts() {return this.GetItemsByType(this.armor, ItemType.Pelt)}
    get PrimalHelms() {return this.GetItemsByType(this.armor, ItemType.PrimalHelm)}
    get BodyArmor() {return this.GetItemsByType(this.armor, ItemType.Armor)}
    get Robes() {return this.GetItemsByType(this.armor, [ItemType.Robe, ItemType.Cloak])}
    get Shields() {return this.GetItemsByType(this.armor, ItemType.Shield)}
    get ShrunkenHeads() {return this.GetItemsByType(this.armor, ItemType.VoodooHeads)}
    get AuricShields() {return this.GetItemsByType(this.armor, ItemType.AuricShields)}
    get Gloves() {return this.GetItemsByType(this.armor, ItemType.Gloves)}
    get Belts() {return this.GetItemsByType(this.armor, ItemType.Belt)}
    get Boots() {return this.GetItemsByType(this.armor, ItemType.Boots)}
    //#endregion

    //#region Weapons
    get Weapons() {return this.weapons}
    get Axes() {return this.GetItemsByType(this.weapons, ItemType.Axe)}
    get Bows() {return this.GetItemsByType(this.weapons, ItemType.Bow)}
    get Crossbows() {return this.GetItemsByType(this.weapons, ItemType.Crossbow)}
    get Daggers() {return this.GetItemsByType(this.weapons, ItemType.Knife)}
    get Javelins() {return this.GetItemsByType(this.weapons, ItemType.Javelin)}
    get Knuckles() {return this.GetItemsByType(this.weapons, ItemType.Knuckle)}
    get Maces() {return this.GetItemsByType(this.weapons, ItemType.Mace)}
    get Polearms() {return this.GetItemsByType(this.weapons, ItemType.Polearm)}
    get Scepters() {return this.GetItemsByType(this.weapons, ItemType.Scepter)}
    get Spears() {return this.GetItemsByType(this.weapons, ItemType.Spear)}
    get Staves() {return this.GetItemsByType(this.weapons, ItemType.Staff)}
    get Swords() {return this.GetItemsByType(this.weapons, ItemType.Sword)}
    get ThrowingWeapons() {return this.GetItemsByTypeGroup(this.weapons, ThrowingWeapons)}
    get Wands() {return this.GetItemsByType(this.weapons, ItemType.Wand)}
    get AmazonWeapons() {return this.GetItemsByTypeGroup(this.weapons, AmazonWeapons)}
    get AssassinWeapons() {return this.GetItemsByTypeGroup(this.weapons, AssassinWeapons)}
    get BarbarianWeapons() {return this.GetItemsByType(this.weapons, ItemType.BarbarianJavs)}
    get DruidWeapons() {return this.GetItemsByType(this.weapons, ItemType.DruidClub)}
    get NecromancerWeapons() {return this.GetItemsByTypeGroup(this.weapons, NecromancerWeapons)}
    get PaladinWeapons() {return this.GetItemsByType(this.weapons, ItemType.PaladinSword)}
    get SorceressWeapons() {return this.GetItemsByTypeGroup(this.weapons, SorceressWeapons)}
    //#endregion

    //#region Unique Items
    get UniqueItems() {return this.uniques}


    private FilterAndSortItems(items: Item[], predicate: _.ListIterateeCustom<Item, boolean> | undefined) {
        return _(items)
                    .filter(predicate)
                    .sortBy(item => item.QualityLevel)
                    .sortBy(item => item.Tier)
                    .uniqBy(item => item.Name)
                    .value();
    }
    
    GetAllItemsByType(type: ItemType | ItemType[]) {
        return this.GetItemsByType(this.armor, type)
                        .concat(this.GetItemsByType(this.weapons, type));
    }
    
    GetItemsByType(items: Item[], include: ItemType | ItemType[], exclude?: ItemType | ItemType[]) {
        let result;

        if (include instanceof Array) {
            result = this.FilterAndSortItems(items, (item) => include.every(val => item.TypeCodes.includes(val)));
        } else {
            result = this.FilterAndSortItems(items, (item) => item.TypeCodes.includes(include));
        }

        if (exclude) {
            if (exclude instanceof Array) {
                result = result.filter(item => exclude.every(val => !item.TypeCodes.includes(val)));
            } else {
                result = result.filter(item => !item.TypeCodes.includes(exclude));
            }
        }

        return result;
    }

    GetItemsByTypeGroup(items: Item[], include: ItemType[]) {
        return this.FilterAndSortItems(items, item => include.includes(item.Type));
    }

    GetMiscByCode(code: string) {
        return this.miscellaneous.find(item => item.Code == code);
    }

    GetArmorByCode(code: string) {
        return this.armor.find(item => item.Code == code);
    }

    GetWeaponByCode(code: string) {
        return this.weapons.find(item => item.Code == code);
    }

    GetItemByCode(code: string) {
        let item: Item | undefined;
        item = this.GetMiscByCode(code);
        if (item) {return item;}
        item = this.GetArmorByCode(code);
        if (item) {return item;}
        item = this.GetWeaponByCode(code);
        return item;
    }

    GetPropertyByCode(code: string) {
        return this.properties.find(property => property.Code == code);
    }

    private FilterAndSortUniqueItems(uniqueItems: UniqueItem[], predicate: _.ListIterateeCustom<UniqueItem, boolean> | undefined) {
        return _(uniqueItems)
            .filter(predicate)
            .sortBy(unique => unique.QualityLevelUnique)
            .sortBy(unique => unique.BaseItem?.Tier)
            .value();
    }

    GetUniqueItemsByBaseType(uniqueItems: UniqueItem[], include: ItemType) {
        return uniqueItems.filter(unique => unique.BaseItem?.TypeCodes.includes(include));
    }

    GetUniqueItemByName(name: string) {
        return this.uniques.find(unique => unique.Name == name);
    }
}