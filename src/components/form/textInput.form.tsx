import React, {useCallback} from "react";
import {HelperText, TextInput} from "react-native-paper";
import {Control, RegisterOptions, useController} from "react-hook-form";
import {View} from "react-native";
import {BStyle} from "constants/system/ui/styles.constant";

interface IFTextInputProps extends React.ComponentProps<typeof TextInput> {
  control: Control<any>
  name: string
  defaultValue?: string
  hint?: string
  rules?: Omit<RegisterOptions<any, string>, "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs">
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
export default function FTextInput({
                                     control,
                                     hint,
                                     rules,
                                     defaultValue = "",
                                     name,
                                     onChangeText,
                                     ...props
                                   }: IFTextInputProps): React.JSX.Element {
  const {field, fieldState, formState} = useController({
    control: control,
    defaultValue: defaultValue,
    name,
    rules
  })

  const onChangeTextOverride = useCallback((text: string) => {
    field.onChange?.(text)
    onChangeText?.(text)
  }, [field.onChange])

  return (
      <View style={BStyle.fullWidth}>
        <TextInput
            onChangeText={onChangeTextOverride}
            {...props}
            error={fieldState.invalid}
            value={field.value}
            ref={field.ref}
        />

        {
          hint ?
              <HelperText type={fieldState.invalid ? "error" : "info"} visible>{hint}</HelperText>
              :
              (
                  (rules !== undefined && fieldState.error?.message) ?
                      <HelperText type={"error"}
                                  visible={fieldState.invalid}>{fieldState.error?.message}</HelperText>
                      :
                      null
              )
        }
      </View>
  );
}
