import axios from "axios";

export default axios.create({
    baseURL: "https://futurabackend.herokuapp.com/api/v1/products",
    headers: {
        "Content-type": "application/json",
    },
});
