import axios from "axios";

const URL = 'http://localhost:3003/api/todos'

export const changeDescription = (event) => ({
    type: 'DESCRIPTION_CHANGED',
    payload: event.target.value
})

// Middleware thunk com estado
export const search = (description) => {
    return (dispatch, getState) => {
        const description = getState().todo.description
        const searchRegex = description ? `&description__regex=/${description}/` : ''
        const request = axios.get(`${URL}?sort=-createdAt${searchRegex}`)
            .then(resp => dispatch({
                type: 'TODO_SEARCHED',
                payload: resp.data
            }))
    }
}

// Middleware thunk
export const add = (description) => {
    return dispatch => {
        axios.post(URL, { description })
            .then(resp => dispatch(clear()))
            .then(resp => dispatch(search()))
    }
}

// Middleware thunk
export const markAsDone = (todo) => {
    return dispatch => {
        axios.put(`${URL}/${todo._id}`, { ...todo, done: true })
            .then(resp => dispatch(search()))
    }
}

// Middleware thunk
export const markAsPending = (todo) => {
    return dispatch => {
        axios.put(`${URL}/${todo._id}`, { ...todo, done: false })
            .then(resp => dispatch(search()))
    }
}

// Middleware thunk
export const remove = (todo) => {
    return dispatch => {
        axios.delete(`${URL}/${todo._id}`)
            .then(resp => dispatch(search()))
    }
}

// Middleware multi
export const clear = () => {
    return [{
        type: 'TODO_CLEAR'
    }, search()]
}