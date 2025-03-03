import BButton from 'components/base/button.base';
import BImage from 'components/base/image.base';
import BText from 'components/base/text.base';
import {useAppSelector} from 'configs/store.config';
import {Device} from 'constants/system/device.constant';
import languages from 'constants/system/languages';
import {MHS} from 'constants/system/ui/sizes.ui.constant';
import {BStyle} from 'constants/system/ui/styles.constant';
import {ITheme} from 'constants/system/ui/theme.constant';
import {useSystemTheme} from 'helpers/hooks/system.hook';
import React, {useEffect, useMemo, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import SpInAppUpdates, {IAUUpdateKind} from 'sp-react-native-in-app-updates';
import {StartUpdateOptions} from 'sp-react-native-in-app-updates/lib/typescript/types';

export default function UpdateSystemGlobalComponent() {
  const {styles, theme} = useSystemTheme(createStyles);
  const settings = useAppSelector(state => state.system.settings);
  const maintenanceMode = useAppSelector(state => state.system.maintenanceMode);
  const [isHaveNewVersion, setIsHaveNewVersion] = useState<boolean>(false);
  const inAppUpdates = useMemo(() => new SpInAppUpdates(__DEV__), []);
  const updateOptions: StartUpdateOptions = useMemo(
    () =>
      Platform.select({
        ios: {
          title: languages.setting.aImportantUpdateVersion,
          message: languages.setting.plsUpdateVersion,
          buttonUpgradeText: languages.base.update,
          buttonCancelText: languages.base.cancel,
        },
        default: {
          updateType: IAUUpdateKind.IMMEDIATE,
        },
      }),
    [],
  );

  useEffect(() => {
    if (
      Number(settings?.mobile_app_min_build_version || 0) >
      Number(DeviceInfo.getBuildNumber())
    ) {
      inAppUpdates.checkNeedsUpdate().then(result => {
        setIsHaveNewVersion(result.shouldUpdate);
        if (
          Device.isIos &&
          settings?.maintenance_mode != '1' &&
          result.shouldUpdate
        ) {
          setTimeout(() => {
            inAppUpdates.startUpdate(updateOptions);
          }, 1000);
        }
      });
    }
  }, [settings?.mobile_app_min_build_version, settings?.maintenance_mode]);

  if (maintenanceMode) {
    return (
      <View style={styles.container}>
        <BImage
          source={require('assets/images/maintain.png')}
          style={styles.img}
        />
        <BText
          variant={'headlineSmall'}
          fontWeight={'bold'}
          color={theme.colors.secondary}>
          {languages.setting.maintain}
        </BText>
        <BText variant={'bodyLarge'}>{languages.setting.acceptLate}</BText>
      </View>
    );
  }

  if (isHaveNewVersion) {
    return (
      <View style={styles.container}>
        <BImage
          source={require('assets/images/update.png')}
          style={styles.img}
        />
        <BText
          variant={'headlineSmall'}
          fontWeight={'bold'}
          color={theme.colors.secondary}>
          {languages.setting.aImportantUpdateVersion}
        </BText>
        <BText variant={'bodyLarge'}>
          {languages.setting.plsUpdateVersion}
        </BText>
        <BButton
          onPress={() => inAppUpdates.startUpdate(updateOptions)}
          mode={'contained'}
          size={'large'}>
          {languages.base.update}
        </BButton>
      </View>
    );
  }

  return null;
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
