import BButton from 'components/base/button.base';
import BText from 'components/base/text.base';
import {Device} from 'constants/system/device.constant';
import {MHS} from 'constants/system/ui/sizes.ui.constant';
import {BStyle} from 'constants/system/ui/styles.constant';
import {ITheme} from 'constants/system/ui/theme.constant';
import {useSystemTheme} from 'helpers/hooks/system.hook';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon} from 'react-native-paper';

export default function ErrorSystemGlobalComponent({
  resetError,
}: {
  resetError: Function;
}) {
  const {styles, theme} = useSystemTheme(createStyles);

  return (
    <View style={styles.container}>
      <Icon source={'alert'} color={theme.colors.warning} size={MHS._120} />
      <BText
        variant={'headlineSmall'}
        fontWeight={'bold'}
        color={theme.colors.secondary}>
        {'Có lỗi bất ngờ phát sinh'}
      </BText>
      <BButton onPress={resetError} mode={'contained'} size={'large'}>
        {'Khởi động lại ứng dụng'}
      </BButton>
    </View>
  );
}

const createStyles = (theme: ITheme) => {
  return StyleSheet.create({
    container: {
      ...BStyle.absoluteFullSize,
      backgroundColor: theme.colors.background,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: MHS._12,
    },
    img: {
      width: Device.width * 0.4,
      height: Device.width * 0.4,
    },
  });
};
