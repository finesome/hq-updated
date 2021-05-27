// modules
import axios from "axios";
// imports
import { authRoutes } from "assets/routes";
// action type
const TYPE = type => "hq/User/" + type;
// axios promises
const PENDING = action => action + "_PENDING";
const DONE = action => action + "_FULFILLED";
const FAIL = action => action + "_REJECTED";

// action types
export const GET_USER = TYPE("GET_USER");
export const REGISTER = TYPE("REGISTER");
export const LOGIN = TYPE("LOGIN");
export const EDIT = TYPE("EDIT");
export const SET = TYPE("SET");
export const LOGOUT = TYPE("LOGOUT");

// initial state
const initialState = {
    getUser: { pending: null, done: null, fail: null },
    register: { pending: null, done: null, fail: null },
    login: { pending: null, done: null, fail: null },
    logout: { pending: null, done: null, fail: null },
    edit: { pending: null, done: null, fail: null },
    user: {},
};

// reducer
export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case PENDING(GET_USER):
            return { ...state, getUser: { pending: true } };
        case DONE(GET_USER):
            return { ...state, getUser: { done: true }, user: action.payload.data.message };
        case FAIL(GET_USER):
            return { ...state, getUser: { fail: true } };
        case PENDING(REGISTER):
            return { ...state, register: { pending: true } };
        case DONE(REGISTER):
            return { ...state, register: { done: true } };
        case FAIL(REGISTER):
            return { ...state, register: { fail: true } };
        case PENDING(LOGIN):
            return { ...state, login: { pending: true } };
        case DONE(LOGIN):
            return { ...state, login: { done: true } };
        case FAIL(LOGIN):
            return { ...state, login: { fail: true } };
        case PENDING(LOGOUT):
            return { ...state, logout: { pending: true } };
        case DONE(LOGOUT):
            return { ...state, logout: { done: true }, user: {} };
        case FAIL(LOGOUT):
            return { ...state, logout: { fail: true } };
        case PENDING(EDIT):
            return { ...state, edit: { pending: true } };
        case DONE(EDIT):
            return { ...state, edit: { done: true } };
        case FAIL(EDIT):
            return { ...state, edit: { fail: true } };
        case SET:
            return { ...state, user: action.payload };
        default:
            return state;
    }
}

// action creators
export const getUser = () => async dispatch => {
    await dispatch({
        type: GET_USER,
        payload: axios.get(authRoutes.getUser()),
    });
};

export const register = (email, password, lastName, firstName, phone, city, school, mailing) => dispatch => {
    return dispatch({
        type: REGISTER,
        payload: axios.post(authRoutes.register(), {
            email: email,
            password: password,
            lastName: lastName,
            firstName: firstName,
            phone: phone,
            city: city,
            school: school,
            mailing: mailing,
        }),
    });
};

export const login = (email, password) => dispatch => {
    return dispatch({
        type: LOGIN,
        payload: axios.post(authRoutes.login(), {
            email: email,
            password: password,
        }),
    });
};

export const logout = () => dispatch => {
    return dispatch({
        type: LOGOUT,
        payload: axios.post(authRoutes.logout()),
    }).then(() => {
        // remove authorization header from axios requests
        axios.defaults.headers.common["Authorization"] = "";
        // remove authorization header from local storage
        localStorage.removeItem("hq-authorization");
        // remove user from local storage
        localStorage.removeItem("hq-user");
    });
};

export const edit = (attribute, value) => dispatch => {
    return dispatch({
        type: EDIT,
        payload: axios.post(authRoutes.edit(attribute), { value: value }),
    });
};

export const set = user => dispatch => {
    // append authorization header to axios requests
    axios.defaults.headers.common["Authorization"] = user.headers["authorization"];
    // save authorization header to local storage
    localStorage.setItem("hq-authorization", user.headers["authorization"]);
    // save user to local storage
    localStorage.setItem("hq-user", JSON.stringify(user));
    // dispatch
    dispatch({
        type: SET,
        payload: user,
    });
};
