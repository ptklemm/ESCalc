import _ from 'lodash';
import { Item, BodyLocation, ClassRestriction } from '../types/Item';
import { ItemType } from './ItemType';
import { ItemData } from './ItemData';
import ArmorData from '../data/json/Armor.json';
import WeaponData from '../data/json/Weapons.json';

function Filter(items: Item[], predicate: _.ListIterateeCustom<Item, boolean> | undefined) {
    return _(items)
                .filter(predicate)
                .sortBy(item => item.QualityLevel)
                .sortBy(item => item.Tier)
                .uniqBy(item => item.Name)
                .value();
}

function FilterByBodyLocation (items: Item[], bodyLocation: BodyLocation) {
    return Filter(items, item => item.BodyLocations.has(bodyLocation));
}

function FilterByItemType (items: Item[], itemType: ItemType) {
    return Filter(items, item => item.Type == itemType);
}

export class ArmorLibrary {
    public Helms: Item[];
    public Circlets: Item[];
    public Pelts: Item[];
    public PrimalHelms: Item[];
    public BodyArmor: Item[];
    public Robes: Item[];
    public Shields: Item[];
    public ShrunkenHeads: Item[];
    public AuricShields: Item[];
    public Gloves: Item[];
    public Belts: Item[];
    public Boots: Item[];

    constructor(armor: Item[]) {
        this.Helms = FilterByBodyLocation(armor, BodyLocation.Head);
        this.Circlets = _.remove(this.Helms, item => item.Type == ItemType.Circlet);
        this.Pelts = _.remove(this.Helms, item => item.ClassRestriction == ClassRestriction.Druid);
        this.PrimalHelms = _.remove(this.Helms, item => item.ClassRestriction == ClassRestriction.Barbarian);
        this.BodyArmor = FilterByBodyLocation(armor, BodyLocation.Torso);
        this.Robes = _.remove(this.BodyArmor, item => item.Type == ItemType.Robe || item.Type == ItemType.Cloak);
        this.Shields = Filter(armor, item => item.BodyLocations.has(BodyLocation.LeftArm) || item.BodyLocations.has(BodyLocation.RightArm));
        this.ShrunkenHeads = _.remove(this.Shields, item => item.Type == ItemType.VoodooHeads);
        this.AuricShields = _.remove(this.Shields, item => item.Type == ItemType.AuricShields);
        this.Gloves = FilterByBodyLocation(armor, BodyLocation.Gloves);
        this.Belts = FilterByBodyLocation(armor, BodyLocation.Belt);
        this.Boots = FilterByBodyLocation(armor, BodyLocation.Feet);
    }
}

export class WeaponLibrary {
    public Axes: Item[];
    public Bows: Item[];
    public Crossbows: Item[];
    public Daggers: Item[];
    public Javelins: Item[];
    public Knuckles: Item[];
    public Maces: Item[];
    public Polearms: Item[];
    public Scepters: Item[];
    public Spears: Item[];
    public Staves: Item[];
    public Swords: Item[];
    public ThrowingWeapons: Item[];
    public Wands: Item[];
    // public AmazonWeapons: Item[];
    // public AssassinWeapons: Item[];
    // public BarbarianWeapons: Item[];
    // public DruidWeapons: Item[];
    // public NecromancerWeapons: Item[];
    // public PaladinWeapons: Item[];
    // public SorceressWeapons: Item[];

    constructor(weapons: Item[]) {
        this.Axes = FilterByItemType(weapons, ItemType.Axe);
        this.Bows = FilterByItemType(weapons, ItemType.Bow);
        this.Crossbows = FilterByItemType(weapons, ItemType.Crossbow);
        this.Daggers = FilterByItemType(weapons, ItemType.Knife);
        this.Javelins = FilterByItemType(weapons, ItemType.Javelin);
        this.Knuckles = FilterByItemType(weapons, ItemType.Knuckle);
        this.Maces = FilterByItemType(weapons, ItemType.Mace);
        this.Polearms = FilterByItemType(weapons, ItemType.Polearm);
        this.Scepters = FilterByItemType(weapons, ItemType.Scepter);
        this.Spears = FilterByItemType(weapons, ItemType.Spear);
        this.Staves = FilterByItemType(weapons, ItemType.Staff);
        this.Swords = FilterByItemType(weapons, ItemType.Sword);
        this.ThrowingWeapons = Filter(weapons, item => item.Type == ItemType.ThrowingAxe || item.Type == ItemType.ThrowingKnife);
        this.Wands = FilterByItemType(weapons, ItemType.Wand);
    }
}

export class ItemLibrary {
    public Armor: ArmorLibrary;
    public Weapons: WeaponLibrary;
    // public UniqueItems: UniqueItemLibrary;
    // public Gems: GemLibrary;

    constructor() {
        const armor: Item[] = [];
        const weapons: Item[] = [];

        ArmorData.forEach((itemData: ItemData) => {
            armor.push(new Item(itemData));
        });

        WeaponData.forEach((itemData: ItemData) => {
            weapons.push(new Item(itemData));
        });

        this.Armor = new ArmorLibrary(armor);
        this.Weapons = new WeaponLibrary(weapons);
    }
}