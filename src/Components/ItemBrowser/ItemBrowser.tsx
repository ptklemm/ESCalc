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
                <Col md={1}>
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
                                { header: "Body Armor", items: catalog.BodyArmor },
                                { header: "Robes", items: catalog.Robes },
                                { header: "Shields", items: catalog.Shields },
                                { header: "Gloves", items: catalog.Gloves },
                                { header: "Belts", items: catalog.Belts },
                                { header: "Boots", items: catalog.Boots },
                                { header: "Primal Helms", items: catalog.PrimalHelms, crumb: "Bar" },
                                { header: "Pelts", items: catalog.Pelts, crumb: "Dru" },
                                { header: "Shrunken Heads", items: catalog.ShrunkenHeads, crumb: "Nec" },
                                { header: "Auric Shields", items: catalog.AuricShields, crumb: "Pal" }
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
                                { header: "Amazon Weapons", items: catalog.AmazonWeapons, crumb: "Ama" },
                                { header: "Assassin Weapons", items: catalog.AssassinWeapons, crumb: "Asn" },
                                { header: "Barbarian Weapons", items: catalog.BarbarianWeapons, crumb: "Bar" },
                                { header: "Druid Weapons", items: catalog.DruidWeapons, crumb: "Dru" },
                                { header: "Necromancer Weapons", items: catalog.NecromancerWeapons, crumb: "Necr" },
                                { header: "Paladin Weapons", items: catalog.PaladinWeapons, crumb: "Pal" },
                                { header: "Sorceress Weapons", items: catalog.SorceressWeapons, crumb: "Sor" }
                            ]}/>
                        </Tab.Pane>
                        <Tab.Pane eventKey={Category.UniqueArmor}>
                            <ItemTables id="UniqueArmor" category={Category.UniqueArmor} tables={[
                                { header: "Unique Helms", items: catalog.UniqueHelms, crumb: "Helms" },
                                { header: "Unique Circlets", items: catalog.UniqueCirclets, crumb: "Circlets" },
                                { header: "Unique Body Armor", items: catalog.UniqueBodyArmor, crumb: "Body Armor" },
                                { header: "Unique Robes", items: catalog.UniqueRobes, crumb: "Robes" },
                                { header: "Unique Shields", items: catalog.UniqueShields, crumb: "Shields" },
                                { header: "Unique Gloves", items: catalog.UniqueGloves, crumb: "Gloves" },
                                { header: "Unique Belts", items: catalog.UniqueBelts, crumb: "Belts" },
                                { header: "Unique Boots", items: catalog.UniqueBoots, crumb: "Boots" },
                                { header: "Unique Primal Helms", items: catalog.UniquePrimalHelms, crumb: "Bar" },
                                { header: "Unique Pelts", items: catalog.UniquePelts, crumb: "Dru" },
                                { header: "Unique Shrunken Heads", items: catalog.UniqueShrunkenHeads, crumb: "Nec" },
                                { header: "Unique Auric Shields", items: catalog.UniqueAuricShields, crumb: "Pal" },
                            ]}/>
                        </Tab.Pane>
                        <Tab.Pane eventKey={Category.UniqueWeapons}>
                            <ItemTables id="UniqueWeapons" category={Category.UniqueWeapons} tables={[
                                { header: "Unique Axes", items: catalog.UniqueAxes, crumb: "Axes" },
                                { header: "Unique Bows", items: catalog.UniqueBows, crumb: "Bows" },
                                { header: "Unique Crossbows", items: catalog.UniqueCrossbows, crumb: "Crossbows" },
                                { header: "Unique Daggers", items: catalog.UniqueDaggers, crumb: "Daggers" },
                                { header: "Unique Javelins", items: catalog.UniqueJavelins, crumb: "Javelins" },
                                { header: "Unique Knuckles", items: catalog.UniqueKnuckles, crumb: "Knuckles" },
                                { header: "Unique Maces", items: catalog.UniqueMaces, crumb: "Maces" },
                                { header: "Unique Polearms", items: catalog.UniquePolearms, crumb: "Polearms" },
                                { header: "Unique Scepters", items: catalog.UniqueScepters, crumb: "Scepters" },
                                { header: "Unique Spears", items: catalog.UniqueSpears, crumb: "Spears" },
                                { header: "Unique Staves", items: catalog.UniqueStaves, crumb: "Staves" },
                                { header: "Unique Swords", items: catalog.UniqueSwords, crumb: "Swords" },
                                { header: "Unique Throwing Weapons", items: catalog.UniqueThrowingWeapons, crumb: "Throwing" },
                                { header: "Unique Wands", items: catalog.UniqueWands, crumb: "Wands" },
                                { header: "Unique Amazon Weapons", items: catalog.UniqueAmazonWeapons, crumb: "Ama" },
                                { header: "Unique Assassin Weapons", items: catalog.UniqueAssassinWeapons, crumb: "Asn" },
                                { header: "Unique Barbarian Weapons", items: catalog.UniqueBarbarianWeapons, crumb: "Bar" },
                                { header: "Unique Druid Weapons", items: catalog.UniqueDruidWeapons, crumb: "Dru" },
                                { header: "Unique Necromancer Weapons", items: catalog.UniqueNecromancerWeapons, crumb: "Nec" },
                                { header: "Unique Paladin Weapons", items: catalog.UniquePaladinWeapons, crumb: "Pal" },
                                { header: "Unique Sorceress Weapons", items: catalog.UniqueSorceressWeapons, crumb: "Sor" }
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