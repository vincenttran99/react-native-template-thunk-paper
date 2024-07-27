import {useEffect} from "react";
import {useAppDispatch} from "configs/store.config";
import GlobalHelper from "helpers/globalHelper";
import languages from "constants/system/languages";
import {StringHelper} from "helpers/string.helper";

namespace IAPIHook {
    export interface ICallThunk {
        dispatchFunction?: Function;
        params?: any;
        messageSuccess?: string;
        actionSuccess?: Function;
        showLoading?: boolean;
        autoHideLoading?: boolean;
        messageFailed?: string;
        actionFailed?: Function;
        functionService?: Function;
        showMessageFailed?: boolean
    }

    export interface ICallApi {
        dispatchFunction?: Function
        params: any
        messageSuccess?: string
        showMessageFailed?: boolean
        actionSuccess?: Function
        showLoading?: boolean
        hideLoading?: boolean
        messageFailed?: string
        actionFailed?: Function
        functionService?: Function
    }
}

export const useAPI = <T>() => {
    const dispatch = useAppDispatch();

    const callThunk = async ({
                                 dispatchFunction,
                                 params,
                                 messageSuccess,
                                 messageFailed,
                                 showLoading = true,
                                 showMessageFailed = true,
                                 autoHideLoading = false,
                                 actionSuccess,
                                 actionFailed
                             }: IAPIHook.ICallThunk) => {
        if (showLoading) {
            GlobalHelper.showLoading(autoHideLoading);
        }

        const res = await dispatch(dispatchFunction?.(params));
        GlobalHelper.hideLoading();
        console.log(res, "phuc")
        if ((res.payload?.status <= 299 && res.payload?.status >= 200) || res.payload?.data) {
            if (actionSuccess) {
                actionSuccess?.(res.payload.data);
            }
            if (messageSuccess) {
                GlobalHelper.showSnackBar({
                    type: "success",
                    content: messageSuccess
                });
            }
            return;
        }

        const message = Array.isArray(res.error?.message) ? res.error?.message?.[0] : (res.error?.message || languages.somethingWentWrong);
        if (showMessageFailed) {
            // @ts-ignore
            let messageContent = languages.error[StringHelper.removeSpecialCharacters(message).toLowerCase()];

            console.log(messageFailed || messageContent || message)
            GlobalHelper.showSnackBar({
                type: 'error',
                content: messageFailed || messageContent || message
            });
        }

        actionFailed?.(message);
    };

    const callService = async ({
                                   functionService,
                                   params,
                                   messageSuccess = "",
                                   showMessageFailed = true,
                                   actionSuccess = undefined,
                                   showLoading = true,
                                   hideLoading = true,
                                   actionFailed,
                                   messageFailed = ""
                               }: IAPIHook.ICallApi) => {
        try {
            if (showLoading) {
                GlobalHelper.showLoading();
            }
            const res = await functionService?.(params);
            if (hideLoading) {
                GlobalHelper.hideLoading();
            }
            if (res) {
                if (actionSuccess) {
                    actionSuccess?.(res);
                }
                if (messageSuccess) {
                    GlobalHelper.showSnackBar({
                        type: 'success',
                        content: messageSuccess
                    });
                }
                return;
            }
            actionFailed?.("Network Error");
        } catch (error: any) {
            GlobalHelper.hideLoading();
            const messages = error?.response?.data?.message;
            const message = Array.isArray(messages) ? messages?.[0] : (messages || languages.somethingWentWrong);
            if (showMessageFailed) {
                // @ts-ignore
                let messageContent = languages.error[StringHelper.removeSpecialCharacters(message).toLowerCase()];
                console.log(messageFailed || messageContent || message);
                GlobalHelper.showSnackBar({
                    type: 'error',
                    content: messageFailed || messageContent || message
                });
            }
            actionFailed?.(message);
        }
    };

    return {callThunk, callService};
};

/**
 * Custom hook to execute an asynchronous function and handle the results when the component is mounted.
 * This hook prevents memory leaks by canceling actions if the component is unmounted before the async operation completes.
 *
 * @param asyncFn - The asynchronous function to be executed.
 * @param arrayCallbackFunction - An array of callback functions to handle the results of the asynchronous function.
 */
export function useAsync<T>(asyncFn: () => Promise<T[]>, arrayCallbackFunction: ((item: T) => void)[]) {
    useEffect(() => {
        let isActive = true;

        try {
            asyncFn().then((data: T[]) => {
                if (isActive) {
                    data.forEach((itemResult, index) => {
                        if (itemResult && typeof arrayCallbackFunction[index] === "function")
                            arrayCallbackFunction[index](itemResult);
                    });
                }
            })
                .catch((error) => console.error(error));
        } catch (error) {
            console.error(error);
        }

        return () => {
            isActive = false;
        };
    }, [asyncFn]);
}
