import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import { ItemLibrary, LibraryType } from '../types/ItemLibrary';
import { ItemTables } from './BaseItems';
import { ItemType } from '../types/ItemType';

const items = new ItemLibrary();
console.log(items);
console.log(items.GetItemByCode('0xb'));
// console.log(items.FindItemByCode('7b8'))

export default function ItemBrowser() {
    return (
        <Tab.Container id="ItemBrowser" defaultActiveKey="armor" transition={false}>
            <Row>
                <Col md={2}>
                    <Nav className="flex-column">
                        <Nav.Link eventKey="search">Search</Nav.Link>
                        <Nav.Link eventKey="armor">Base Armor</Nav.Link>
                        <Nav.Link eventKey="weapons">Base Weapons</Nav.Link>
                        <Nav.Link eventKey="unique-armor">Unique Armor</Nav.Link>
                        <Nav.Link eventKey="unique-weapons">Unique Weapons</Nav.Link>
                        <Nav.Link eventKey="sets">Sets</Nav.Link>
                        <Nav.Link eventKey="gems">Gems/Runes</Nav.Link>
                        <Nav.Link eventKey="runewords">Runewords</Nav.Link>
                        <Nav.Link eventKey="gemwords">Gemwords</Nav.Link>
                    </Nav>
                </Col>
                <Col>
                    <Tab.Content>
                        <Tab.Pane eventKey="armor">
                            <ItemTables id="BaseArmor" libraryType={LibraryType.Armor} tables={[
                                { header: "Helms", items: items.Helms },
                                { header: "Circlets", items: items.Circlets },
                                { header: "Pelts", items: items.Pelts },
                                { header: "Primal Helms", items: items.PrimalHelms },
                                { header: "Body Armor", items: items.BodyArmor },
                                { header: "Robes", items: items.Robes },
                                { header: "Shields", items: items.Shields },
                                { header: "Shrunken Heads", items: items.ShrunkenHeads },
                                { header: "Auric Shields", items: items.AuricShields },
                                { header: "Gloves", items: items.Gloves },
                                { header: "Belts", items: items.Belts },
                                { header: "Boots", items: items.Boots }
                            ]}/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="weapons">
                            <ItemTables id="BaseWeapons" libraryType={LibraryType.Weapons} tables={[
                                { header: "Axes", items: items.Axes },
                                { header: "Bows", items: items.Bows },
                                { header: "Crossbows", items: items.Crossbows },
                                { header: "Daggers", items: items.Daggers },
                                { header: "Javelins", items: items.Javelins },
                                { header: "Knuckles", items: items.Knuckles },
                                { header: "Maces", items: items.Maces },
                                { header: "Polearms", items: items.Polearms },
                                { header: "Scepters", items: items.Scepters },
                                { header: "Spears", items: items.Spears },
                                { header: "Staves", items: items.Staves },
                                { header: "Swords", items: items.Swords },
                                { header: "Throwing Weapons", items: items.ThrowingWeapons, crumb: "Throwing" },
                                { header: "Wands", items: items.Wands },
                                { header: "Amazon Weapons", items: items.AmazonWeapons, crumb: "Amazon" },
                                { header: "Assassin Weapons", items: items.AssassinWeapons, crumb: "Assassin" },
                                { header: "Barbarian Weapons", items: items.BarbarianWeapons, crumb: "Barbarian" },
                                { header: "Druid Weapons", items: items.DruidWeapons, crumb: "Druid" },
                                { header: "Necromancer Weapons", items: items.NecromancerWeapons, crumb: "Necromancer" },
                                { header: "Paladin Weapons", items: items.PaladinWeapons, crumb: "Paladin" },
                                { header: "Sorceress Weapons", items: items.SorceressWeapons, crumb: "Sorceress" }
                            ]}/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="unique-armor">Unique Armor</Tab.Pane>
                        <Tab.Pane eventKey="unique-weapons">Unique Weapons</Tab.Pane>
                        <Tab.Pane eventKey="sets">Sets</Tab.Pane>
                        <Tab.Pane eventKey="gems">Gems/Runes</Tab.Pane>
                        <Tab.Pane eventKey="runewords">Runewords</Tab.Pane>
                        <Tab.Pane eventKey="gemwords">Gemwords</Tab.Pane>
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    );
}