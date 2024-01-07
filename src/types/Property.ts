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

export const FormatSpecialPropertyDescription = (propertyCode: string, min: number, max: number) => {
    switch(propertyCode) {
        case "dmg%":
            return `+${min}-${max}% Enhanced Damage`;
        default:
            return "Unknown PropertyCode";
    }
}

export const FormatStatDescription = (descFunc: number, descVal: number, desc1: string, desc2: string, statFunc: number,
    min: number, max: number, parameter: string): string | null => {
    // descVal: 
    // 0 = doesn't show the value of the stat, 
    // 1 = shows the value of the stat infront of the description, 
    // 2 = shows the value of the stat after the description

    if (descVal === 0) {
        return FormatStatDescription1(descFunc, desc1, desc2, statFunc, min, max, parameter);
    } else if (descVal === 1) {
        return FormatStatDescription1(descFunc, desc1, desc2, statFunc, min, max, parameter);
    } else if (descVal === 2) {
        return FormatStatDescription1(descFunc, desc1, desc2, statFunc, min, max, parameter);
    } else {
        return null;
    }
}

const FormatStatDescription1 = (descFunc: number, desc1: string, desc2: string, statFunc: number,
    min: number, max: number, parameter: string) => {
    // descFunc
    // descVal
    // description1
    // description2
    // statFunction

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
            return `+${min} to ${max} Skill Levels`;
        case 14:
            return `+${min} to ${max} Skill Levels (${'???'} Only)`;
        case 15:
            return `${min}% CtC Lvl ${max} ${parameter} on ${'???'}`;
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
            return `+${min} to ${max} (${'???'} Only)`;
        case 28:
            return `+${min} to ${max}`;
        default:
            return "Unknown DescFunc";
    }
}
