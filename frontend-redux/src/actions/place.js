import API from "../utils/api.js";

export const ACTION_TYPES = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    FETCH_ALL: 'FETCH_ALL',
    PAGINATION: 'PAGINATION'
}

const formatingInput = (input) => {
    if (!Array.isArray(input.facilities))
        input.facilities = input.facilities.split(",")

    if (!Array.isArray(input.images))
        input.images = input.images.split(",")
    
    for (const [index, facility] of input.facilities.entries()) {
        input.facilities[index] = facility.trim().replace("\n","").replace(/'/g,"").replace(/"/g,"")
    }

    for (const [index, image] of input.images.entries()) {
        input.images[index] = image.trim().replace("\n","").replace(/'/g,"").replace(/"/g,"")
    }

    return input
}

export const fetchAll = (onSuccess) => dispatch => {
    API.place().fetchAll()
        .then(res => {
            dispatch({
                type: ACTION_TYPES.FETCH_ALL,
                payload: res.data
            })
            onSuccess()
        })
        .catch(err => console.log(err))
}

export const Pagination = (page = 1, limit = 10, name = "", category = "all", onSuccess) => dispatch => {
    API.place().fetchPagination(page, Math.abs(limit), name, category)
        .then(res =>{
            dispatch({
                type: ACTION_TYPES.PAGINATION,
                payload: res.data
            })
            onSuccess()
        })
        .catch(err => console.log(err))
}

export const create = (input, onSuccess) => dispatch => {
    const formattedData = formatingInput(input)
    API.place().create(formattedData)
        .then(res =>{
            dispatch({
                type: ACTION_TYPES.CREATE,
                payload: res.data
            })
            onSuccess()
        })
        .catch(err => console.log(err))
}

export const update = (id, input, onSuccess) => dispatch => {
    const formattedData = formatingInput(input)
    API.place().update(id,formattedData)
        .then(res =>{
            dispatch({
                type: ACTION_TYPES.UPDATE,
                payload: res.data
            })
            onSuccess()
        })
        .catch(err => console.log(err))
}

export const Delete = (id, onSuccess) => dispatch => {
    API.place().delete(id)
        .then(res =>{
            dispatch({
                type: ACTION_TYPES.DELETE,
                payload: res.data.id
            })
            onSuccess()
        })
        .catch(err => console.log(err))
}