import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import { Item } from '../../types/Item';
import { ItemProperty } from '../../types/Property';
import { Category } from '../../types/ItemCatalog';
import renderItemProperties from '../shared/renderItemProperties';

const ItemTablesBreadcrumb = ({ tables }: { tables: TablesProps[]}) => {
    return (
        <Breadcrumb>
            {tables.map(table => <Breadcrumb.Item key={table.header} href={`#${table.header}`}>{table.crumb || table.header}</Breadcrumb.Item>)}
        </Breadcrumb>
    );
}

interface TableProps { items: Item[], header: string }

const ArmorTable = ({ items, header}: TableProps) => {
    return (
        <Table style={{textAlign: 'center'}} id={header} bordered hover>
            <thead>
                <tr>
                    <th colSpan={14}>{header}</th>
                </tr>
                <tr>
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
                {items.map(item => {
                    return (
                        <tr key={item.code}>
                            <td>{item.code}</td>
                            <td>{item.tier}</td>
                            <td>{item.name}</td>
                            <td>{item.defenseMin}-{item.defenseMax}</td>
                            <td>{item.durability}</td>
                            <td>{item.speed*(-1)}</td>
                            <td>{item.qualityLevel}</td>
                            <td>{item.magicLevel}</td>
                            <td>{item.requiredLevel}</td>
                            <td>{item.requiredStrength}</td>
                            <td>{item.chanceToBlock}</td>
                            <td>{item.damageMin}-{item.damageMax}</td>
                            <td>{item.maxSockets}</td>
                            <td>{item.socketType}</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}

const WeaponTable = ({ items, header}: TableProps) => {
    return (
        <Table style={{textAlign: 'center'}} id={header} bordered hover>
            <thead>
                <tr>
                    <th colSpan={15}>{header}</th>
                </tr>
                <tr>
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
                {items.map(item => {
                    return (
                        <tr key={item.code}>
                            <td>{item.code}</td>
                            <td>{item.tier}</td>
                            <td>{item.name}</td>
                            <td>{item.damageMin}-{item.damageMax}</td>
                            <td>{item.damageMin2H}-{item.damageMax2H}</td>
                            <td>{item.durability}</td>
                            <td>{item.range}</td>
                            <td>{item.speed*(-1)}</td>
                            <td>{item.qualityLevel}</td>
                            <td>{item.requiredLevel}</td>
                            <td>{item.requiredStrength}</td>
                            <td>{item.requiredDexterity}</td>
                            <td>{item.strengthBonus}/{item.dexterityBonus}</td>
                            <td>{item.maxSockets}</td>
                            <td>{item.socketType}</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}

interface PropertiesCellProps { itemCode: string | number, properties: ItemProperty[] }

const PropertiesCell = ({ itemCode, properties }: PropertiesCellProps) => {
    return (
        <td>
            {renderItemProperties(properties, itemCode)}
        </td>
    );
}

const UniqueTable = ({ items, header}: TableProps) => {
    return (
        <Table style={{textAlign: 'center'}} id={header} bordered hover>
            <thead>
                <tr>
                    <th colSpan={6}>{header}</th>
                </tr>
                <tr>
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
                            <td>{item.code}</td>
                            <td>{item.tier}</td>
                            <td>{item.name}</td>
                            <td>{item.qualityLevel}</td>
                            <td>{item.requiredLevel}</td>
                            <PropertiesCell itemCode={index} properties={item.properties} />
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );   
}

interface TablesProps {
    header: string; 
    items: Item[]; 
    crumb?: string;
}


interface ItemTablesProps {
    id: string,
    category: Category,
    tables: TablesProps[]
}

export default function ItemTables({ id, category, tables }: ItemTablesProps) {
    const breadcrumb = <ItemTablesBreadcrumb tables={tables} />
    return (
        <Row>
            <Col />
            <Col id={id} md={6}>
                {tables.map(table =>
                    <Row key={table.header} id={table.header}>
                        {breadcrumb}
                        {category === Category.Armor && <ArmorTable items={table.items} header={table.header} />}
                        {category === Category.Weapons && <WeaponTable items={table.items} header={table.header} />}
                        {category === Category.UniqueArmor && <UniqueTable items={table.items} header={table.header} />}
                        {category === Category.UniqueWeapons && <UniqueTable items={table.items} header={table.header} />}
                    </Row>
                )}
            </Col>
            <Col />
        </Row>
        
    );
}