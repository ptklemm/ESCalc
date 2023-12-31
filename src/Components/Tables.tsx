import Table from 'react-bootstrap/Table';
import { Item } from '../types/Item';

export function ArmorTable(props: { items: Item[], header: string }) {
    return (
        <Table style={{textAlign: 'center'}} id={props.header} bordered hover size="sm">
            <thead>
                <tr>
                    <th colSpan={15}>{props.header}</th>
                </tr>
                <tr>
                    <th>Index</th>
                    <th>Code</th>
                    <th>Tier</th>
                    <th>Name</th>
                    <th>Defense</th>
                    <th>Durability</th>
                    <th>FRW</th>
                    <th>QLvl</th>
                    <th>Mag Lvl</th>
                    <th>Req Lvl</th>
                    <th>Req Str</th>
                    <th>Block%</th>
                    <th>Damage</th>
                    <th>Sockets</th>
                    <th>Gem Type</th>
                </tr>
            </thead>
            <tbody>
                {props.items.map((item, index) => {
                    return (
                        <tr key={item.Code}>
                            <td>{index}</td>
                            <td>{item.Code}</td>
                            <td>{item.Tier}</td>
                            <td>{item.DisplayName}</td>
                            <td>{item.DefenseMin}-{item.DefenseMax}</td>
                            <td>{item.Durability}</td>
                            <td>{item.Speed*(-1)}</td>
                            <td>{item.QualityLevel}</td>
                            <td>{item.MagicLevel}</td>
                            <td>{item.RequiredLevel}</td>
                            <td>{item.RequiredStrength}</td>
                            <td>{item.ChanceToBlock}</td>
                            <td>{item.DamageMin}-{item.DamageMax}</td>
                            <td>{item.MaxSockets}</td>
                            <td>{item.SocketType}</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}

export function WeaponTable(props: { items: Item[], header: string }) {
    return (
        <Table style={{textAlign: 'center'}} id={props.header} bordered hover size="sm">
            <thead>
                <tr>
                    <th colSpan={16}>{props.header}</th>
                </tr>
                <tr>
                    <th>Index</th>
                    <th>Code</th>
                    <th>Tier</th>
                    <th>Name</th>
                    <th>1H Damage</th>
                    <th>2H Damage</th>
                    <th>Durability</th>
                    <th>Range</th>
                    <th>WSM</th>
                    <th>QLvl</th>
                    <th>Req Lvl</th>
                    <th>Req Str</th>
                    <th>Req Dex</th>
                    <th>Str/Dex Bonus</th>
                    <th>Sockets</th>
                    <th>Gem Type</th>
                </tr>
            </thead>
            <tbody>
                {props.items.map((item, index) => {
                    return (
                        <tr key={item.Code}>
                            <td>{index}</td>
                            <td>{item.Code}</td>
                            <td>{item.Tier}</td>
                            <td>{item.DisplayName}</td>
                            <td>{item.DamageMin}-{item.DamageMax}</td>
                            <td>{item.DamageMin2H}-{item.DamageMax2H}</td>
                            <td>{item.Durability}</td>
                            <td>{item.Range}</td>
                            <td>{item.Speed*(-1)}</td>
                            <td>{item.QualityLevel}</td>
                            <td>{item.RequiredLevel}</td>
                            <td>{item.RequiredStrength}</td>
                            <td>{item.RequiredDexterity}</td>
                            <td>{item.StrengthBonus}/{item.DexterityBonus}</td>
                            <td>{item.MaxSockets}</td>
                            <td>{item.SocketType}</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}
