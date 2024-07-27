import StorageHelper from "helpers/storage.helper";
import FirebaseHelper from "helpers/firebase.helper";
import NavigationHelper from "helpers/navigation.helper";
import ObjectHelper from "helpers/object.helper";

namespace AxiosHelper{

  const getTypeOfAttributes = ObjectHelper.getTypeOfAttributes;

  /**
   * @param errorData
   * @returns
   */
  export function getErrorMessage(errorData: any) {
    let message = errorData.message;
    if (errorData.fieldErrors) {
      errorData.fieldErrors.forEach((fErr: any) => {
        message += `\nfield: ${fErr.field},  Object: ${fErr.objectName}, message: ${fErr.message}\n`;
      });
    }
    return message;
  }



// Middleware function definition
  export function errorMiddleware() {
    // Returns the next middleware function
    return (next: any) => {
      // Returns the actual middleware function that handles the action
      return (action: any) => {
        /**
         * The error middleware serves to log error messages from dispatch.
         * It need not run in production.
         */

        // Only run this middleware in development mode
        if (__DEV__) {
          try {
            // Attempt to execute any code within this block (currently empty)
          } catch (e) {
            // Handle any errors thrown in the try block (currently empty)
          }

          // Destructure error from the action object
          const { error } = action;

          // If there is an error, handle it
          if (error) {
            console.log(`${action.type} caught at middleware with reason: ${JSON.stringify(error.message)}.`);

            try {
              // Attempt to parse the error message as JSON and extract the first message
              action.error.message = JSON.parse(error.message)[0].message;
            } catch (e) {
              // If parsing fails, use the original error message
              action.error.message = error.message;
            }

            // Assign the message back to the error object
            action.error.message = action.error.message;

            // Further check if the error has a response and extract a detailed message
            if (error && typeof error.response !== "undefined") {
              if (typeof error.response.data !== "undefined") {
                const message = getErrorMessage(error.response.data);
                action.error.message = message || "";
              }
            }
          }
        }

        // Pass the action to the next middleware or reducer
        return next(action);
      };
    };
  };


  export function createLogsFromResponse(response: any, isError: boolean) {
    if (__DEV__) return;

    let dataToLog: any = {
      endpoint: response?.config?.url,
      hasAuth: !!response?.config?.headers?.["X-Authorization"],
      type: response?.config?.method,
      data: getTypeOfAttributes(response?.config?.data),
      responseCode: isError ? response.status || (response.response ? response?.response?.status : 0) : response?.status,
      typeOfResponse: getTypeOfAttributes(response?.data)
    };

    if (isError) {
      dataToLog = {
        ...dataToLog,
        error: response?.response?.data?.error,
        messageError: response?.response?.data?.message
      };
    }
    StorageHelper.setBugLog("|*|API_" + JSON.stringify(dataToLog));

    if (isError) {
      setTimeout(() => {
        FirebaseHelper.createLogBug(response?.response?.data?.message || "", "", "api", NavigationHelper.getRouteName() || "");
      }, 500);
    }
  }

}

export default AxiosHelper
