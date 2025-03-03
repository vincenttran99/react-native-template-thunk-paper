import BButton, {IBButtonProps} from 'components/base/button.base';
import languages from 'constants/system/languages';
import {ITheme} from 'constants/system/ui/theme.constant';
import {useSystemTheme} from 'helpers/hooks/system.hook';
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import {StyleSheet} from 'react-native';
import {Dialog, DialogProps, IconButton, Portal} from 'react-native-paper';

export interface IDataDialog
  extends Omit<DialogProps, 'children' | 'visible' | 'onDismiss'> {
  title?: string;
  icon?: string;
  iconProps?: {color?: string; size?: number};
  content?: React.ReactNode;
  scrollContent?: React.ReactNode;
  negativeButton?: {
    title?: string;
    onPress?: () => void;
    props?: Omit<IBButtonProps, 'children' | 'ref' | 'onPress'>;
  };
  positiveButton?: {
    title?: string;
    onPress?: () => void;
    props?: Omit<IBButtonProps, 'children' | 'ref' | 'onPress'>;
  };
  neutralButton?: {
    title?: string;
    onPress?: () => void;
    props?: Omit<IBButtonProps, 'children' | 'ref' | 'onPress'>;
  };
  closeButton?: boolean;
}

export interface IDialogGlobalComponentRef {
  showDialog: (dialogParams: IDataDialog) => void;
}

function DialogGlobalComponent(
  _: any,
  ref: React.ForwardedRef<IDialogGlobalComponentRef>,
) {
  const {styles, theme} = useSystemTheme(createStyles);
  const [visible, setVisible] = React.useState(false);

  const dataDialogRef = useRef<IDataDialog>();
  const hideDialog = useCallback(() => setVisible(false), []);

  useImperativeHandle(
    ref,
    () => ({
      showDialog,
    }),
    [],
  );

  const showDialog = useCallback((dialogParams: IDataDialog) => {
    dataDialogRef.current = dialogParams;
    setVisible(true);
  }, []);

  const onPress = useCallback((callBack?: Function) => {
    setVisible(false);
    dataDialogRef.current = undefined;
    callBack?.();
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <Portal>
      <Dialog visible onDismiss={hideDialog} {...dataDialogRef?.current}>
        {dataDialogRef.current?.icon ? (
          <Dialog.Icon
            {...dataDialogRef.current?.iconProps}
            icon={dataDialogRef.current?.icon}
          />
        ) : null}
        {dataDialogRef.current?.title ? (
          <Dialog.Title>{dataDialogRef.current.title}</Dialog.Title>
        ) : null}
        {dataDialogRef.current?.content ? (
          <Dialog.Content>{dataDialogRef.current?.content}</Dialog.Content>
        ) : null}
        {dataDialogRef.current?.scrollContent ? (
          <Dialog.ScrollArea>
            {dataDialogRef.current?.scrollContent}
          </Dialog.ScrollArea>
        ) : null}
        <Dialog.Actions>
          <BButton
            textColor={theme.colors.error}
            {...dataDialogRef.current?.negativeButton?.props}
            onPress={() =>
              onPress(dataDialogRef.current?.negativeButton?.onPress)
            }>
            {dataDialogRef?.current?.negativeButton?.title ||
              languages.base.cancel}
          </BButton>

          {dataDialogRef?.current?.neutralButton ? (
            <BButton
              textColor={theme.colors.text}
              {...dataDialogRef.current?.neutralButton?.props}
              onPress={() =>
                onPress(dataDialogRef.current?.neutralButton?.onPress)
              }>
              {dataDialogRef?.current?.neutralButton?.title ||
                languages.base.ignore}
            </BButton>
          ) : null}

          {dataDialogRef?.current?.positiveButton ? (
            <BButton
              mode={'contained'}
              {...dataDialogRef.current?.positiveButton?.props}
              onPress={() =>
                onPress(dataDialogRef.current?.positiveButton?.onPress)
              }>
              {dataDialogRef?.current?.positiveButton?.title ||
                languages.base.confirm}
            </BButton>
          ) : null}
        </Dialog.Actions>

        {dataDialogRef.current?.closeButton ? (
          <IconButton
            onPress={() => onPress()}
            icon={'close'}
            style={styles.closeButton}
          />
        ) : null}
      </Dialog>
    </Portal>
  );
}

const createStyles = (theme: ITheme) => {
  return StyleSheet.create({
    closeButton: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
  });
};

export default memo(forwardRef(DialogGlobalComponent));
