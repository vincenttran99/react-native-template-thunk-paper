import React from 'react';
import {TextInput} from 'react-native-paper';

interface IBTextInputProps extends React.ComponentProps<typeof TextInput> {}

/**
 * BTextInput is Base TextInput
 * @param props
 * @param ref
 * @constructor
 */
const BTextInput = React.forwardRef<TextInput, IBTextInputProps>(
  (props, ref) => {
    return (
      <TextInput
        ref={ref}
        allowFontScaling={false}
        maxFontSizeMultiplier={1}
        {...props}
      />
    );
  },
);

export default BTextInput;
