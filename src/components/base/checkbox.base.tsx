import {FontSize, MHS} from 'constants/system/ui/sizes.ui.constant';
import {ITheme} from 'constants/system/ui/theme.constant';
import {useSystemTheme} from 'helpers/hooks/system.hook';
import React from 'react';
import {
  Insets,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {Icon} from 'react-native-paper';

interface IBCheckBoxProps {
  activeColor?: string;
  inactiveColor?: string;
  style?: StyleProp<ViewStyle>;
  size?: 'tiny' | 'small' | 'medium' | 'big' | 'large';
  isChecked: boolean;
  onPress?: () => void;
  disabled?: boolean;
  hitSlop?: number | Insets | null;
}

const SIZE_CHECKBOX = {
  tiny: MHS._18,
  small: MHS._20,
  medium: MHS._22,
  big: MHS._24,
  large: MHS._28,
};

const SIZE_CHECKBOX_ICON = {
  tiny: FontSize._16,
  small: FontSize._17,
  medium: FontSize._18,
  big: FontSize._19,
  large: FontSize._20,
};

const BCheckBox = (
  {
    activeColor,
    inactiveColor,
    size = 'medium',
    isChecked,
    onPress,
    style,
    hitSlop,
    disabled = false,
  }: IBCheckBoxProps,
  _: any,
): React.JSX.Element => {
  const {styles, theme} = useSystemTheme(createStyles);
  return (
    <Pressable
      hitSlop={hitSlop}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.container,
        {
          opacity: disabled ? 0.5 : 1,
          width: SIZE_CHECKBOX[size],
          height: SIZE_CHECKBOX[size],
          borderColor: isChecked
            ? activeColor || theme.colors.primary
            : inactiveColor || theme.colors.primary,
          backgroundColor: isChecked
            ? activeColor || theme.colors.primary
            : 'transparent',
        },
        style,
      ]}>
      <Icon
        size={SIZE_CHECKBOX_ICON[size]}
        source={'check'}
        color={isChecked ? theme.colors.background : 'transparent'}
      />
    </Pressable>
  );
};

const createStyles = (theme: ITheme) => {
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: MHS._4,
      borderWidth: 1,
    },
  });
};

export default BCheckBox;
