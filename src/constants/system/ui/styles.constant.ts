import {MHS} from 'constants/system/ui/sizes.ui.constant';
import {StyleSheet, ViewStyle} from 'react-native';

type BaseStyles = {
  fullWidth: ViewStyle;
  fullHeight: ViewStyle;
  flex1: ViewStyle;
  center: ViewStyle;
  centerRow: ViewStyle;
  centerRowV: ViewStyle;
  centerRowVBetween: ViewStyle;
  wrapRow: ViewStyle;
  row: ViewStyle;
  centerRowVAround: ViewStyle;
  column: ViewStyle;
  centerColumnV: ViewStyle;
  centerColumnH: ViewStyle;
  centerColumnHBetween: ViewStyle;
  absoluteFullSize: ViewStyle;
  [key: string]: ViewStyle;
};

const createGapStyles = (
  baseStyles: BaseStyles,
  gaps: {label: number; value: number}[],
) => {
  // @ts-ignore
  const stylesWithGap: BaseStyles = {};
  gaps.forEach(gap => {
    for (const key in baseStyles) {
      stylesWithGap[`${key}Gap${gap.label}`] = {
        ...baseStyles[key],
        gap: gap.value,
      };
    }
  });
  return stylesWithGap;
};

const baseStyles: BaseStyles = {
  fullWidth: {
    width: '100%',
  },
  fullHeight: {
    height: '100%',
  },
  flex1: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  absoluteFullSize: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },

  /**
   * Style for row
   */
  row: {
    flexDirection: 'row',
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerRowV: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerRowVBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerRowVAround: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  /**
   * Style for column
   */
  column: {
    flexDirection: 'column',
  },
  centerColumnV: {
    justifyContent: 'center',
  },
  centerColumnHBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerColumnH: {
    alignItems: 'center',
  },
};

const gaps = [
  {label: 2, value: MHS._2},
  {label: 4, value: MHS._4},
  {label: 6, value: MHS._6},
  {label: 12, value: MHS._12},
  {label: 16, value: MHS._16},
];

const gapStyles = createGapStyles(baseStyles, gaps);

export const BStyle = StyleSheet.create({
  ...baseStyles,
  ...gapStyles,
});

// Define a type for BStyle
type BStyleType = {
  [key in keyof typeof BStyle]: ViewStyle;
};

declare module 'react-native' {
  interface BStyle extends BStyleType {}
}
