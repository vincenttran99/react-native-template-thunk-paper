import {MHS} from 'constants/system/ui/sizes.ui.constant';
import {useSystemTheme} from 'helpers/hooks/system.hook';
import React, {forwardRef, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Divider} from 'react-native-paper';
import Animated from 'react-native-reanimated';

interface IBDividerProps extends React.ComponentProps<typeof Divider> {
  type?: 'solid' | 'dotted' | 'dashed';
  vertical?: boolean;
}

const BDivider = (
  {type = 'solid', style, bold, vertical = false, ...props}: IBDividerProps,
  _: any,
): React.JSX.Element => {
  const {theme} = useSystemTheme();
  const styleBase = useMemo(
    () => ({
      height: !vertical
        ? Number(
            StyleSheet.flatten(style || {})?.height ||
              (bold ? MHS._1 : StyleSheet.hairlineWidth),
          )
        : undefined,
      // flexGrow: 1,
      width: vertical
        ? Number(
            StyleSheet.flatten(style || {})?.width ||
              (bold ? MHS._1 : StyleSheet.hairlineWidth),
          )
        : undefined,
      backgroundColor:
        StyleSheet.flatten(style || {})?.backgroundColor ||
        theme.colors.outlineVariant,
    }),
    [style, type, bold, vertical],
  );

  const styleDashOrDot = useMemo(
    () => ({
      borderStyle: type,
      borderColor:
        StyleSheet.flatten(style || {})?.backgroundColor ||
        theme.colors.outlineVariant,
      ...(vertical
        ? {
            borderWidth: Number(
              StyleSheet.flatten(style || {})?.width ||
                (bold ? MHS._1 : StyleSheet.hairlineWidth),
            ),
            marginHorizontal: -Number(
              StyleSheet.flatten(style || {})?.width ||
                (bold ? MHS._1 : StyleSheet.hairlineWidth),
            ),
            marginLeft: 0,
            // flexGrow: 1,
            width: 0,
            backgroundColor: '#00000000',
          }
        : {
            borderWidth: Number(
              StyleSheet.flatten(style || {})?.height ||
                (bold ? MHS._1 : StyleSheet.hairlineWidth),
            ),
            marginVertical: -Number(
              StyleSheet.flatten(style || {})?.height ||
                (bold ? MHS._1 : StyleSheet.hairlineWidth),
            ),
            marginTop: 0,
            height: 0,
            backgroundColor: '#00000000',
          }),
    }),
    [style, type, bold, vertical],
  );

  return (
    <View style={{overflow: 'hidden'}}>
      <View
        {...props}
        style={[style, type === 'solid' ? styleBase : styleDashOrDot]}
      />
    </View>
  );
};

export const BDividerAni = Animated.createAnimatedComponent(
  forwardRef(BDivider),
);
export default BDivider;
