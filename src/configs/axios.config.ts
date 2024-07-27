import {MMKV} from "react-native-mmkv";

import axios, {AxiosResponse} from "axios";
import {globalApp} from "helpers/railway.helper";
import dayjs from "dayjs";
import AxiosHelper from "helpers/axios.helper";
import {appUrlConfig} from "configs/index";

const storageMMKV = new MMKV();


const TIMEOUT = Number(appUrlConfig.APP_API_REQUEST_TIMEOUT);
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = appUrlConfig.APP_MAIN_URL;

let Reset = "\x1b[0m";
let Bright = "\x1b[1m";
let FgGreen = "\x1b[32m";
let BgGreen = "\x1b[42m";
let BgBlue = "\x1b[44m";
let BgMagenta = "\x1b[45m";

/**
 * setupAxiosInterceptors
 * Configures Axios interceptors for handling requests and responses.
 * @param {Function} onUnauthenticated - Callback function for unauthenticated requests.
 */
export default function setupAxiosInterceptors(onUnauthenticated: (status: number) => void) {
    /**
     * onRequestSuccess
     * @param axios_config
     */
    const onRequestSuccess = async (axios_config: any) => {
        axios_config.headers["X-Authorization"] = storageMMKV.getString("token");

        // Append cache buster to URL
        const cacheBuster = Math.round(Math.random() * 1000000);
        axios_config.url = axios_config.url + (axios_config?.url?.includes("cacheBuster=") ? "" : (axios_config.url?.includes("?") ? "&" : "?") + `cacheBuster=${cacheBuster}`);
        axios_config.timeout = TIMEOUT;

        // Log request details
        let Method = String(axios_config.method).toUpperCase();
        if (__DEV__) {
            /**
             * Make color: https://backbencher.dev/articles/nodejs-colored-text-console
             */
            console.info("==========<<<<<<<<<<<<<<<START AXIOS<<<<======================");
            console.log(Bright + BgBlue + ` ${Method} ` + Reset, FgGreen + axios_config.url + Reset);
            console.log(Bright + BgMagenta + ` BODY ` + Reset, FgGreen + JSON.stringify(axios_config.body, null, 4) + Reset);
            console.log(Bright + BgGreen + ` AUTH ` + Reset, FgGreen + axios_config.headers["X-Authorization"] + Reset);
        }

        // Emit custom log event
        if (globalApp.customLog && globalApp.customLog.enableLog) {
            globalApp.customLog.emitEvent({
                type: "call_api",
                method: Method,
                payload: {
                    url: axios_config.url,
                    data: axios_config.body,
                    token: axios_config.headers["X-Authorization"],
                }
            });
        }
        return axios_config;
    };


    /**
     * onResponseSuccess
     * @param response
     */
    const onResponseSuccess = async (response: AxiosResponse<any, any>) => {
        AxiosHelper.createLogsFromResponse(response, false);

        // Log response details
        let Method = String(response.config.method).toUpperCase();
        if (__DEV__) {
            console.log(Bright + BgBlue + ` ${Method} ` + Reset, FgGreen + response.config.url + Reset);
            console.log("Response Success", response);
        }

        // Emit custom log event
        if (globalApp.customLog && globalApp.customLog.enableLog) {
            globalApp.customLog.emitEvent({
                type: "call_api_response",
                payload: `${Method}_RES:: ${response.config.url}${JSON.stringify(response.data)}\nTIME_RES:: ${dayjs().toString()}`
            });
        }

        return response;

    };


    /**
     * onResponseError
     * @param err
     */
    const onResponseError = async (err: any) => {
        AxiosHelper.createLogsFromResponse(err, true);
        // set session
        // const session = err?.response?.headers['x-authorization'];
        // if (session) await AsyncStorage.setItem('session', session);


        // Emit custom log event
        if (globalApp.customLog && globalApp.customLog.enableLog) {
            let Method = String(err.config.method).toUpperCase();
            globalApp.customLog.emitEvent({
                type: "call_api",
                method: Method,
                payload: {
                    url: err?.config?.url,
                    data: err?.config?.data,
                    token: err?.config?.headers?.["X-Authorization"]
                }
            });
        }


        /**
         * 401 or 403: not auth or permission
         */
        const status = err.status || (err.response ? err?.response?.status : 0);
        const requestUrl = err?.request?._url || "";
        if ((status === 401 || status === 403) && requestUrl.toLowerCase().includes(appUrlConfig.APP_MAIN_URL?.toLowerCase())) {
            onUnauthenticated(status);
        }

        return Promise.reject(err);
    };

    axios.interceptors.request.clear();
    axios.interceptors.response.clear();
    axios.interceptors.request.use(onRequestSuccess);
    axios.interceptors.response.use(onResponseSuccess, onResponseError);
};
