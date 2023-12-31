import _ from 'lodash';
import { Item } from '../types/Item';
import { ItemType } from './ItemType';
import { ItemData } from './ItemData';
import ArmorData from '../data/json/Armor.json';
import WeaponData from '../data/json/Weapons.json';

export enum LibraryType {
    Armor = "Armor",
    Weapons = "Weapons"
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

export class ItemLibrary {
    private armor: Item[];
    private weapons: Item[];
    // public UniqueItems: UniqueItemLibrary;
    // public Gems: GemLibrary;

    constructor() {
        this.armor = [];
        this.weapons = [];

        ArmorData.forEach((itemData: ItemData) => {
            this.armor.push(new Item(itemData));
        });

        WeaponData.forEach((itemData: ItemData) => {
            this.weapons.push(new Item(itemData));
        });
    }

    //#region Armor
    get Armor() {return this.armor}
    get Helms() {return this.FilterItemsByType(this.armor, ItemType.Helm, [ItemType.Circlet, ItemType.Pelt, ItemType.PrimalHelm])}
    get Circlets() {return this.FilterItemsByType(this.armor, ItemType.Circlet)}
    get Pelts() {return this.FilterItemsByType(this.armor, ItemType.Pelt)}
    get PrimalHelms() {return this.FilterItemsByType(this.armor, ItemType.PrimalHelm)}
    get BodyArmor() {return this.FilterItemsByType(this.armor, ItemType.Armor)}
    get Robes() {return this.FilterItemsByType(this.armor, [ItemType.Robe, ItemType.Cloak])}
    get Shields() {return this.FilterItemsByType(this.armor, ItemType.Shield)}
    get ShrunkenHeads() {return this.FilterItemsByType(this.armor, ItemType.VoodooHeads)}
    get AuricShields() {return this.FilterItemsByType(this.armor, ItemType.AuricShields)}
    get Gloves() {return this.FilterItemsByType(this.armor, ItemType.Gloves)}
    get Belts() {return this.FilterItemsByType(this.armor, ItemType.Belt)}
    get Boots() {return this.FilterItemsByType(this.armor, ItemType.Boots)}
    //#endregion

    //#region Weapons
    get Weapons() {return this.weapons}
    get Axes() {return this.FilterItemsByType(this.weapons, ItemType.Axe)}
    get Bows() {return this.FilterItemsByType(this.weapons, ItemType.Bow)}
    get Crossbows() {return this.FilterItemsByType(this.weapons, ItemType.Crossbow)}
    get Daggers() {return this.FilterItemsByType(this.weapons, ItemType.Knife)}
    get Javelins() {return this.FilterItemsByType(this.weapons, ItemType.Javelin)}
    get Knuckles() {return this.FilterItemsByType(this.weapons, ItemType.Knuckle)}
    get Maces() {return this.FilterItemsByType(this.weapons, ItemType.Mace)}
    get Polearms() {return this.FilterItemsByType(this.weapons, ItemType.Polearm)}
    get Scepters() {return this.FilterItemsByType(this.weapons, ItemType.Scepter)}
    get Spears() {return this.FilterItemsByType(this.weapons, ItemType.Spear)}
    get Staves() {return this.FilterItemsByType(this.weapons, ItemType.Staff)}
    get Swords() {return this.FilterItemsByType(this.weapons, ItemType.Sword)}
    get ThrowingWeapons() {return this.FilterItemsByTypeGroup(this.weapons, ThrowingWeapons)}
    get Wands() {return this.FilterItemsByType(this.weapons, ItemType.Wand)}
    get AmazonWeapons() {return this.FilterItemsByTypeGroup(this.weapons, AmazonWeapons)}
    get AssassinWeapons() {return this.FilterItemsByTypeGroup(this.weapons, AssassinWeapons)}
    get BarbarianWeapons() {return this.FilterItemsByType(this.weapons, ItemType.BarbarianJavs)}
    get DruidWeapons() {return this.FilterItemsByType(this.weapons, ItemType.DruidClub)}
    get NecromancerWeapons() {return this.FilterItemsByTypeGroup(this.weapons, NecromancerWeapons)}
    get PaladinWeapons() {return this.FilterItemsByType(this.weapons, ItemType.PaladinSword)}
    get SorceressWeapons() {return this.FilterItemsByTypeGroup(this.weapons, SorceressWeapons)}
    //#endregion

    private Filter(items: Item[], predicate: _.ListIterateeCustom<Item, boolean> | undefined) {
        return _(items)
                    .filter(predicate)
                    .sortBy(item => item.QualityLevel)
                    .sortBy(item => item.Tier)
                    .uniqBy(item => item.Name)
                    .value();
    }
    
    GetAllItemsByType(type: ItemType | ItemType[]) {
        return this.FilterItemsByType(this.armor, type)
                        .concat(this.FilterItemsByType(this.weapons, type));
    }
    
    FilterItemsByType(items: Item[], include: ItemType | ItemType[], exclude?: ItemType | ItemType[]) {
        let result;

        if (include instanceof Array) {
            result = this.Filter(items, (item) => include.every(val => item.TypeCodes.includes(val)));
        } else {
            result = this.Filter(items, (item) => item.TypeCodes.includes(include));
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

    FilterItemsByTypeGroup(items: Item[], include: ItemType[]) {
        return this.Filter(items, item => include.includes(item.Type));
    }

    GetArmorByCode(code: string) {
        return this.armor.find(item => item.Code == code);
    }

    GetWeaponByCode(code: string) {
        return this.weapons.find(item => item.Code == code);
    }

    GetItemByCode(code: string) {
        let item = this.GetArmorByCode(code);
        if (item) {return item;}
        item = this.GetWeaponByCode(code);
        return item;
    }
}