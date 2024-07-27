import React, {forwardRef, memo, useCallback, useImperativeHandle, useRef, useState} from "react";
import {Portal, Snackbar, SnackbarProps, useTheme} from "react-native-paper";
import {ITheme} from "constants/system/ui/theme.constant";

export interface SnackBarProps extends Omit<SnackbarProps, "children" | "visible" | "onDismiss"> {
  visible?: boolean;
  onDismiss?: () => void;
  children?: React.ReactNode;
  content?: string,
  type?: "info"|"warning"|"error"|"success"
}

export interface ISnackBarGlobalComponentRef {
  showSnackBar: (snackBarProps: SnackBarProps) => void;
  hideSnackBar: Function;
}

function SnackBarGlobalComponent(_: any, ref: React.ForwardedRef<ISnackBarGlobalComponentRef>) {

  const themeSystem = useTheme() as ITheme;
  const [snackBarProps, setSnackBarProps] = useState<SnackBarProps>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  useImperativeHandle(
    ref,
    () => ({
      showSnackBar,
      hideSnackBar
    }),
    []
  );

  const showSnackBar = useCallback((props: SnackBarProps) => {
    let theme = {
      colors: {
        // inverseOnSurface: themeSystem.colors[props.type || "inverseOnSurface"],
        inverseSurface: themeSystem.colors[props.type || "inverseSurface"],
      }
    };
    switch (props?.type) {

    }

    setSnackBarProps({
      type: props.type, duration: 3000, onDismiss: () => {
      }, theme, ...props, visible: true
    });
  }, []);

  const hideSnackBar = useCallback(() => {
    setSnackBarProps(undefined);
    snackBarProps?.onDismiss?.();
  }, [snackBarProps?.onDismiss]);

  if (!snackBarProps) {
    return null;
  }

  return (
    <Portal>
      <Snackbar
        visible={true}
        {...snackBarProps}
        onDismiss={hideSnackBar}>
        {snackBarProps.children || snackBarProps.content || ""}
      </Snackbar>
    </Portal>

  );
}


export default memo(forwardRef(SnackBarGlobalComponent));
