import React from "react";
import { AlertService, ConfirmAlertService } from "./alertService";

const DeleteBtn = ({ text, id, deleteHandler, close, path }) => {
    const handleDelete = async () => {
        const res = await ConfirmAlertService(
            `¿Desea eliminar el producto ${text}?`,
            "Esto es permanente",
            "question"
        );
        debugger;
        if (res) {
            deleteHandler(id).then((result) => {
                result.success
                    ? AlertService(
                          "Listo",
                          `Se eliminó ${text} exitosamente`,
                          "success",
                          close,
                          path
                      )
                    : AlertService(
                          "Error",
                          `La eliminación de ${text} falló`,
                          "error"
                      );
            });
        }
    };
    return (
        <button className="btn btn-danger" onClick={handleDelete}>
            Eliminar
        </button>
    );
};

export default DeleteBtn;
