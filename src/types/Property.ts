import { toNumber } from "./utils";

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

export interface ItemProperty {
    property: string; // property.code
    stat: string; // stat.Code
    function: number;
    min: number;
    max: number;
    parameter: string;
    formattedDescription: string | null;
    descriptionPriority: number;
    descriptionFunction: number;
    descriptionValue: number;
}

export const GetSpecialPropertyDescriptionPriority = (propertyCode: string): number => {
    // Min is 0, max is 255. The higher the number, the higher up in the list it is displayed.
    switch (propertyCode) {
        case "dmg%":
            return 135;
        case "dmg-min":
        case "dmg-max":
        case "ethereal":
        case "fear":
        case "indestruct":
            return 255;
        case "item_numsockets":
        case "item_tinkerflag2":
        default:
            return 0;
    }
}

const FormatEventDescription = (desc: string, min: number, max: number, parameter: string) => {
    // %d%% CTC Lvl %d %s on Striking
    // const regexp = /(%d%)% CTC Lvl (%d) (%s) (.+)/;
    // const result = regexp.exec(desc);
    return desc.replace(/%d%/, String(min)).replace(/%d/, String(max)).replace(/%s/, parameter);
}

export const FormatSpecialPropertyDescription = (propertyCode: string, min: number, max: number) => {
    // SELECT * FROM EasternSun.ES.Properties WHERE stat1 = '' AND [*done] = 1;
    // SELECT * FROM EasternSun.ES.ItemStatCost WHERE descfunc IS NULL ORDER BY Stat ASC;

    const minismax = min === max;

    switch (propertyCode) {
        case "dmg%":
            if (minismax) {
                return `+${max}% Enhanced Damage`;
            } else {
                return `+${min}-${max}% Enhanced Damage`;
            }
        case "dmg-min":
            return `+${min}-${max} to Minimum Damage`;
        case "dmg-max":
            return `+${min}-${max} to Maximum Damage`;
        case "ethereal":
            return "Ethereal (Cannot Be Repaired)";
        case "fear":
            return `Getting Hit Causes Monster to Flee`;
        case "indestruct":
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
                return `descfunc24`;
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
            return `+${min} ${desc1}`;
        case 2:
            return `${min}% ${desc1}`;
        case 3:
            return `${min} ${desc1}`;
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
            // used for charges, we all know how that desc looks
            return `descfunc24`;
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
            return `${desc1} ${min}%`;
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
            // used for charges, we all know how that desc looks
            return `descfunc24`;
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
