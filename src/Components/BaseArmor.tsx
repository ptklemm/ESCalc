import { ArmorLibrary } from '../types/ItemLibrary';
import { ArmorTable } from './Tables';

export default function BaseArmor(props: { items: ArmorLibrary }) {
    const {
        Helms,
        Circlets,
        Pelts,
        PrimalHelms,
        BodyArmor,
        Robes,
        Shields,
        ShrunkenHeads,
        AuricShields,
        Gloves,
        Belts,
        Boots
    } = props.items;

    return (
        <div id="BaseArmor">
            <ArmorTable items={Helms} header="Helms" />
            <ArmorTable items={Circlets} header="Circlets" />
            <ArmorTable items={Pelts} header="Druid Pelts" />
            <ArmorTable items={PrimalHelms} header="Primal Helms" />
            <ArmorTable items={BodyArmor} header="Body Armor" />
            <ArmorTable items={Robes} header="Robes" />
            <ArmorTable items={Shields} header="Shields" />
            <ArmorTable items={ShrunkenHeads} header="Shrunken Heads" />
            <ArmorTable items={AuricShields} header="Auric Shields" />
            <ArmorTable items={Gloves} header="Gloves" />
            <ArmorTable items={Belts} header="Belts" />
            <ArmorTable items={Boots} header="Boots" />
        </div>
    );
}
