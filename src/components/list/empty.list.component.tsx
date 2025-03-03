import {SVGIconEmpty} from 'assets/svgIcon';
import BText from 'components/base/text.base';
import {Device} from 'constants/system/device.constant';
import languages from 'constants/system/languages';
import {MHS} from 'constants/system/ui/sizes.ui.constant';
import {ITheme} from 'constants/system/ui/theme.constant';
import {useSystemTheme} from 'helpers/hooks/system.hook';
import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

interface IEmptyListComponentProps {
  sizeIcon?: number;
  bigTextStyle?: React.ComponentProps<typeof BText>;
  bigText?: string;
  smallTextStyle?: React.ComponentProps<typeof BText>;
  smallText?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const EmptyListComponent = ({
  sizeIcon = MHS._100,
  bigText = 'Opps',
  smallText = languages.base.listEmpty,
  bigTextStyle,
  smallTextStyle,
  containerStyle,
}: IEmptyListComponentProps) => {
  const {styles, theme} = useSystemTheme(createStyles);

  return (
    <View style={[styles.container, containerStyle]}>
      <SVGIconEmpty size={sizeIcon} />
      <BText variant={'titleLarge'} fontWeight={'bold'} {...bigTextStyle}>
        {bigText}
      </BText>
      <BText variant={'bodyMedium'} {...smallTextStyle}>
        {smallText}
      </BText>
    </View>
  );
};
const createStyles = (theme: ITheme) => {
  return StyleSheet.create({
    container: {
      gap: MHS._12,
      height: Device.height * 0.88,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default memo(EmptyListComponent, isEqual);
