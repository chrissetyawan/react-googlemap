import axios from "axios";

const baseUrl = 'http://localhost:3001/'

export default {
    place(url = baseUrl + 'places') {
        return {
            fetchAll: () => axios.get(url + '/list'),
            fetchPagination: (page, limit, name, category) => 
                axios.get(url + "?page=" + page + "&limit=" + limit + "&name=" + name + "&category=" + category),
            fetchById: id => axios.get(url + "/" + id),
            create: newRecord => axios.post(url, newRecord),
            update: (id, updatedRecord) => axios.put(url + "/" + id, updatedRecord),
            delete: id => axios.delete(url + "/" + id)
        }
    }
}