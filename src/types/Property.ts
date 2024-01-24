import { toNumber } from "./utils";

export enum PropertyCode {
    Ethereal = "ethereal",
    Indestructible = "indestruct",
    EnhancedDamage = "dmg%",
    PlusMinimumDamage = "dmg-min",
    PlusMaximumDamage = "dmg-max",
    GettingHitFearsEnemy = "fear",
    AllStats = "all-stats",
    Strength = "str",
    StrengthPerLevel = "str/lvl",
    Dexterity = "dex",
    DexterityPerLevel = "dex/lvl",
    Vitality = "vit",
    VitalityPerLevel = "vit/lvl",
    Energy = "enr",
    EnergyPerLevel = "enr/lvl",
    Life = "hp",
    LifePerLevel = "hp/lvl",
    LifePercent = "hp%",
    Mana = "mana",
    ManaPerLevel = "mana/lvl",
    ManaPercent = "mana%",
    Stamina = "stam",
    StaminaPerLevel = "stam/lvl",
    Defense = "ac",
    DefensePerLevel = "ac/lvl",
    DefenseVsMissile = "ac-miss",
    DefensePercent = "ac%",
    DamageResist = "red-dmg%",
    DamageReduction = "red-dmg",
    MagicDamageReduction = "red-mag",
    MaxDurability = "dur",
    MaxDurabilityPercent = "dur%",
    Requirements = "ease"
}

export type Stat = {
    code: string;
    descriptionFunction: number;
    descriptionValue: number;
    description1: string;
    description2: string;
    descriptionPriority: number;
    function: number;
    set: string;
    value: string;
}

export interface Property {
    code: string;
    isActive: boolean;
    description: string;
    descriptionParameter: string;
    descriptionMin: string;
    descriptionMax: string;
    notes: string;
    stats: Stat[];
}

export interface ItemPropertyDescription {
    priority: number;
    text: string | null;
    function: number | null;
    value: number | null;
}

export interface ItemProperty {
    code: string; // property.code
    function: number;
    min: number;
    max: number;
    parameter: string;
    statCodes: string[]; // stat.Code(s)
    descriptions: ItemPropertyDescription[]
}

// export enum SpecialProperty {
//     Ethereal = "ethereal",
//     Indestructible = "indestruct",
//     EnhancedDamage = "dmg%",
//     PlusMinimumDamage = "dmg-min",
//     PlusMaximumDamage = "dmg-max",
//     GettingHitFearsEnemy = "fear"
// }

export function NewItemPropertyDescription(property: Property, stat: Stat | null, min: number, max: number, parameter: string): ItemPropertyDescription {
    const priority = stat ? stat.descriptionPriority : GetSpecialPropertyDescriptionPriority(property.code);

    let text: string | null = null;
    let func: number | null = null;
    let value: number | null = null;

    if (stat) {
        text = FormatStatDescription(stat.code, stat.descriptionFunction, stat.descriptionValue,
            stat.description1, stat.description2, stat.function, min, max, parameter);
        func = stat.descriptionFunction;
        value = stat.descriptionValue;
    } else {
        text = FormatSpecialPropertyDescription(property.code, min, max);
    }

    return { priority, text, function: func, value }
}

export const GetSpecialPropertyDescriptionPriority = (propertyCode: string): number => {
    // Min is 0, max is 255. The higher the number, the higher up in the list it is displayed.
    switch (propertyCode) {
        case PropertyCode.EnhancedDamage:
            return 135;
        case PropertyCode.PlusMinimumDamage:
        case PropertyCode.PlusMaximumDamage:
        case PropertyCode.Ethereal:
        case PropertyCode.GettingHitFearsEnemy:
        case PropertyCode.Indestructible:
            return 255;
        case "item_numsockets":
        case "item_tinkerflag2":
        default:
            return 0;
    }
}

