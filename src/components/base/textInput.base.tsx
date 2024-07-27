import React from "react";
import {TextInput} from "react-native-paper";

interface IBTextInputProps extends React.ComponentProps<typeof TextInput> {

}

/**
 * BTextInput is Base TextInput
 * @param props
 * @constructor
 */
export default function BTextInput(props: IBTextInputProps): React.JSX.Element {
  return <TextInput {...props} />;
}
