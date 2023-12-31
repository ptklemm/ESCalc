import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import { ItemLibrary } from '../types/ItemLibrary';
import BaseArmor from './BaseArmor';
import BaseWeapons from './BaseWeapons';

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
                            <BaseArmor items={items.Armor} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="weapons">
                            <BaseWeapons items={items.Weapons} />
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