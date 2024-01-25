import { useContext, useState, FormEvent } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Outlet, Link } from "react-router-dom";
import { EasternSunCatalogContext } from './types/EasternSunCatalog.ts';

export default function ESCalc() {
    const catalog = useContext(EasternSunCatalogContext);

    const [searchValue, setSearchValue] = useState("");
    
    const search = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let res = catalog.items.searchItemsByNameOrCode(searchValue);
        res = res.concat(catalog.items.searchItemsByPropertyCode(searchValue));
        console.log(res);
    }

    return (
        <div id="ESCalc">
            <Navbar style={{ marginBottom: 10 }} sticky="top" expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Brand>ESCalc</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Character</Nav.Link>
                            <Nav.Link as={Link} to="/items">Items</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <Form onSubmit={search}>
                        <Row>
                        <Col>
                            <Form.Control type="text" value={searchValue} placeholder="Search items..." onChange={e => setSearchValue(e.target.value)} />
                        </Col>
                        <Col>
                            <Button type="submit">Search</Button>
                        </Col>
                        </Row>
                    </Form>
                </Container>
            </Navbar>
            <Container fluid>
                <Outlet />
            </Container>
        </div>
    );
}
