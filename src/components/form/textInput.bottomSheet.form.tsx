import {useBottomSheetInternal} from '@gorhom/bottom-sheet';
import {BStyle} from 'constants/system/ui/styles.constant';
import React, {forwardRef, useCallback, useEffect} from 'react';
import {Control, RegisterOptions, useController} from 'react-hook-form';
import {StyleProp, View, ViewStyle} from 'react-native';
import {HelperText, TextInput} from 'react-native-paper';

interface IFTextInputProps extends React.ComponentProps<typeof TextInput> {
  control: Control<any>;
  name: string;
  defaultValue?: string;
  containerStyle?: StyleProp<ViewStyle>;
  hint?: string;
  rules?: Omit<
    RegisterOptions<any, string>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
}

/**
 * FTextInput is Form TextInput
 * @param control
 * @param info
 * @param rules
 * @param defaultValue
 * @param name
 * @param onChangeText
 * @param props
 * @constructor
 */
const FTextInputBottomSheet = forwardRef(
  (
    {
      control,
      hint,
      rules,
      defaultValue = '',
      name,
      containerStyle = {},
      onChangeText,
      style,
      onFocus,
      onBlur,
      ...props
    }: IFTextInputProps,
    ref,
  ): React.JSX.Element => {
    const {field, fieldState, formState} = useController({
      control: control,
      defaultValue: defaultValue,
      name,
      rules,
    });
    const {shouldHandleKeyboardEvents} = useBottomSheetInternal();

    useEffect(() => {
      return () => {
        // Reset the flag on unmount
        shouldHandleKeyboardEvents.value = false;
      };
    }, [shouldHandleKeyboardEvents]);
    //#endregion

    //#region callbacks
    const handleOnFocus = useCallback(
      (args: any) => {
        shouldHandleKeyboardEvents.value = true;
        if (onFocus) {
          onFocus?.(args);
        }
      },
      [onFocus, shouldHandleKeyboardEvents],
    );
    const handleOnBlur = useCallback(
      (args: any) => {
        shouldHandleKeyboardEvents.value = false;
        if (onBlur) {
          onBlur?.(args);
        }
      },
      [onBlur, shouldHandleKeyboardEvents],
    );
    //#endregion

    const onChangeTextOverride = useCallback(
      (text: string) => {
        field.onChange?.(text);
        onChangeText?.(text);
      },
      [field.onChange],
    );

    return (
      <View style={[BStyle.fullWidth, containerStyle]}>
        <TextInput
          mode={'outlined'}
          onChangeText={onChangeTextOverride}
          allowFontScaling={false}
          maxFontSizeMultiplier={1}
          {...props}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          style={[style, {textAlign: 'auto'}]}
          error={fieldState.invalid}
          value={field.value}
          ref={field.ref}
        />

        {hint ? (
          <HelperText type={fieldState.invalid ? 'error' : 'info'} visible>
            {hint}
          </HelperText>
        ) : rules !== undefined && fieldState.error?.message ? (
          <HelperText type={'error'} visible={fieldState.invalid}>
            {fieldState.error?.message}
          </HelperText>
        ) : null}
      </View>
    );
  },
);

export default FTextInputBottomSheet;
