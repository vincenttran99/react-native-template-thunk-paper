import {Device} from 'constants/system/device.constant';
import languages from 'constants/system/languages';
import {ITheme} from 'constants/system/ui/theme.constant';
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import isEqual from 'react-fast-compare';
import {Portal, Snackbar, SnackbarProps, useTheme} from 'react-native-paper';

export interface SnackBarProps
  extends Omit<SnackbarProps, 'children' | 'visible' | 'onDismiss'> {
  visible?: boolean;
  onDismiss?: () => void;
  children?: React.ReactNode;
  content?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
}

export interface ISnackBarGlobalComponentRef {
  showSnackBar: (snackBarProps: SnackBarProps) => void;
  hideSnackBar: Function;
}

function SnackBarGlobalComponent(
  _: any,
  ref: React.ForwardedRef<ISnackBarGlobalComponentRef>,
) {
  const themeSystem = useTheme() as ITheme;
  const [snackBarProps, setSnackBarProps] = useState<SnackBarProps>();
  const oldSnackBarPropsRef = useRef<SnackBarProps>();

  useImperativeHandle(
    ref,
    () => ({
      showSnackBar,
      hideSnackBar,
    }),
    [],
  );

  const showSnackBar = useCallback((props: SnackBarProps) => {
    let theme = {
      colors: {
        inverseSurface: themeSystem.colors[props.type || 'inverseSurface'],
      },
    };

    if (isEqual(oldSnackBarPropsRef.current, props)) {
      return;
    } else {
      oldSnackBarPropsRef.current = props;
    }

    setSnackBarProps({
      type: 'info',
      duration: 3000,
      onDismiss: () => {},
      action: {
        textColor: '#fff',
        labelStyle: {fontWeight: 'bold'},
        label: languages.base.hide,
      },
      theme,
      ...props,
      wrapperStyle: [
        {top: (Device.insets?.top || 0) * 1.1},
        props.wrapperStyle,
      ],
      visible: true,
    });
  }, []);

  const hideSnackBar = useCallback(() => {
    oldSnackBarPropsRef.current = undefined;
    setSnackBarProps(undefined);
    snackBarProps?.onDismiss?.();
  }, [snackBarProps?.onDismiss]);

  if (!snackBarProps) {
    return null;
  }

  return (
    <Portal>
      <Snackbar visible {...snackBarProps} onDismiss={hideSnackBar}>
        {snackBarProps.children || snackBarProps.content || ''}
      </Snackbar>
    </Portal>
  );
}

export default memo(forwardRef(SnackBarGlobalComponent));
