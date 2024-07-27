import {createNavigationContainerRef, NavigationState, PartialState, StackActions} from "@react-navigation/native";

export let TIMESTAMP_LAST_SCREEN_OPENING = 0;

namespace NavigationHelper {

  export const navigationRef = createNavigationContainerRef();

// @ts-ignore
  export const navigate = (screenName: string, params?: object) => {
    if (navigationRef.isReady()) {
      // @ts-ignore
      navigationRef.navigate(screenName, params);
    }
  };

  export const reset = (params: (PartialState<NavigationState> | NavigationState)) => {
    if (navigationRef.isReady()) {
      navigationRef.reset(params);
    }
  };

  export const push = (screenName: string, params?: object) => {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.push(screenName, params));
    }
  };

  export const pop = (numOfStack: number = 1) => {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.pop(numOfStack));
    }
  };


  export const goBack = () => {
    if (navigationRef.isReady()) {
      try {
        // @ts-ignore
        navigationRef.goBack();
      } catch (error) {

      }
    }
  };

  export const canGoBack = () => {
    return navigationRef.canGoBack();
  };

  export const getRouteName = () => {
    if (navigationRef.isReady()) {
      return navigationRef.getCurrentRoute()?.name;
    }
    return "";
  };

  export const getActiveRouteName = (state: any): any => {
    const route = state?.routes?.[state.index];

    if (route?.state) {
      // Dive into nested navigators
      return getActiveRouteName(route.state);
    }

    return route?.name;
  };

  export const replace = (screenName: string, params?: object) => {
    if (navigationRef.isReady() && getRouteName() !== screenName) {
      navigationRef.dispatch(StackActions.replace(screenName, params));
    }
  };

  /**
   * Variable to store the timestamp of screen opening
   */
  export function updateTimestampLastScreenOpening() {
    TIMESTAMP_LAST_SCREEN_OPENING = new Date().getTime();
  }
}

export default NavigationHelper;
