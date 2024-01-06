import { ToNumber } from "./utils";

export type Stat = {
    Code: string;
    DescriptionFunction: number;
    DescriptionValue: number;
    Description1: string;
    Description2: string;
    DescriptionPriority: number;
    Function: number;
    Set: string;
    Value: string;
}

export interface Property {
    Code: string;
    IsActive: boolean;
    Description: string;
    DescriptionParameter: string;
    DescriptionMin: string;
    DescriptionMax: string;
    Notes: string;
    Stats: Stat[];
}

export interface ItemProperty {
    Property: string; // property.code
    Stat: string; // stat.Code
    Function: number;
    Min: number;
    Max: number;
    Parameter: string;
    FormattedDescription: string | null;
    DescriptionPriority: number;
    DescriptionFunction: number;
    DescriptionValue: number;
}

export const FormatStatDescription = (stat: Stat, min: number, max: number, parameter: string): string | null => {
    // descVal: 
    // 0 = doesn't show the value of the stat, 
    // 1 = shows the value of the stat infront of the description, 
    // 2 = shows the value of the stat after the description

    if (stat.DescriptionValue === 0) {
        return FormatStatDescription1(stat, min, max, parameter);
    } else if (stat.DescriptionValue === 1) {
        return FormatStatDescription1(stat, min, max, parameter);
    } else if (stat.DescriptionValue === 2) {
        return "NYI";
    } else {
        return null;
    }
}

const FormatStatDescription1 = (stat: Stat, min: number, max: number, parameter: string) => {
    switch(stat.DescriptionFunction) {
        case 1:
            return `+${min} ${stat.Description1}`;
        case 2:
            return `${min}% ${stat.Description1}`;
        case 3:
            return `${min} ${stat.Description1}`;
        case 4:
            return `+${min}% ${stat.Description1}`;
        case 5:
            return `${Number(min)*100/128}% ${stat.Description1}`;
        case 6:
            if (stat.Function === 17) {
                const perlvl = ToNumber(parameter) / 8;
                const tmin = Math.floor(perlvl);
                const tmax = Math.floor(perlvl*100);
                return `(${perlvl}/clvl) +${tmin}-${tmax} ${stat.Description1}` ;
            } else {
                return `+${min} ${stat.Description1} ${stat.Description2}`;
            }
        case 7:
            return `${min}% ${stat.Description1} ${stat.Description2}`;
        case 8:
            if (stat.Function === 17) {
                const perlvl = ToNumber(parameter) / 8;
                const tmin = Math.floor(perlvl);
                const tmax = Math.floor(perlvl*100);
                return `(${perlvl}/clvl) +${tmin}-${tmax}% ${stat.Description1}` ;
            } else {
                return `+${min}% ${stat.Description1} ${stat.Description2}`;
            }
        case 9:
            return `${min} ${stat.Description1} ${stat.Description2}`;
        case 10:
            return `${Number(min)*100/128}% ${stat.Description1} ${stat.Description2}`;
        case 11:
            return `Repairs 1 Durability In ${100/Number(min)} Seconds`;
        case 12:
            return `+${min} ${stat.Description1}`;
        case 13:
            return `+${min} to ${max} Skill Levels`;
        case 14:
            return `+${min} to ${max} Skill Levels (${'???'} Only)`;
        case 15:
            return `${min}% CtC Lvl ${max} ${parameter} on ${'???'}`;
        case 16:
            return `Level ${min}-${max} ${parameter} Aura When Equipped`;
        case 17:
            return `${min} ${stat.Description1} (Increases near ${max})`;
        case 18:
            return `${min}% ${stat.Description1} (Increases near ${max})`;
        case 19:
            // this is used by stats that use Blizzard's sprintf implementation (if you don't know what that is, it won't be of interest to you eitherway I guess), 
            // look at how prismatic is setup, the string is the format that gets passed to their sprintf spinoff.
            return `descfunc19`;
        case 20:
            return `${Number(min)*-1}% ${stat.Description1}`;
        case 21:
            return `${Number(min)*-1} ${stat.Description1}`;
        case 22:
            // (warning: this is bugged in vanilla and doesn't work properly, see CE forum)
            return `${min}% ${stat.Description1} ${max}`;
        case 23:
            return `${min}% ${stat.Description1} ${max}`;
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