export const FormatSpecialPropertyDescription = (propertyCode: string, min: number, max: number) => {
    // SELECT * FROM EasternSun.ES.Properties WHERE stat1 = '' AND [*done] = 1;
    // SELECT * FROM EasternSun.ES.ItemStatCost WHERE descfunc IS NULL ORDER BY Stat ASC;

    const minismax = min === max;

    switch (propertyCode) {
        case PropertyCode.EnhancedDamage:
            if (minismax) {
                return `+${max}% Enhanced Damage`;
            } else {
                return `+${min}-${max}% Enhanced Damage`;
            }
        case PropertyCode.PlusMinimumDamage:
            return `+${min}-${max} to Minimum Damage`;
        case PropertyCode.PlusMaximumDamage:
            return `+${min}-${max} to Maximum Damage`;
        case PropertyCode.Ethereal:
            return "Ethereal (Cannot Be Repaired)";
        case PropertyCode.GettingHitFearsEnemy:
            return `Getting Hit Causes Monster to Flee`;
        case PropertyCode.Indestructible:
            return "Indestructible";
        case "item_numsockets":
            return `Gem Socket (${max})`;
        case "item_tinkerflag2":
            return null;
        default:
            return `Unknown (${propertyCode})`;
            // To Do: Once all properties are accounted for... return null
            // return null; 
    }
}

const FormatEventDescription = (desc: string, min: number, max: number, parameter: string) => {
    // %d%% CTC Lvl %d %s on Striking
    return desc.replace(/%d%/, String(min)).replace(/%d/, String(max)).replace(/%s/, parameter);
}

export const FormatStatDescription = (statCode: string, descFunc: number, descVal: number, desc1: string, desc2: string, statFunc: number,
    min: number, max: number, parameter: string): string | null => {
    // descVal: 
    // 0 = doesn't show the value of the stat, ????
    // 1 = shows the value of the stat infront of the description, 
    // 2 = shows the value of the stat after the description

    if (descVal === 0) {
        return FormatStatDescription0(statCode, descFunc, desc1, desc2, statFunc, min, max, parameter);
    } else if (descVal === 1) {
        return FormatStatDescription1(statCode, descFunc, desc1, desc2, statFunc, min, max, parameter);
    } else if (descVal === 2) {
        return FormatStatDescription2(statCode, descFunc, desc1, desc2, statFunc, min, max, parameter);
    } else {
        return null;
    }
}

const FormatStatDescription0 = (statCode: string, descFunc: number, desc1: string, desc2: string, statFunc: number,
    min: number, max: number, parameter: string) => {
        // SELECT * FROM EasternSun.ES.ItemStatCost WHERE descval = 0;

        switch(descFunc) {
            case 1:
                return `+${min} ${desc1}`;
            case 2:
                return `${min}% ${desc1}`;
            case 3:
                return `${desc1}`;
            case 4:
                return `+${min}% ${desc1}`;
            case 5:
                return `${Number(min)*100/128}% ${desc1}`;
            case 6:
                if (statFunc === 17) {
                    const perlvl = toNumber(parameter) / 8;
                    const tmin = Math.floor(perlvl);
                    const tmax = Math.floor(perlvl*100);
                    return `(${perlvl}/clvl) +${tmin}-${tmax} ${desc1}` ;
                } else {
                    return `+${min} ${desc1} ${desc2}`;
                }
            case 7:
                return `${min}% ${desc1} ${desc2}`;
            case 8:
                if (statFunc === 17) {
                    const perlvl = toNumber(parameter) / 8;
                    const tmin = Math.floor(perlvl);
                    const tmax = Math.floor(perlvl*100);
                    return `(${perlvl}/clvl) +${tmin}-${tmax}% ${desc1}` ;
                } else {
                    return `+${min}% ${desc1} ${desc2}`;
                }
            case 9:
                return `${min} ${desc1} ${desc2}`;
            case 10:
                return `${Number(min)*100/128}% ${desc1} ${desc2}`;
            case 11:
                return `Repairs 1 Durability In ${100/Number(min)} Seconds`;
            case 12:
                return `+${min} ${desc1}`;
            case 13:
                return `+${min} to ${desc1}`;
            case 14:
                return `+${min} to ${desc1} Skill Levels (${desc2} Only)`;
            case 15:
                return FormatEventDescription(desc1, min, max, parameter);
            case 16:
                return `Level ${min}-${max} ${parameter} Aura When Equipped`;
            case 17:
                return `${min} ${desc1} (Increases near ${max})`;
            case 18:
                return `${min}% ${desc1} (Increases near ${max})`;
            case 19:
                // this is used by stats that use Blizzard's sprintf implementation (if you don't know what that is, it won't be of interest to you eitherway I guess), 
                // look at how prismatic is setup, the string is the format that gets passed to their sprintf spinoff.
                return `descfunc19`;
            case 20:
                return `${Number(min)*-1}% ${desc1}`;
            case 21:
                return `${Number(min)*-1} ${desc1}`;
            case 22:
                // (warning: this is bugged in vanilla and doesn't work properly, see CE forum)
                return `${min}% ${desc1} ${max}`;
            case 23:
                return `${min}% ${desc1} ${max}`;
            case 24:
                // used for charges, we all know how that desc looks
                return `Level ${max} ${parameter} (${min} Charges)`;
            case 25:
                // not used by vanilla, present in the code but I didn't test it yet
                return `descfunc25`;
            case 26:
                // not used by vanilla, present in the code but I didn't test it yet
                return `descfunc26`;
            case 27:
                return `+${min}-${max} to ${parameter} (${desc1} Only)`;
            case 28:
                if (min === max) {
                    return `+${max} to ${parameter}`;
                } else {
                    return `+${min}-${max} to ${parameter}`;
                }
            default:
                return FormatSpecialPropertyDescription(statCode, min, max); //fallback for special cases
        }
}

