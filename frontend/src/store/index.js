import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import sessionReducer from './session';
import eventsReducer from "./events";
import groupsReducer from "./groups";
import attendeesReducer from "./attendees";
import membersReducer from "./members";

const rootReducer = combineReducers({
  // add reducer functions here
  session: sessionReducer,
  events: eventsReducer,
  groups: groupsReducer,
  attendees: attendeesReducer,
  members:membersReducer
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
