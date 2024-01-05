import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Outlet, Link } from "react-router-dom";

export default function ESCalc() {
    return (
        <div id="ESCalc">
            <Navbar style={{ marginBottom: 10 }} expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Brand>ESCalc</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Character</Nav.Link>
                            <Nav.Link as={Link} to="/items">Items</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container fluid>
                <Outlet />
            </Container>
        </div>
    );
}
