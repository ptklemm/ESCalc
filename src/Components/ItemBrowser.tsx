import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import { ItemLibrary, LibraryType } from '../types/ItemLibrary';
import { ItemTables } from './BaseItems';

const items = new ItemLibrary();

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
                                { header: "Helms", items: items.Armor.Helms },
                                { header: "Circlets", items: items.Armor.Circlets },
                                { header: "Pelts", items: items.Armor.Pelts },
                                { header: "Primal Helms", items: items.Armor.PrimalHelms },
                                { header: "Body Armor", items: items.Armor.BodyArmor },
                                { header: "Robes", items: items.Armor.Robes },
                                { header: "Shields", items: items.Armor.Shields },
                                { header: "Shrunken Heads", items: items.Armor.ShrunkenHeads },
                                { header: "Auric Shields", items: items.Armor.AuricShields },
                                { header: "Gloves", items: items.Armor.Gloves },
                                { header: "Belts", items: items.Armor.Belts },
                                { header: "Boots", items: items.Armor.Boots }
                            ]}/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="weapons">
                            <ItemTables id="BaseWeapons" libraryType={LibraryType.Weapons} tables={[
                                { header: "Axes", items: items.Weapons.Axes },
                                { header: "Bows", items: items.Weapons.Bows },
                                { header: "Crossbows", items: items.Weapons.Crossbows },
                                { header: "Daggers", items: items.Weapons.Daggers },
                                { header: "Javelins", items: items.Weapons.Javelins },
                                { header: "Knuckles", items: items.Weapons.Knuckles },
                                { header: "Maces", items: items.Weapons.Maces },
                                { header: "Polearms", items: items.Weapons.Polearms },
                                { header: "Scepters", items: items.Weapons.Scepters },
                                { header: "Spears", items: items.Weapons.Spears },
                                { header: "Staves", items: items.Weapons.Staves },
                                { header: "Swords", items: items.Weapons.Swords },
                                { header: "Throwing Weapons", items: items.Weapons.ThrowingWeapons },
                                { header: "Wands", items: items.Weapons.Wands }
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