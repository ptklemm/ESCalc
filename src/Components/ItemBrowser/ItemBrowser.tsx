import { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import { ItemCatalogContext, Category } from '../../types/ItemCatalog';
import ItemTables from './ItemTables';

export default function ItemBrowser() {
    const catalog = useContext(ItemCatalogContext);
    
    return (
        <Tab.Container id="ItemBrowser" defaultActiveKey="Search" transition={false}>
            <Row>
                <Col md={2}>
                    <Nav className="flex-column">
                        <Nav.Link eventKey="Search">Search</Nav.Link>
                        <Nav.Link eventKey={Category.Armor}>Base Armor</Nav.Link>
                        <Nav.Link eventKey={Category.Weapons}>Base Weapons</Nav.Link>
                        <Nav.Link eventKey={Category.UniqueArmor}>Unique Armor</Nav.Link>
                        <Nav.Link eventKey={Category.UniqueWeapons}>Unique Weapons</Nav.Link>
                        <Nav.Link eventKey={Category.Sets}>Sets</Nav.Link>
                        <Nav.Link eventKey={Category.Gems}>Gems/Runes</Nav.Link>
                        <Nav.Link eventKey={Category.Runewords}>Runewords</Nav.Link>
                        <Nav.Link eventKey={Category.Gemwords}>Gemwords</Nav.Link>
                    </Nav>
                </Col>
                <Col>
                    <Tab.Content>
                        <Tab.Pane eventKey="Search">
                            {/* <ItemSearch catalog={catalog} /> */}
                        </Tab.Pane>
                        <Tab.Pane eventKey={Category.Armor}>
                            <ItemTables id="BaseArmor" category={Category.Armor} tables={[
                                { header: "Helms", items: catalog.Helms },
                                { header: "Circlets", items: catalog.Circlets },
                                { header: "Pelts", items: catalog.Pelts },
                                { header: "Primal Helms", items: catalog.PrimalHelms },
                                { header: "Body Armor", items: catalog.BodyArmor },
                                { header: "Robes", items: catalog.Robes },
                                { header: "Shields", items: catalog.Shields },
                                { header: "Shrunken Heads", items: catalog.ShrunkenHeads },
                                { header: "Auric Shields", items: catalog.AuricShields },
                                { header: "Gloves", items: catalog.Gloves },
                                { header: "Belts", items: catalog.Belts },
                                { header: "Boots", items: catalog.Boots }
                            ]}/>
                        </Tab.Pane>
                        <Tab.Pane eventKey={Category.Weapons}>
                            <ItemTables id="BaseWeapons" category={Category.Weapons} tables={[
                                { header: "Axes", items: catalog.Axes },
                                { header: "Bows", items: catalog.Bows },
                                { header: "Crossbows", items: catalog.Crossbows },
                                { header: "Daggers", items: catalog.Daggers },
                                { header: "Javelins", items: catalog.Javelins },
                                { header: "Knuckles", items: catalog.Knuckles },
                                { header: "Maces", items: catalog.Maces },
                                { header: "Polearms", items: catalog.Polearms },
                                { header: "Scepters", items: catalog.Scepters },
                                { header: "Spears", items: catalog.Spears },
                                { header: "Staves", items: catalog.Staves },
                                { header: "Swords", items: catalog.Swords },
                                { header: "Throwing Weapons", items: catalog.ThrowingWeapons, crumb: "Throwing" },
                                { header: "Wands", items: catalog.Wands },
                                { header: "Amazon Weapons", items: catalog.AmazonWeapons, crumb: "Amazon" },
                                { header: "Assassin Weapons", items: catalog.AssassinWeapons, crumb: "Assassin" },
                                { header: "Barbarian Weapons", items: catalog.BarbarianWeapons, crumb: "Barbarian" },
                                { header: "Druid Weapons", items: catalog.DruidWeapons, crumb: "Druid" },
                                { header: "Necromancer Weapons", items: catalog.NecromancerWeapons, crumb: "Necromancer" },
                                { header: "Paladin Weapons", items: catalog.PaladinWeapons, crumb: "Paladin" },
                                { header: "Sorceress Weapons", items: catalog.SorceressWeapons, crumb: "Sorceress" }
                            ]}/>
                        </Tab.Pane>
                        <Tab.Pane eventKey={Category.UniqueArmor}>
                            <ItemTables id="UniqueArmor" category={Category.UniqueArmor} tables={[
                                { header: "Helms", items: catalog.UniqueHelms },
                                { header: "Circlets", items: catalog.UniqueCirclets },
                                { header: "Pelts", items: catalog.UniquePelts },
                                { header: "Primal Helms", items: catalog.UniquePrimalHelms },
                                { header: "Body Armor", items: catalog.UniqueBodyArmor },
                                { header: "Robes", items: catalog.UniqueRobes },
                                { header: "Shields", items: catalog.UniqueShields },
                                { header: "Shrunken Heads", items: catalog.UniqueShrunkenHeads },
                                { header: "Auric Shields", items: catalog.UniqueAuricShields },
                                { header: "Gloves", items: catalog.UniqueGloves },
                                { header: "Belts", items: catalog.UniqueBelts },
                                { header: "Boots", items: catalog.UniqueBoots }
                            ]}/>
                        </Tab.Pane>
                        <Tab.Pane eventKey={Category.UniqueWeapons}>
                            <ItemTables id="UniqueWeapons" category={Category.UniqueWeapons} tables={[
                                { header: "Axes", items: catalog.UniqueAxes },
                                { header: "Bows", items: catalog.UniqueBows },
                                { header: "Crossbows", items: catalog.UniqueCrossbows },
                                { header: "Daggers", items: catalog.UniqueDaggers },
                                { header: "Javelins", items: catalog.UniqueJavelins },
                                { header: "Knuckles", items: catalog.UniqueKnuckles },
                                { header: "Maces", items: catalog.UniqueMaces },
                                { header: "Polearms", items: catalog.UniquePolearms },
                                { header: "Scepters", items: catalog.UniqueScepters },
                                { header: "Spears", items: catalog.UniqueSpears },
                                { header: "Staves", items: catalog.UniqueStaves },
                                { header: "Swords", items: catalog.UniqueSwords },
                                { header: "Throwing Weapons", items: catalog.UniqueThrowingWeapons, crumb: "Throwing" },
                                { header: "Wands", items: catalog.UniqueWands },
                                { header: "Amazon Weapons", items: catalog.UniqueAmazonWeapons, crumb: "Amazon" },
                                { header: "Assassin Weapons", items: catalog.UniqueAssassinWeapons, crumb: "Assassin" },
                                { header: "Barbarian Weapons", items: catalog.UniqueBarbarianWeapons, crumb: "Barbarian" },
                                { header: "Druid Weapons", items: catalog.UniqueDruidWeapons, crumb: "Druid" },
                                { header: "Necromancer Weapons", items: catalog.UniqueNecromancerWeapons, crumb: "Necromancer" },
                                { header: "Paladin Weapons", items: catalog.UniquePaladinWeapons, crumb: "Paladin" },
                                { header: "Sorceress Weapons", items: catalog.UniqueSorceressWeapons, crumb: "Sorceress" }
                            ]}/>
                        </Tab.Pane>
                        <Tab.Pane eventKey={Category.Sets}>Sets</Tab.Pane>
                        <Tab.Pane eventKey={Category.Gems}>Gems/Runes</Tab.Pane>
                        <Tab.Pane eventKey={Category.Runewords}>Runewords</Tab.Pane>
                        <Tab.Pane eventKey={Category.Gemwords}>Gemwords</Tab.Pane>
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    );
}