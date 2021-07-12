import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import logo from "../assets/logo.png";

const NavBar = () => {
    const divStyle = { textAlign: "center" };
    const style = { marginTop: "0.8em", marginBottom: "0.8em" };
    return (
        <Container>
            <Row style={style}>
                <Col style={divStyle}>
                    <Link to="/products">
                        <button className="btn btn-outline-dark">Obras</button>
                    </Link>
                </Col>
                <Col className="col" style={divStyle}>
                    <img width="45em" src={logo} alt="logo" />
                </Col>

                <Col style={divStyle}>
                    {/* <Link to="/expenses"> */}
                    <button className="btn btn-outline-dark">Gastos</button>
                    {/* </Link> */}
                </Col>
            </Row>
        </Container>
    );
};

export default NavBar;
