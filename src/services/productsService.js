import http from "../http-common";

class ProductsDataService {
    getAll(page = 0) {
        return http.get(`?page=${page}`);
    }

    get(id) {
        console.log(id);
        return http.get(`/${id}`);
    }

    find(query, by = "name", page = 0) {
        return http.get(`?${by}=${query}&page=${page}`);
    }

    createProduct(data) {
        console.log(data);
        return http.post("/", data);
    }

    updateProduct(id, data) {
        return http.put(`/${id}`, data);
    }

    deleteProduct(id) {
        return http.delete(`/${id}`);
    }

    getArtists(id) {
        return http.get(`/artists`);
    }
}

export default new ProductsDataService();
