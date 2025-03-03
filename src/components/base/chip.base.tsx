import React from 'react';
import {Chip} from 'react-native-paper';

interface IBChipProps extends React.ComponentProps<typeof Chip> {}

/**
 * BTextInput is Base TextInput
 * @param props
 * @constructor
 */
export default function BChip(props: IBChipProps): React.JSX.Element {
  return <Chip maxFontSizeMultiplier={1} {...props} />;
}
