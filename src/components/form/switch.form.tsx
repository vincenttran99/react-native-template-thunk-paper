import {BStyle} from 'constants/system/ui/styles.constant';
import React, {useCallback} from 'react';
import {Control, RegisterOptions, useController} from 'react-hook-form';
import {StyleProp, View, ViewStyle} from 'react-native';
import {HelperText, Switch} from 'react-native-paper';

interface IFSwitchProps extends React.ComponentProps<typeof Switch> {
  control: Control<any>;
  name: string;
  defaultValue?: boolean;
  hint?: string;
  containerStyle?: StyleProp<ViewStyle>;
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
export default function FSwitch({
  control,
  hint,
  rules,
  defaultValue = true,
  name,
  onValueChange,
  style,
  containerStyle = {},
  ...props
}: IFSwitchProps): React.JSX.Element {
  const {field, fieldState, formState} = useController({
    control: control,
    defaultValue: defaultValue,
    name,
    rules,
  });

  const onValueChangeSwitch = useCallback(
    (value: boolean) => {
      field.onChange?.(value);
      onValueChange?.(value);
    },
    [field.onChange],
  );

  return (
    <View style={[BStyle.fullWidth, containerStyle]}>
      <Switch
        value={field.value}
        onValueChange={onValueChangeSwitch}
        {...props}
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
}
