// modules
import { applyMiddleware, combineReducers, createStore } from "redux";
// middleware
import logger from "redux-logger";
import promise from "redux-promise-middleware";
import thunk from "redux-thunk";
// reducers
import UI from "./UI";
import User from "./User";
import { set } from "./User";

// root reducer
const reducer = combineReducers({
    ui: UI,
    user: User,
});
// middleware
const middleware = applyMiddleware(promise(), thunk, logger);
// store
const store = createStore(reducer, middleware);

// restore user from local storage
const userString = localStorage.getItem("hq-user");
if (userString) {
    const user = JSON.parse(userString);
    store.dispatch(set(user));
}

export default store;
