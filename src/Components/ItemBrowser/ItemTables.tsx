import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import { Item, UniqueItem } from '../../types/Item';
import { ItemProperty } from '../../types/Property';
import { Category } from '../../types/ItemCatalog';

type TableProps = {
    header: string; 
    items: Item[] | UniqueItem[]; 
    crumb?: string;
}

const ItemTablesBreadcrumb = ({ tables }: { tables: TableProps[]}) => {
    return (
        <Breadcrumb>
            {tables.map(table => <Breadcrumb.Item key={table.header} href={`#${table.header}`}>{table.crumb || table.header}</Breadcrumb.Item>)}
        </Breadcrumb>
    );
}

interface EquipmentTableProps { items: Item[], header: string }

const ArmorTable = ({ items, header}: EquipmentTableProps) => {
    return (
        <Table style={{textAlign: 'center'}} id={header} bordered hover size="sm">
            <thead>
                <tr>
                    <th colSpan={15}>{header}</th>
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
                {items.map((item, index) => {
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

const WeaponTable = ({ items, header}: EquipmentTableProps) => {
    return (
        <Table style={{textAlign: 'center'}} id={header} bordered hover size="sm">
            <thead>
                <tr>
                    <th colSpan={16}>{header}</th>
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
                {items.map((item, index) => {
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

const UniqueItemPropertyCell = ({ itemCode, properties }: { itemCode: string | number, properties: ItemProperty[] }) => {
    return (
        <td>
            {properties.map((property, index) => <p key={`${itemCode}-${index}-${property.Stat}`}>{property.FormattedDescription}</p>)}
        </td>
    );
}

const UniqueTable = ({ items, header}: { items: UniqueItem[], header: string }) => {
    return (
        <Table style={{textAlign: 'center'}} id={header} bordered hover size="sm">
            <thead>
                <tr>
                    <th colSpan={7}>{header}</th>
                </tr>
                <tr>
                    <th>Index</th>
                    <th>Code</th>
                    <th>Tier</th>
                    <th>Name</th>
                    <th>QLvl</th>
                    <th>Req Lvl</th>
                    <th>Stats</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, index) => {
                    return (
                        <tr key={index}>
                            <td>{index}</td>
                            <td>{item.BaseItem?.Code}</td>
                            <td>{item.BaseItem?.Tier}</td>
                            <td>{item.Name}</td>
                            <td>{item.QualityLevelUnique}</td>
                            <td>{item.RequiredLevelUnique}</td>
                            <UniqueItemPropertyCell itemCode={index} properties={item.Properties} />
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );   
}

type ItemTablesProps = {
    id: string,
    category: Category,
    tables: TableProps[]
}

export default function ItemTables(props: ItemTablesProps) {
    const { id, category, tables } = props;
    const breadcrumb = <ItemTablesBreadcrumb tables={tables} />
    return (
        <Row>
            <Col />
            <Col id={id} md={10}>
                {tables.map(table =>
                    <Row key={table.header} id={table.header}>
                        {breadcrumb}
                        {category === Category.Armor && <ArmorTable items={table.items as Item[]} header={table.header} />}
                        {category === Category.Weapons && <WeaponTable items={table.items as Item[]} header={table.header} />}
                        {category === Category.UniqueArmor && <UniqueTable items={table.items as UniqueItem[]} header={table.header} />}
                        {category === Category.UniqueWeapons && <UniqueTable items={table.items as UniqueItem[]} header={table.header} />}
                    </Row>
                )}
            </Col>
            <Col />
        </Row>
        
    );
}