const FormatStatDescription1 = (statCode: string, descFunc: number, desc1: string, desc2: string, statFunc: number,
    min: number, max: number, parameter: string) => {

    switch(descFunc) {
        case 1:
            if (min === max) {
                return `+${max} ${desc1}`;
            } else {
                return `+${min}-${max} ${desc1}`;
            }
        case 2:
            if (min === max) {
                return `${max}% ${desc1}`;
            } else {
                return `${min}-${max}% ${desc1}`;
            }
        case 3:
            return `${min} ${desc1}`;
        case 4:
            if (min === max) {
                return `+${max}% ${desc1}`;
            } else {
                return `+${min}-${max}% ${desc1}`;
            }
        case 5:
            return `${Number(min)*100/128}% ${desc1}`;
        case 6:
            if (statFunc === 17) {
                const perlvl = toNumber(parameter) / 8;
                const tmin = Math.floor(perlvl);
                const tmax = Math.floor(perlvl*100);
                return `(${perlvl}/clvl) +${tmin}-${tmax} ${desc1}` ;
            } else {
                return `+${min} ${desc1} ${desc2}`;
            }
        case 7:
            // const perlvl = Number(parameter) / 8;
            return `(${Number(parameter)/8}/clvl) +0-${Math.floor((Number(parameter)/8)*100)}% ${desc1} ${desc2}`;
        case 8:
            if (statFunc === 17) {
                const perlvl = toNumber(parameter) / 8;
                const tmin = Math.floor(perlvl);
                const tmax = Math.floor(perlvl*100);
                return `(${perlvl}/clvl) +${tmin}-${tmax}% ${desc1}` ;
            } else {
                return `+${min}% ${desc1} ${desc2}`;
            }
        case 9:
            return `${min} ${desc1} ${desc2}`;
        case 10:
            return `${Number(min)*100/128}% ${desc1} ${desc2}`;
        case 11:
            return `Repairs 1 Durability In ${100/Number(min)} Seconds`;
        case 12:
            return `+${min} ${desc1}`;
        case 13:
            return `+${min} to ${desc1}`;
        case 14:
            return `+${min} to ${desc1} Skill Levels (${desc2} Only)`;
        case 15:
            return FormatEventDescription(desc1, min, max, parameter); // 25% CtC Lvl 6 Holy Bolt %d%% CTC Lvl %d %s on Striking
        case 16:
            return `Level ${min}-${max} ${parameter} Aura When Equipped`;
        case 17:
            return `${min} ${desc1} (Increases near ${max})`;
        case 18:
            return `${min}% ${desc1} (Increases near ${max})`;
        case 19:
            // this is used by stats that use Blizzard's sprintf implementation (if you don't know what that is, it won't be of interest to you eitherway I guess), 
            // look at how prismatic is setup, the string is the format that gets passed to their sprintf spinoff.
            return `descfunc19`;
        case 20:
            return `${Number(min)*-1}% ${desc1}`;
        case 21:
            return `${Number(min)*-1} ${desc1}`;
        case 22:
            // (warning: this is bugged in vanilla and doesn't work properly, see CE forum)
            return `${min}% ${desc1} ${max}`;
        case 23:
            return `${min}% ${desc1} ${max}`;
        case 24:
            return `Level ${max} ${parameter} (${min} Charges)`;
        case 25:
            // not used by vanilla, present in the code but I didn't test it yet
            return `descfunc25`;
        case 26:
            // not used by vanilla, present in the code but I didn't test it yet
            return `descfunc26`;
        case 27:
            return `+${min}-${max} to ${parameter} (${desc1} Only)`;
        case 28:
            if (min === max) {
                return `+${max} to ${parameter}`;
            } else {
                return `+${min}-${max} to ${parameter}`;
            }
        default:
            return FormatSpecialPropertyDescription(statCode, min, max); //fallback for special cases
    }
}

