// modules
// imports
// action type
const TYPE = type => "hq/UI/" + type;

// action types
export const DISPLAY_LOGIN_MODAL_MSG = TYPE("DISPLAY_LOGIN_MODAL_MSG");
export const TOGGLE_LOGIN_MODAL = TYPE("TOGGLE_LOGIN_MODAL");
export const TOGGLE_REGISTER_MODAL = TYPE("TOGGLE_REGISTER_MODAL");

// initial state
const initialState = {
    loginModalMsg: "",
    showLoginModal: false,
    showRegisterModal: false,
};

// reducer
export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case DISPLAY_LOGIN_MODAL_MSG:
            return { ...state, loginModalMsg: action.payload };
        case TOGGLE_LOGIN_MODAL:
            return { ...state, showLoginModal: action.payload };
        case TOGGLE_REGISTER_MODAL:
            return { ...state, showRegisterModal: action.payload };
        default:
            return state;
    }
}

// action creators
export const displayLoginModalMsg = value => dispatch => {
    dispatch({
        type: TOGGLE_LOGIN_MODAL,
        payload: value,
    });
};

export const toggleLoginModal = value => dispatch => {
    dispatch({
        type: TOGGLE_LOGIN_MODAL,
        payload: value,
    });
};

export const toggleRegisterModal = value => dispatch => {
    dispatch({
        type: TOGGLE_REGISTER_MODAL,
        payload: value,
    });
};
