import React, { useState, useEffect } from "react";
import ExpensesDataService from "../services/expensesService";
import Swal from "sweetalert2";
import { ConfirmAlertService } from "../components/alertService";
import { Link } from "react-router-dom";
import LoadingMask from "react-loadingmask";
import { Button, Modal } from "react-bootstrap";
import "react-loadingmask/dist/react-loadingmask.css";
import { useForm } from "react-hook-form";

const ExpensesList = () => {
    const [expenses, setExpenses] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchArtist, setSearchArtist] = useState("");
    const [artists, setArtists] = useState(["Todos"]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const onSubmit = (data) => handleAdd(data);
    console.log(errors);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        retrieveExpenses();
        retrieveArtists();
    }, []);

    const retrieveExpenses = () => {
        setLoading(true);
        ExpensesDataService.getAll().then((response) => {
            setExpenses(response.data.expenses);
            setLoading(false);
        });
    };

    const retrieveArtists = () => {
        ExpensesDataService.getArtists().then((response) => {
            setArtists(["Todos"].concat(response.data));
        });
    };

    const onChangeSearchName = (e) => {
        const searchName = e.target.value;
        setSearchName(searchName);
    };

    const onChangeSearchArtist = (e) => {
        const searchArtist = e.target.value;
        setSearchArtist(searchArtist);
    };

    const refreshList = () => {
        retrieveExpenses();
    };

    const find = (query, by) => {
        setLoading(true);
        ExpensesDataService.find(query, by)
            .then((response) => {
                setExpenses(response.data.expenses);
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const findByName = () => {
        find(searchName, "name");
    };

    const findByArtist = () => {
        if (searchArtist === "All Artists") {
            refreshList();
        } else {
            find(searchArtist, "artist");
        }
    };

    const alertRedirect = (expense) => {
        const finalSwal = {
            title: "Listo",
            text: `Se eliminó ${expense.name} exitosamente`,
            showConfirmButton: true,
        };

        Swal.fire(finalSwal).then(() => retrieveExpenses());
    };

    const handleDelete = async (expense) => {
        const res = await ConfirmAlertService(
            `¿Desea eliminar el gasto ${expense.name}?`,
            "Esto es permanente",
            "question"
        );

        if (res) {
            ExpensesDataService.deleteExpense(expense.restaurant_id)
                .then((response) => {
                    console.log(response.data);
                    alertRedirect(expense);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    };

    const handleAdd = async (data) => {
        ExpensesDataService.createExpense(data)
            .then((response) => {
                console.log(response.data);
                Swal.fire({
                    title: "Agregado!",
                    icon: "success",
                    confirmButtonText: "Ok",
                }).then(() => retrieveExpenses());
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const handleSell = async (expense) => {
        const data = {
            selling: true,
            state: "Vendido",
        };
        const { _id } = expense;
        ExpensesDataService.updateExpense(_id, data)
            .then((response) => {
                console.log(response.data);
                Swal.fire({
                    title: "Vendido!",
                    icon: "success",
                    confirmButtonText: "Ok",
                }).then(() => retrieveExpenses());
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <LoadingMask loading={loading} text={"loading..."}>
            <>
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    centered
                >
                    <Modal.Header>
                        <Modal.Title>Nuevo gasto</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Modal.Body>
                            <label className="col-form-label" for="inputName">
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
                            <label className="col-form-label" for="inputArtist">
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
                            <label className="col-form-label" for="inputPrice">
                                Precio
                            </label>
                            <input
                                type="number"
                                placeholder="Precio"
                                className="form-control"
                                id="inputPrice"
                                {...register("price", { required: true })}
                            />
                            <label className="col-form-label" for="inputState">
                                Estado
                            </label>
                            <select
                                className="form-control"
                                id="inputState"
                                {...register("state", { required: true })}
                            >
                                <option value="Disponible">Disponible</option>
                                <option value="No disponible">
                                    No disponible
                                </option>
                                <option value="Vendido">Vendido</option>
                            </select>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cerrar
                            </Button>
                            <input className="btn btn-primary" type="submit" />
                        </Modal.Footer>
                    </form>
                </Modal>
            </>
            <div>
                <div className="row pb-1">
                    <Button variant="primary" onClick={handleShow}>
                        Agregar
                    </Button>
                    <div
                        className="input-group col-lg-4"
                        style={{ marginBottom: "0.3em" }}
                    >
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name"
                            value={searchName}
                            onChange={onChangeSearchName}
                        />

                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={findByName}
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    <br />
                    <div className="input-group col-lg-4">
                        <select
                            className="form-control"
                            onChange={onChangeSearchArtist}
                        >
                            {artists.map((artist) => {
                                return <option value={artist}>{artist}</option>;
                            })}
                        </select>
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={findByArtist}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {expenses.map((expense) => {
                        return (
                            <div className="col-lg-4 pb-1">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title text-center">
                                            {expense.name}
                                        </h5>
                                        <p className="card-text">
                                            <strong>Artista: </strong>
                                            {expense.artist}
                                            <br />
                                        </p>
                                        <p className="card-text">
                                            <strong>Descripción: </strong>
                                            {expense.description}
                                            <br />
                                        </p>
                                        <p className="card-text">
                                            <strong>Precio: </strong>
                                            {expense.retail}
                                            <br />
                                        </p>
                                        <p className="card-text">
                                            <strong>Estado: </strong>
                                            {expense.state}
                                            <br />
                                        </p>
                                        <div className="row justify-content-between">
                                            <div className="col-auto mr-auto">
                                                <button
                                                    className="btn btn-success col-auto"
                                                    onClick={() =>
                                                        handleSell(expense)
                                                    }
                                                >
                                                    Vender
                                                </button>
                                            </div>
                                            <div className="col-auto">
                                                <Link
                                                    to={
                                                        "/expense/" +
                                                        expense._id
                                                    }
                                                    className="btn btn-primary"
                                                >
                                                    Editar
                                                </Link>
                                            </div>
                                            <div className="col-auto">
                                                <button
                                                    className="btn btn-danger col-auto"
                                                    onClick={() =>
                                                        handleDelete(expense)
                                                    }
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </LoadingMask>
    );
};

export default ExpensesList;
