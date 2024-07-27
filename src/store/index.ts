import {combineReducers} from "redux";

import system from "./reducers/system.reducer.store";
import user from "./reducers/user.reducer.store";

/**
 * Reg and import store from here ...
 */
const rootReducer = combineReducers({
  system,
  user
});

/**
 * add store which you want (or not) to persist
 */
export const BLACK_LIST = [];
export const WHITE_LIST = ["user", "system"];

export default rootReducer;

export type RootReducer = ReturnType<typeof rootReducer>
