import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useNetInfo} from '@react-native-community/netinfo';
import BText from 'components/base/text.base';
import {useAppDispatch} from 'configs/store.config';
import {Device} from 'constants/system/device.constant';
import languages from 'constants/system/languages';
import {MHS} from 'constants/system/ui/sizes.ui.constant';
import {ITheme} from 'constants/system/ui/theme.constant';
import GlobalHelper from 'helpers/globalHelper';
import {useSystemTheme} from 'helpers/hooks/system.hook';
import LottieView from 'lottie-react-native';
import React, {useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {setIsConnected} from 'store/reducers/system.reducer.store';

const SNAP_POINT = ['100%'];

export default function ModalNetworkGlobalComponent() {
  const {styles, theme} = useSystemTheme(createStyles);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const netInfo = useNetInfo();
  const refPreState = useRef<boolean | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setIsConnected(netInfo.isConnected !== null ? netInfo.isConnected : true),
    );
    if (netInfo.isConnected === true && refPreState.current === false) {
      GlobalHelper.showSuccessSnackBar(languages.network.reconnected);
      bottomSheetRef.current?.close();
    }

    if (netInfo.isConnected === false) {
      bottomSheetRef.current?.present();
    }
    refPreState.current = netInfo.isConnected;
  }, [netInfo.isConnected]);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={SNAP_POINT}
      animateOnMount
      enableDynamicSizing={false}
      enablePanDownToClose>
      <View style={styles.containerModalBlock}>
        <LottieView
          source={require('assets/lotties/disconnected.json')}
          autoPlay
          loop
          style={styles.img}
        />
        <BText
          variant={'headlineSmall'}
          fontWeight={'bold'}
          color={theme.colors.secondary}>
          {languages.network.disconnected}
        </BText>
        <BText variant={'bodyLarge'}>{languages.network.plsTryReconnect}</BText>
      </View>
    </BottomSheetModal>
  );
}

const createStyles = (theme: ITheme) => {
  return StyleSheet.create({
    img: {
      width: Device.width * 0.4,
      height: Device.width * 0.4,
    },
    containerModalBlock: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: MHS._12,
    },
  });
};
