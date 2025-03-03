import {MHS} from 'constants/system/ui/sizes.ui.constant';
import {useSystemTheme} from 'helpers/hooks/system.hook';
import React from 'react';
import {
  Insets,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {MD3Colors} from 'react-native-paper';

interface IBRadioButtonProps {
  activeColor?: string;
  inactiveColor?: string;
  style?: StyleProp<ViewStyle>;
  size?: 'tiny' | 'small' | 'medium' | 'big' | 'large';
  isSelected: boolean;
  onPress?: () => void;
  disabled?: boolean;
  hitSlop?: number | Insets | null;
}

const SIZE_RADIO = {
  tiny: MHS._18,
  small: MHS._20,
  medium: MHS._22,
  big: MHS._24,
  large: MHS._28,
};

const BRadioButton = (
  {
    activeColor,
    inactiveColor,
    size = 'medium',
    isSelected,
    onPress,
    style,
    hitSlop,
    disabled = false,
  }: IBRadioButtonProps,
  _: any,
): React.JSX.Element => {
  const {theme} = useSystemTheme();
  return (
    <TouchableOpacity
      hitSlop={hitSlop}
      disabled={disabled}
      onPress={onPress}
      style={[
        {
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: MHS._2,
          borderRadius: 1000,
          opacity: disabled ? 0.5 : 1,
          width: SIZE_RADIO[size],
          height: SIZE_RADIO[size],
          borderColor: isSelected
            ? activeColor || theme.colors.primary
            : inactiveColor || MD3Colors.neutral80,
        },
        style,
      ]}>
      <View
        style={{
          backgroundColor: isSelected
            ? activeColor || theme.colors.primary
            : 'transparent',
          width: '70%',
          height: '70%',
          borderRadius: 1000,
        }}
      />
    </TouchableOpacity>
  );
};

export default BRadioButton;
