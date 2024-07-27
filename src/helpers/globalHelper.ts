import * as React from "react";
import {ILoadingGlobalComponentRef} from "components/global/loading.global.component";
import {ISnackBarGlobalComponentRef, SnackBarProps} from "components/global/snackbar.global.component";

namespace GlobalHelper {
    /**
     * Refs
     */
    export const ViewShotRef = React.createRef<any>();
    export const LoadingRef = React.createRef<ILoadingGlobalComponentRef>();
    export const SnackBarRef = React.createRef<ISnackBarGlobalComponentRef>();


    /**
     * Functions Loading
     */
    export function showLoading(autoHide: boolean = true) {
        LoadingRef.current?.showLoading(autoHide);
    }

    export function hideLoading() {
        LoadingRef.current?.hideLoading();
    }

    /**
     * Functions SnackBar
     */
    export function showSnackBar(snackBarProps: SnackBarProps) {
        SnackBarRef.current?.showSnackBar(snackBarProps);
    }

    export function hideSnackBar() {
        SnackBarRef.current?.hideSnackBar();
    }

}

export default GlobalHelper;
