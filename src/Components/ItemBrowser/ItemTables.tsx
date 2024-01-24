import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import { Item, ItemTier } from '../../types/Item';
import { ItemProperty } from '../../types/Property';
import { Category } from '../../types/ItemCatalog';
import renderItemProperties from '../shared/renderItemProperties';

interface SubTableProps {
    subheader: string;
    items: Item[];
}

interface TableProps { 
    header: string;
    items?: Item[];
    subTables?: SubTableProps[];
}

interface TablesProps {
    header: string; 
    items?: Item[];
    crumb?: string;
    subTables?: SubTableProps[];
}

interface ItemTablesProps {
    id: string,
    category: Category,
    tables: TablesProps[]
}

interface ItemTablesBreadcrumbProps { 
    tables: TablesProps[];
}

const ItemTablesBreadcrumb = ({ tables }: ItemTablesBreadcrumbProps) => {
    return (
        <Breadcrumb>
            {tables.map(table => <Breadcrumb.Item key={table.header} href={`#${table.header}`}>{table.crumb || table.header}</Breadcrumb.Item>)}
        </Breadcrumb>
    );
}

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
                {items && items.map(item => {
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
                {items && items.map(item => {
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

const UniqueTableHeader = () => {
    return (
        <tr>
            <th>Code</th>
            <th>Name</th>
            <th>QLvl</th>
            <th>Req Lvl</th>
            <th>Stats</th>
        </tr>
    );
}

const renderUniqueItems = (items: Item[]) => {
    return items.map((item, index) => {
        let bgClass: string;

        if (item.tier === ItemTier.Elite) {
            bgClass = "item-elite";
        } else if (item.tier === ItemTier.Exceptional) {
            bgClass = "item-exceptional";
        } else {
            bgClass = "item-normal";
        }

        return (
            <tr key={index} className={bgClass}>
                <td>{item.code}</td>
                <td>{item.name}<br /><p>{item.baseName}</p></td>
                <td>{item.qualityLevel}</td>
                <td>{item.requiredLevel}</td>
                <PropertiesCell itemCode={index} properties={item.properties} />
            </tr>
        );
    });
}

const UniqueSubTable = ({ subheader, items }: SubTableProps) => {
    return (<>
        <tr>
            <th colSpan={5}>{subheader}</th>
        </tr>
        <UniqueTableHeader />
        {renderUniqueItems(items)}
    </>);
}

const renderUniqueSubTables = (subTables: SubTableProps[]) => {
    return subTables.map(table => <UniqueSubTable key={table.subheader} subheader={table.subheader} items={table.items} />);
}

const UniqueTable = ({ header, items, subTables }: TableProps) => {
    const renderItems = items && items.length;
    const _renderSubTables = subTables && subTables.length;

    return (
        <Table style={{textAlign: 'center'}} id={header} bordered>
            <tbody>
                <tr>
                    <th colSpan={5}>{header}</th>
                </tr>
                {renderItems && <UniqueTableHeader />}
                {renderItems && renderUniqueItems(items)}
                {_renderSubTables && renderUniqueSubTables(subTables)}
            </tbody>
        </Table>
    );
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
                        {category === Category.UniqueArmor && <UniqueTable items={table.items} header={table.header} subTables={table.subTables} />}
                        {category === Category.UniqueWeapons && <UniqueTable items={table.items} header={table.header} />}
                    </Row>
                )}
            </Col>
            <Col />
        </Row>
    );
}