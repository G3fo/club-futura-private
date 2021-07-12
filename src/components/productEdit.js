import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import ProductsDataService from "../services/productsService";
import { ConfirmAlertService } from "../components/alertService";
import LoadingMask from "react-loadingmask";
import "react-loadingmask/dist/react-loadingmask.css";
import { useForm } from "react-hook-form";
import { CirclePicker } from "react-color";

import Swal from "sweetalert2";

const ProductCard = (props) => {
    const history = useHistory();
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [color, setColor] = useState("");
    const [loading, setLoading] = useState(true);

    const handleChangeComplete = (color) => {
        setColor(color.hex);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = (data) => {
        const newData = data;
        newData.color = color;
        handleUpdate(newData);
    };
    if (errors) {
        console.log(errors);
    }

    useEffect(() => {
        ProductsDataService.get(id)
            .then((response) => {
                setProduct(response.data);
                setColor(response.data.color);
                setLoading(false);
                reset({
                    state: response.data.state,
                });
            })
            .catch((e) => {
                console.log(e);
            });
    }, [id, reset]);

    const handleUpdate = async (data) => {
        const productData = {
            artist: data.artist ? data.artist : product.artist,
            description: data.description
                ? data.description
                : product.description,
            name: data.name ? data.name : product.name,
            price: data.price ? data.price : product.price,
            state: data.state ? data.state : product.state,
            color: data.color ? data.color : product.color,
        };
        ProductsDataService.updateProduct(id, productData)
            .then((response) => {
                console.log(response.data);
                Swal.fire({
                    title: "Editado!",
                    icon: "success",
                    confirmButtonText: "Ok",
                }).then(() => history.push("/"));
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const handleDelete = async (product) => {
        const res = await ConfirmAlertService(
            `¿Eliminar ${product.name}?`,
            "Esto es permanente",
            "Eliminar",
            "question"
        );
        const { _id } = product;
        if (res) {
            ProductsDataService.deleteProduct(_id)
                .then((response) => {
                    console.log(response.data);
                    alertRedirect(product);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    };

    const alertRedirect = (product) => {
        const finalSwal = {
            title: "Listo",
            text: `Se eliminó ${product.name} exitosamente`,
            showConfirmButton: true,
        };

        Swal.fire(finalSwal).then(() => history.push("/products"));
    };

    return (
        <LoadingMask loading={loading} text={"loading..."}>
            <div>
                {product ? (
                    <div className="card container">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div
                                className="d-flex justify-content-center"
                                style={{ margin: "auto", padding: "30px" }}
                            >
                                <CirclePicker
                                    color={color}
                                    onChangeComplete={handleChangeComplete}
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                />
                            </div>

                            <input
                                style={{ display: "none" }}
                                type="text"
                                className="form-control"
                                id="inputColor"
                                defaultValue={product.color}
                                {...register("color", {
                                    maxLength: 80,
                                })}
                            />
                            <label className="col-form-label">Artista</label>
                            <input
                                type="text"
                                defaultValue={product.artist}
                                className="form-control"
                                id="inputArtist"
                                {...register("artist", {})}
                            />
                            <label className="col-form-label">Obra</label>
                            <input
                                type="text"
                                defaultValue={product.name}
                                className="form-control"
                                id="inputName"
                                {...register("name", {
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
                                defaultValue={product.description}
                                className="form-control"
                                id="inputDescription"
                                {...register("description", {
                                    maxLength: 80,
                                })}
                            />
                            <label className="col-form-label">Precio</label>
                            <input
                                type="number"
                                defaultValue={product.price}
                                className="form-control"
                                id="inputPrice"
                                {...register("price", {})}
                            />
                            <label className="col-form-label">
                                Disponibles
                            </label>
                            <input
                                type="number"
                                defaultValue={product.state}
                                className="form-control"
                                id="inputPrice"
                                {...register("state", {})}
                            />
                            <div
                                className=" row justify-content-between"
                                style={{ padding: "20px" }}
                            >
                                <button
                                    type="button"
                                    className="btn btn-danger col-4"
                                    onClick={() => handleDelete(product)}
                                >
                                    Eliminar
                                </button>
                                <button
                                    className="btn btn-success col-4"
                                    type="submit"
                                    value="Actualizar"
                                >
                                    Actualizar
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    ""
                )}
            </div>
        </LoadingMask>
    );
};

export default ProductCard;
