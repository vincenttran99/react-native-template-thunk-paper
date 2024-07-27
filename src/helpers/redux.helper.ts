import {AxiosError} from "axios";

import {
    ActionReducerMapBuilder,
    AnyAction,
    AsyncThunk,
    createSlice,
    SerializedError,
    SliceCaseReducers,
    ValidateSliceCaseReducers
} from "@reduxjs/toolkit";
import {globalApp} from "helpers/railway.helper";


namespace ReduxHelper{

  export const timer = (typeof performance !== "undefined" && performance !== null) && typeof performance.now === "function"
      ? performance
      : Date;


  /**
   * Model for redux actions with pagination
   */
  export type IQueryParams = {
    query?: string;
    page?: number;
    limit?: number;
    sort?: string;
    filter?: string;
    [propName: string]: any;
  };

  /**
   * Useful types for working with actions
   */
  type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
  export type PendingAction = ReturnType<GenericAsyncThunk["pending"]>;
  export type RejectedAction = ReturnType<GenericAsyncThunk["rejected"]>;
  export type FulfilledAction = ReturnType<GenericAsyncThunk["fulfilled"]>;

  /**
   * Check if the async action type is rejected
   */
  export function isRejectedAction(action: AnyAction) {
    return action.type.endsWith("/rejected");
  }

  /**
   * Check if the async action type is pending
   */
  export function isPendingAction(action: AnyAction) {
    return action.type.endsWith("/pending");
  }

  /**
   * Check if the async action type is completed
   */
  export function isFulfilledAction(action: AnyAction) {
    return action.type.endsWith("/fulfilled");
  }

  const commonErrorProperties: Array<keyof SerializedError> = ["name", "message", "stack", "code"];

  /**
   * serialize function used for async action errors,
   * since the default function from Redux Toolkit strips useful info from axios errors
   * *
   */
  export const serializeAxiosError = (value: any): AxiosError | SerializedError => {
    if (typeof value === "object" && value !== null) {
      if (value.isAxiosError) {
        return {
          name: value?.response?.data?.error || "",
          message: JSON.stringify(value?.response?.data?.message),
          stack: "",
          code: value?.response?.data?.status || 500
        };
      } else {
        const simpleError: SerializedError = {};
        for (const property of commonErrorProperties) {
          if (typeof value[property] === "string") {
            simpleError[property] = value[property];
          }
        }

        return simpleError;
      }
    }
    return { message: String(value) };
  };


  export interface EntityState<T> {
    loading?: boolean;
    errorMessage?: string | null;
    entities?: ReadonlyArray<T>;
    entity?: T;
    updating?: boolean;
    totalItems?: number;
    updateSuccess?: boolean;

    [propName: string]: any;
  }

  /**
   * A wrapper on top of createSlice from Redux Toolkit to extract
   * common reducers and matchers used by entities
   */
  export const createEntitySlice = <T, S extends EntityState<T>, Reducers extends SliceCaseReducers<S>>({
                                                                                                          name = "",
                                                                                                          initialState,
                                                                                                          reducers,
                                                                                                          extraReducers,
                                                                                                          skipRejectionHandling
                                                                                                        }: {
    name: string;
    initialState: S;
    reducers?: ValidateSliceCaseReducers<S, Reducers>;
    extraReducers?: (builder: ActionReducerMapBuilder<S>) => void;
    skipRejectionHandling?: boolean;
  }) => {
    return createSlice({
      name,
      initialState,
      reducers: {
        /**
         * Reset the entity state to initial state
         */
        reset() {
          return initialState;
        },
        ...reducers
      },
      extraReducers(builder) {
        // @ts-ignore
        extraReducers(builder);
        /*
         * Common rejection logic is handled here.
         * If you want to add your own rejcetion logic, pass `skipRejectionHandling: true`
         * while calling `createEntitySlice`
         * */
        if (!skipRejectionHandling) {
          builder.addMatcher(isRejectedAction, (state: any, action: any) => {
            state.loading = false;
            state.updating = false;
            state.updateSuccess = false;
            state.errorMessage = action.error.message;
          });
        }
      }
    });
  };


  export function customLogStoreHelper({ getState }: { getState: any }) {
    try {
      return (next: any) => {
        return (action: any) => {
          const enableLog = (globalApp.customLog && globalApp.customLog.enableLog) || false;
          if (!enableLog) return next(action);

          const logBuffer: any[] = [];
          const logEntry: any = {};

          logBuffer.push(logEntry);
          logEntry.started = timer.now();
          logEntry.startedTime = new Date();
          logEntry.prevState = getState();
          logEntry.action = action;
          logEntry.took = timer.now() - logEntry.started;
          logEntry.nextState = getState();

          if (globalApp.customLog) {
            globalApp.customLog.emitEvent({ type: "redux", logBuffer });
          }

          return next(action);
        };
      };
    } catch (e) {
      return (next: any) => (action: any) => next(action);
    }
  }

}

export default ReduxHelper