const FormatStatDescription2 = (statCode: string, descFunc: number, desc1: string, desc2: string, statFunc: number,
    min: number, max: number, parameter: string) => {

    switch(descFunc) {
        case 1:
            return `${desc1} +${min}`;
        case 2:
            if (min === max) {
                return `${desc1} ${max}%`;
            } else {
                return `${desc1} ${min}-${max}%`;
            }
        case 3:
            return `${desc1} ${min}`;
        case 4:
            return `${desc1} +${min}%`;
        case 5:
            return `${desc1} ${Number(min)*100/128}%`;
        case 6:
            if (statFunc === 17) {
                const perlvl = toNumber(parameter) / 8;
                const tmin = Math.floor(perlvl);
                const tmax = Math.floor(perlvl*100);
                return `${desc1} (${perlvl}/clvl) +${tmin}-${tmax}` ;
            } else {
                return `${desc1} +${min} ${desc2}`;
            }
        case 7:
            return `${desc1} ${min}% ${desc2}`;
        case 8:
            if (statFunc === 17) {
                const perlvl = toNumber(parameter) / 8;
                const tmin = Math.floor(perlvl);
                const tmax = Math.floor(perlvl*100);
                return `${desc1} (${perlvl}/clvl) +${tmin}-${tmax}%` ;
            } else {
                return `${desc1} +${min}% ${desc2}`;
            }
        case 9:
            // return `(${Number(parameter)/8}/clvl) Attacker Takes Damage of 3-300`;
            return `(${Number(parameter)/8}/clvl) ${desc1} ${(Number(parameter)/8)*1}-${(Number(parameter)/8)*100}`;
            // return `${desc1} ${min} ${desc2}`;
        case 10:
            return `${desc1} ${Number(min)*100/128}% ${desc2}`;
        case 11:
            return `Repairs 1 Durability In ${100/Number(min)} Seconds`;
        case 12:
            return `${desc1} +${min}`;
        case 13:
            return `+${min} to ${max} Skill Levels`;
        case 14:
            return `+${min} to ${max} Skill Levels (${parameter} Only)`;
        case 15:
            return FormatEventDescription(desc1, min, max, parameter);
        case 16:
            return `Level ${min}-${max} ${parameter} Aura When Equipped`;
        case 17:
            return `${min} ${desc1} (Increases near ${max})`;
        case 18:
            return `${min}% ${desc1} (Increases near ${max})`;
        case 19:
            // this is used by stats that use Blizzard's sprintf implementation (if you don't know what that is, it won't be of interest to you eitherway I guess), 
            // look at how prismatic is setup, the string is the format that gets passed to their sprintf spinoff.
            return `descfunc19`;
        case 20:
            return `${desc1} ${Number(min)*-1}%`;
        case 21:
            return `${desc1} ${Number(min)*-1}`;
        case 22:
            // (warning: this is bugged in vanilla and doesn't work properly, see CE forum)
            return `${desc1} ${min}% ${max}`;
        case 23:
            return `${desc1} ${min}% ${max}`;
        case 24:
            return `Level ${max} ${parameter} (${min} Charges)`;
        case 25:
            // not used by vanilla, present in the code but I didn't test it yet
            return `descfunc25`;
        case 26:
            // not used by vanilla, present in the code but I didn't test it yet
            return `descfunc26`;
        case 27:
            return `+${min} to ${max} (${parameter} Only)`;
        case 28:
            return `+${min} to ${max}`;
        default:
            return FormatSpecialPropertyDescription(statCode, min, max); //fallback for special cases
    }
}
