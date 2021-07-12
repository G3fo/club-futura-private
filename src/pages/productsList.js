import React, { useState, useEffect } from "react";
import ProductsDataService from "../services/productsService";
import Swal from "sweetalert2";
import { ConfirmAlertService } from "../components/alertService";
import { Link } from "react-router-dom";
import LoadingMask from "react-loadingmask";
import {
    Button,
    Container,
    Modal,
    Row,
    Accordion,
    Card,
} from "react-bootstrap";
import "react-loadingmask/dist/react-loadingmask.css";
import { useForm } from "react-hook-form";
import { CirclePicker } from "react-color";

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [searchArtist, setSearchArtist] = useState("");
    const [artists, setArtists] = useState(["TODOS"]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [color, setColor] = useState("#f44336");

    const handleChangeComplete = (c) => {
        setColor(c.hex);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const onSubmit = (data) => {
        const newData = data;
        newData.color = color;
        handleAdd(newData);
    };
    if (errors) {
        console.log(errors);
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        retrieveProducts();
        retrieveArtists();
    }, []);

    const retrieveProducts = () => {
        setLoading(true);
        ProductsDataService.getAll().then((response) => {
            const sortedProducts = response.data.products.sort(function (a, b) {
                if (a.artist < b.artist) {
                    return -1;
                }
                if (a.artist > b.artist) {
                    return 1;
                }
                return 0;
            });
            //REFACTORING 1 ARRAY POR ARTISTA
            const productsByArtists = Array.from(
                sortedProducts
                    .reduce(
                        (m, o) =>
                            m.set(o.artist, [...(m.get(o.artist) || []), o]),
                        new Map()
                    )
                    .values(),
                (a) => a
            );

            setProducts(productsByArtists);
            setLoading(false);
        });
    };

    const retrieveArtists = () => {
        ProductsDataService.getArtists().then((response) => {
            setArtists(["TODOS"].concat(response.data));
        });
    };

    const onChangeSearchArtist = (e) => {
        const searchArtist = e.target.value;
        setSearchArtist(searchArtist);
    };

    const refreshList = () => {
        retrieveProducts();
    };

    const find = (query, by) => {
        setLoading(true);
        ProductsDataService.find(query, by)
            .then((response) => {
                const sortedProducts = response.data.products.sort(function (
                    a,
                    b
                ) {
                    if (a.artist < b.artist) {
                        return -1;
                    }
                    if (a.artist > b.artist) {
                        return 1;
                    }
                    return 0;
                });
                //REFACTORING 1 ARRAY POR ARTISTA
                const productsByArtists = Array.from(
                    sortedProducts
                        .reduce(
                            (m, o) =>
                                m.set(o.artist, [
                                    ...(m.get(o.artist) || []),
                                    o,
                                ]),
                            new Map()
                        )
                        .values(),
                    (a) => a
                );

                setProducts(productsByArtists);
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const findByArtist = () => {
        console.log(searchArtist);
        if (searchArtist === "TODOS") {
            refreshList();
        } else {
            find(searchArtist, "artist");
        }
    };

    const handleAdd = async (data) => {
        debugger;

        ProductsDataService.createProduct(data)
            .then((response) => {
                console.log(response.data);
                Swal.fire({
                    title: "Agregado!",
                    icon: "success",
                    confirmButtonText: "Ok",
                }).then(() => retrieveProducts());
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const handleSell = async (product) => {
        const res = await ConfirmAlertService(
            `Vender ${product.name}?`,
            "",
            "Si",
            "question"
        );

        const { state } = product;
        const newState = state - 1;
        const data = {
            selling: true,
            state: newState,
        };
        const { _id } = product;
        if (res) {
            ProductsDataService.updateProduct(_id, data)
                .then((response) => {
                    console.log(response.data);
                    Swal.fire({
                        title: "Vendido!",
                        icon: "success",
                        confirmButtonText: "Ok",
                    }).then(() => retrieveProducts());
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    };

    const buttonStyle = { alignItems: "center" };
    const buttonStyleRight = { alignItems: "center" };
    console.log(products);

    return (
        <LoadingMask loading={loading} text={"loading..."}>
            <Container>
                <>
                    <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                        centered
                    >
                        <Modal.Header>
                            <Modal.Title>Nuevo producto</Modal.Title>
                        </Modal.Header>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Modal.Body>
                                <div style={{ margin: "auto" }}>
                                    <CirclePicker
                                        color={color}
                                        onChangeComplete={handleChangeComplete}
                                    />
                                </div>
                                <input
                                    style={{ display: "none" }}
                                    type="text"
                                    className="form-control"
                                    id="inputColor"
                                    value={color}
                                    {...register("color", {
                                        required: true,
                                        maxLength: 80,
                                    })}
                                />

                                <label
                                    className="col-form-label"
                                    for="inputArtist"
                                >
                                    Artista
                                </label>
                                <input
                                    type="text"
                                    placeholder="Artista"
                                    className="form-control"
                                    id="inputArtist"
                                    {...register("artist", { required: true })}
                                />

                                <label
                                    className="col-form-label"
                                    for="inputName"
                                >
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    className="form-control"
                                    id="inputName"
                                    {...register("name", {
                                        required: true,
                                        maxLength: 80,
                                    })}
                                />

                                <label
                                    className="col-form-label"
                                    for="inputDescription"
                                >
                                    Descripción
                                </label>
                                <input
                                    type="text"
                                    placeholder="Descripción"
                                    className="form-control"
                                    id="inputDescription"
                                    {...register("description", {
                                        maxLength: 80,
                                    })}
                                />
                                <label
                                    className="col-form-label"
                                    for="inputPrice"
                                >
                                    Precio
                                </label>
                                <input
                                    type="number"
                                    placeholder="Precio"
                                    className="form-control"
                                    id="inputPrice"
                                    {...register("price", { required: true })}
                                />
                                <label
                                    className="col-form-label"
                                    for="inputState"
                                >
                                    Disponibles
                                </label>
                                <input
                                    type="number"
                                    placeholder="Unidades"
                                    className="form-control"
                                    id="inputPrice"
                                    {...register("state", { required: true })}
                                />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    variant="secondary"
                                    onClick={handleClose}
                                >
                                    Cerrar
                                </Button>
                                <input
                                    className="btn btn-primary"
                                    type="submit"
                                />
                            </Modal.Footer>
                        </form>
                    </Modal>
                </>

                <Container style={{ padding: "0", flexWrap: "nowrap" }}>
                    <Row className="justify-content-between">
                        <div className="col-10">
                            <div className="input-group">
                                <select
                                    className="form-control"
                                    onChange={onChangeSearchArtist}
                                >
                                    {artists.map((artist) => {
                                        return (
                                            <option value={artist}>
                                                {artist}
                                            </option>
                                        );
                                    })}
                                </select>
                                <div className="input-group-append">
                                    <button
                                        className="btn btn-secondary"
                                        type="button"
                                        onClick={findByArtist}
                                    >
                                        Filtrar
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-2" style={{ textAlign: "right" }}>
                            <Button variant="warning" onClick={handleShow}>
                                <h5>
                                    <strong> + </strong>
                                </h5>
                            </Button>
                        </div>
                    </Row>
                </Container>
                <Container>
                    <div className="row">
                        {
                            //REFACTORING 1 ARRAY POR ARTISTA
                        }{" "}
                        {products.map((productsArrays) => {
                            return (
                                <Accordion style={{ padding: "0" }}>
                                    <Card>
                                        <Accordion.Toggle
                                            as={Card.Header}
                                            eventKey="0"
                                        >
                                            <Row>
                                                <div
                                                    className="col-1"
                                                    style={{
                                                        borderRadius: "5px",
                                                        backgroundColor:
                                                            productsArrays[0]
                                                                .color,
                                                        padding: "0",
                                                        marginLeft: "10px",
                                                    }}
                                                ></div>
                                                <h5 className="col">
                                                    <strong>
                                                        {
                                                            productsArrays[0]
                                                                .artist
                                                        }
                                                    </strong>
                                                </h5>
                                            </Row>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body
                                                style={{ padding: "8px" }}
                                            >
                                                {productsArrays.map(
                                                    (product) => {
                                                        return (
                                                            <div
                                                                className="card container"
                                                                style={{
                                                                    marginTop:
                                                                        "0.2em",
                                                                    marginBottom:
                                                                        "0.2em",
                                                                    paddingInline:
                                                                        "12px",
                                                                }}
                                                            >
                                                                <div
                                                                    className="card-header row"
                                                                    style={{
                                                                        padding:
                                                                            "12px",
                                                                    }}
                                                                >
                                                                    <h5
                                                                        className="col card-title"
                                                                        style={{
                                                                            marginBottom:
                                                                                "0",
                                                                            padding:
                                                                                "0",
                                                                        }}
                                                                    >
                                                                        <strong>
                                                                            {
                                                                                product.name
                                                                            }
                                                                        </strong>
                                                                    </h5>

                                                                    {product.state !==
                                                                        0 && (
                                                                        <div
                                                                            className="d-flex col-2"
                                                                            style={
                                                                                buttonStyleRight
                                                                            }
                                                                        >
                                                                            <Link
                                                                                className="badge rounded-pill bg-light text-center"
                                                                                onClick={() =>
                                                                                    handleSell(
                                                                                        product
                                                                                    )
                                                                                }
                                                                            >
                                                                                Vender
                                                                            </Link>
                                                                        </div>
                                                                    )}

                                                                    <div
                                                                        className="d-flex col-2 "
                                                                        style={
                                                                            buttonStyle
                                                                        }
                                                                    >
                                                                        <Link
                                                                            to={
                                                                                "/product/" +
                                                                                product._id
                                                                            }
                                                                            className="badge rounded-pill bg-light text-center"
                                                                        >
                                                                            Editar
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="card-body"
                                                                    style={{
                                                                        padding:
                                                                            "0",
                                                                        paddingTop:
                                                                            "5px",
                                                                        paddingBottom:
                                                                            "5px",
                                                                    }}
                                                                >
                                                                    <div className="row justify-content-between">
                                                                        <div className="col-auto">
                                                                            {
                                                                                product.description
                                                                            }{" "}
                                                                            <br />
                                                                            Disponibles:
                                                                            {
                                                                                product.state
                                                                            }
                                                                            <br />
                                                                        </div>
                                                                        <div className="col-auto">
                                                                            Precio:
                                                                            $
                                                                            {
                                                                                product.price
                                                                            }
                                                                            <br />
                                                                            Final:
                                                                            $
                                                                            {
                                                                                product.retail
                                                                            }
                                                                            <br />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                            );
                        })}
                    </div>
                </Container>
            </Container>
            <br />
        </LoadingMask>
    );
};

export default ProductsList;
// {
// productsArrays.map((product) => {
//     return (
//         <div
//             className="card"
//             style={{
//                 marginTop: "0.2em",
//                 marginBottom: "0.2em",
//             }}
//         >
//             <div
//                 className="card-header row"
//                 style={{ padding: "12px" }}
//             >
//                 <div
//                     className="col-1"
//                     style={{
//                         borderRadius: "5px",
//                         backgroundColor:
//                             product.color,
//                         padding: "0",
//                     }}
//                 ></div>

//                 <h5
//                     className="col card-title"
//                     style={{ marginBottom: "0" }}
//                 >
//                     <strong>
//                         {product.artist}
//                     </strong>
//                 </h5>

//                 {product.state !== 0 && (
//                     <div
//                         className="d-flex col-2"
//                         style={buttonStyleRight}
//                     >
//                         <Link
//                             className="badge rounded-pill bg-light text-center"
//                             onClick={() =>
//                                 handleSell(product)
//                             }
//                         >
//                             Vender
//                         </Link>
//                     </div>
//                 )}

//                 <div
//                     className="d-flex col-2 "
//                     style={buttonStyle}
//                 >
//                     <Link
//                         to={
//                             "/product/" +
//                             product._id
//                         }
//                         className="badge rounded-pill bg-light text-center"
//                     >
//                         Editar
//                     </Link>
//                 </div>
//             </div>
//             <div
//                 className="card-body"
//                 style={{
//                     padding: "0",
//                     paddingTop: "5px",
//                     paddingBottom: "5px",
//                 }}
//             >
//                 <div className="row">
//                     <strong>{product.name}</strong>
//                 </div>
//                 <div className="row justify-content-between">
//                     <div className="col-auto">
//                         {product.description} <br />
//                         Disponibles:
//                         {product.state}
//                         <br />
//                     </div>
//                     <div className="col-auto">
//                         Precio: ${product.price}
//                         <br />
//                         Final: ${product.retail}
//                         <br />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// });
// }
