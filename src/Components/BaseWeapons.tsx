import { WeaponLibrary } from '../types/ItemLibrary';
import { WeaponTable } from './Tables';

export default function BaseWeapons(props: { items: WeaponLibrary }) {
    // const {
    //     Axes,
    //     Bows,
    //     Crossbows,
    //     Daggers,
    //     Javelins,
    //     Knuckles,
    //     Maces,
    //     Polearms,
    //     Scepters,
    //     Spears,
    //     Staves,
    //     Swords,
    //     ThrowingWeapons,
    //     Wands
    // } = props.items;

    const keys = Object.keys(props.items);

    return (
        <div id="BaseWeapons">
            {keys.map(key => {
                return <WeaponTable key={key} items={props.items[key as keyof WeaponLibrary]} header={key} />
            })}
            {/* <WeaponTable items={Axes} header="Axes" />
            <WeaponTable items={Bows} header="Bows" />
            <WeaponTable items={Crossbows} header="Crossbows" />
            <WeaponTable items={Daggers} header="Daggers" />
            <WeaponTable items={Javelins} header="Javelins" />
            <WeaponTable items={Knuckles} header="Knuckles" /> */}
        </div>
    );
}
