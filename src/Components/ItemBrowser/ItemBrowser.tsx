import { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import { EasternSunCatalogContext } from '../../types/EasternSunCatalog';
import { Category } from '../../types/ItemCatalog';
import ItemTables from './ItemTables';

export default function ItemBrowser() {
    const catalog = useContext(EasternSunCatalogContext);
    
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
                                { header: "Helms", items: catalog.items.Helms },
                                { header: "Circlets", items: catalog.items.Circlets },
                                { header: "Body Armor", items: catalog.items.BodyArmor },
                                { header: "Robes", items: catalog.items.Robes },
                                { header: "Shields", items: catalog.items.Shields },
                                { header: "Gloves", items: catalog.items.Gloves },
                                { header: "Belts", items: catalog.items.Belts },
                                { header: "Boots", items: catalog.items.Boots },
                                { header: "Primal Helms", items: catalog.items.PrimalHelms, crumb: "Bar" },
                                { header: "Pelts", items: catalog.items.Pelts, crumb: "Dru" },
                                { header: "Shrunken Heads", items: catalog.items.ShrunkenHeads, crumb: "Nec" },
                                { header: "Auric Shields", items: catalog.items.AuricShields, crumb: "Pal" }
                            ]}/>
                        </Tab.Pane>
                        <Tab.Pane eventKey={Category.Weapons}>
                            <ItemTables id="BaseWeapons" category={Category.Weapons} tables={[
                                { header: "Axes", items: catalog.items.Axes },
                                { header: "Bows", items: catalog.items.Bows },
                                { header: "Crossbows", items: catalog.items.Crossbows },
                                { header: "Daggers", items: catalog.items.Daggers },
                                { header: "Javelins", items: catalog.items.Javelins },
                                { header: "Knuckles", items: catalog.items.Knuckles },
                                { header: "Maces", items: catalog.items.Maces },
                                { header: "Polearms", items: catalog.items.Polearms },
                                { header: "Scepters", items: catalog.items.Scepters },
                                { header: "Spears", items: catalog.items.Spears },
                                { header: "Staves", items: catalog.items.Staves },
                                { header: "Swords", items: catalog.items.Swords },
                                { header: "Throwing Weapons", items: catalog.items.ThrowingWeapons, crumb: "Throwing" },
                                { header: "Wands", items: catalog.items.Wands },
                                { header: "Amazon Weapons", items: catalog.items.AmazonWeapons, crumb: "Ama" },
                                { header: "Assassin Weapons", items: catalog.items.AssassinWeapons, crumb: "Asn" },
                                { header: "Barbarian Weapons", items: catalog.items.BarbarianWeapons, crumb: "Bar" },
                                { header: "Druid Weapons", items: catalog.items.DruidWeapons, crumb: "Dru" },
                                { header: "Necromancer Weapons", items: catalog.items.NecromancerWeapons, crumb: "Necr" },
                                { header: "Paladin Weapons", items: catalog.items.PaladinWeapons, crumb: "Pal" },
                                { header: "Sorceress Weapons", items: catalog.items.SorceressWeapons, crumb: "Sor" }
                            ]}/>
                        </Tab.Pane>
                        <Tab.Pane eventKey={Category.UniqueArmor}>
                            <ItemTables id="UniqueArmor" category={Category.UniqueArmor} tables={[
                                { header: "Unique Rings", crumb: "Rings", subTables: [
                                    { subheader: "Generic Rings", items: catalog.items.UniqueRings },
                                    { subheader: "Amazonian Loops", items: catalog.items.UniqueAmazonianLoops },
                                    { subheader: "Assassin's Spirals", items: catalog.items.UniqueAssassinsSpirals },
                                    { subheader: "Barbaric Hoops", items: catalog.items.UniqueBarbaricHoops },
                                    { subheader: "Druid's Seals", items: catalog.items.UniqueDruidsSeals },
                                    { subheader: "Necromancer's Stones", items: catalog.items.UniqueNecromancersStones },
                                    { subheader: "Paladic Haloes", items: catalog.items.UniquePaladicHaloes },
                                    { subheader: "Sorcerer's Bands", items: catalog.items.UniqueSorcerersBands }
                                ]},
                                { header: "Unique Amulets", crumb: "Amulets", subTables: [
                                    { subheader: "Generic Amulets", items: catalog.items.UniqueAmulets },
                                    { subheader: "Amazonian Pins", items: catalog.items.UniqueAmazonianPins },
                                    { subheader: "Assassin's Chokers", items: catalog.items.UniqueAssassinsChokers },
                                    { subheader: "Totemic Pebbles", items: catalog.items.UniqueTotemicPebbles },
                                    { subheader: "Druidic Necklaces", items: catalog.items.UniqueDruidicNecklaces },
                                    { subheader: "Death's Lockets", items: catalog.items.UniqueDeathsLockets },
                                    { subheader: "Holy Pendants", items: catalog.items.UniqueHolyPendants },
                                    { subheader: "Sorcerer's Talismans", items: catalog.items.UniqueSorcerersTalismans }
                                ]},
                                { header: "Unique Helms", items: catalog.items.UniqueHelms, crumb: "Helms" },
                                { header: "Unique Circlets", items: catalog.items.UniqueCirclets, crumb: "Circlets" },
                                { header: "Unique Body Armor", items: catalog.items.UniqueBodyArmor, crumb: "Body Armor" },
                                { header: "Unique Robes", items: catalog.items.UniqueRobes, crumb: "Robes" },
                                { header: "Unique Shields", items: catalog.items.UniqueShields, crumb: "Shields" },
                                { header: "Unique Gloves", items: catalog.items.UniqueGloves, crumb: "Gloves" },
                                { header: "Unique Belts", items: catalog.items.UniqueBelts, crumb: "Belts" },
                                { header: "Unique Boots", items: catalog.items.UniqueBoots, crumb: "Boots" },
                                { header: "Unique Primal Helms", items: catalog.items.UniquePrimalHelms, crumb: "Bar" },
                                { header: "Unique Pelts", items: catalog.items.UniquePelts, crumb: "Dru" },
                                { header: "Unique Shrunken Heads", items: catalog.items.UniqueShrunkenHeads, crumb: "Nec" },
                                { header: "Unique Auric Shields", items: catalog.items.UniqueAuricShields, crumb: "Pal" },
                            ]}/>
                        </Tab.Pane>
                        <Tab.Pane eventKey={Category.UniqueWeapons}>
                            <ItemTables id="UniqueWeapons" category={Category.UniqueWeapons} tables={[
                                { header: "Unique Axes", items: catalog.items.UniqueAxes, crumb: "Axes" },
                                { header: "Unique Bows", items: catalog.items.UniqueBows, crumb: "Bows" },
                                { header: "Unique Crossbows", items: catalog.items.UniqueCrossbows, crumb: "Crossbows" },
                                { header: "Unique Daggers", items: catalog.items.UniqueDaggers, crumb: "Daggers" },
                                { header: "Unique Javelins", items: catalog.items.UniqueJavelins, crumb: "Javelins" },
                                { header: "Unique Knuckles", items: catalog.items.UniqueKnuckles, crumb: "Knuckles" },
                                { header: "Unique Maces", items: catalog.items.UniqueMaces, crumb: "Maces" },
                                { header: "Unique Polearms", items: catalog.items.UniquePolearms, crumb: "Polearms" },
                                { header: "Unique Scepters", items: catalog.items.UniqueScepters, crumb: "Scepters" },
                                { header: "Unique Spears", items: catalog.items.UniqueSpears, crumb: "Spears" },
                                { header: "Unique Staves", items: catalog.items.UniqueStaves, crumb: "Staves" },
                                { header: "Unique Swords", items: catalog.items.UniqueSwords, crumb: "Swords" },
                                { header: "Unique Throwing Weapons", items: catalog.items.UniqueThrowingWeapons, crumb: "Throwing" },
                                { header: "Unique Wands", items: catalog.items.UniqueWands, crumb: "Wands" },
                                { header: "Unique Amazon Weapons", items: catalog.items.UniqueAmazonWeapons, crumb: "Ama" },
                                { header: "Unique Assassin Weapons", items: catalog.items.UniqueAssassinWeapons, crumb: "Asn" },
                                { header: "Unique Barbarian Weapons", items: catalog.items.UniqueBarbarianWeapons, crumb: "Bar" },
                                { header: "Unique Druid Weapons", items: catalog.items.UniqueDruidWeapons, crumb: "Dru" },
                                { header: "Unique Necromancer Weapons", items: catalog.items.UniqueNecromancerWeapons, crumb: "Nec" },
                                { header: "Unique Paladin Weapons", items: catalog.items.UniquePaladinWeapons, crumb: "Pal" },
                                { header: "Unique Sorceress Weapons", items: catalog.items.UniqueSorceressWeapons, crumb: "Sor" }
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