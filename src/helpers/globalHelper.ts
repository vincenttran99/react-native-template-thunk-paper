import React, {createRef} from 'react';
import {ILoadingGlobalComponentRef} from 'components/global/loading.global.component';
import {
  ISnackBarGlobalComponentRef,
  SnackBarProps,
} from 'components/global/snackbar.global.component';

namespace GlobalHelper {
  /**
   * Refs
   */
  export const ViewShotRef = createRef<any>();
  export const LoadingRef = createRef<ILoadingGlobalComponentRef>();
  export const SnackBarRef = createRef<ISnackBarGlobalComponentRef>();
  export const DialogRef = createRef<IDialogGlobalComponentRef>();

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

  export function showSuccessSnackBar(content: string) {
    SnackBarRef.current?.showSnackBar({type: 'success', content});
  }

  export function showInfoSnackBar(content: string) {
    SnackBarRef.current?.showSnackBar({type: 'info', content});
  }

  export function showErrorSnackBar(content: string) {
    SnackBarRef.current?.showSnackBar({type: 'error', content});
  }

  export function showWaringSnackBar(content: string) {
    SnackBarRef.current?.showSnackBar({type: 'warning', content});
  }

  export function hideSnackBar() {
    SnackBarRef.current?.hideSnackBar();
  }
}

export default GlobalHelper;
