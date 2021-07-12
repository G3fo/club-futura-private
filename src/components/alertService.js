import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";

export const Alert = (title, text, icon, close = false, path = "") => {
    const history = useHistory();
    debugger;
    const finalSwal = {
        type: icon,
        title: title,
        text: text,
        showConfirmButton: true,
    };

    if (close) {
        Swal.fire(finalSwal).then(() => history.push(path));
    } else {
        Swal.fire(finalSwal);
    }
};

export const ConfirmAlertService = (
    title,
    text,
    confirmButton = "Estoy seguro",
    icon
) => {
    return new Promise((resolve, reject) => {
        Swal.fire({
            title,
            text,
            type: icon,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: confirmButton,
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                resolve(true);
            }
        });
    });
};
