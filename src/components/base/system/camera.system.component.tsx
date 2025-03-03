import {BottomSheetModal} from '@gorhom/bottom-sheet';
import BButton from 'components/base/button.base';
import BIconButton from 'components/base/iconButton.base';
import BImage from 'components/base/image.base';
import {Device} from 'constants/system/device.constant';
import languages from 'constants/system/languages';
import {MHS} from 'constants/system/ui/sizes.ui.constant';
import {BStyle} from 'constants/system/ui/styles.constant';
import {ITheme} from 'constants/system/ui/theme.constant';
import GlobalHelper from 'helpers/globalHelper';
import {useSystemTheme} from 'helpers/hooks/system.hook';
import React, {useImperativeHandle, useRef, useState} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {IconButton} from 'react-native-paper';
import Reanimated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import {
  CameraProps,
  PhotoFile,
  Templates,
  useCameraDevice,
  useCameraDevices,
  useCameraFormat,
  Camera as VisionCamera,
} from 'react-native-vision-camera';

const CameraSystemComponent = React.forwardRef(
  ({onSaveImagePress, ...props}: any, ref) => {
    const {styles, theme} = useSystemTheme(createStyles);
    const devices = useCameraDevices();
    const [isFrontCamera, setIsFrontCamera] = useState(true);
    const [photo, setPhoto] = useState<PhotoFile>();
    const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
    const device = isFrontCamera
      ? useCameraDevice('front', {
          physicalDevices: [
            'ultra-wide-angle-camera',
            'wide-angle-camera',
            'telephoto-camera',
          ],
        })
      : useCameraDevice('back', {
          physicalDevices: [
            'ultra-wide-angle-camera',
            'wide-angle-camera',
            'telephoto-camera',
          ],
        });
    const cameraRef = useRef<VisionCamera>(null);

    const zoom = useSharedValue(device?.neutralZoom);
    const zoomOffset = useSharedValue(0);
    const format = useCameraFormat(device, Templates.Instagram);
    const supportsVideoStabilization =
      format?.videoStabilizationModes.includes('cinematic-extended');

    const gesture = Gesture.Pinch()
      .onBegin(() => {
        zoomOffset.value = zoom.value;
      })
      .onUpdate(event => {
        const z = zoomOffset.value * event.scale;
        zoom.value = interpolate(
          z,
          [1, 10],
          [device?.minZoom, device?.maxZoom],
          Extrapolation.CLAMP,
        );
      });

    const animatedProps = useAnimatedProps<CameraProps>(
      () => ({zoom: zoom.value}),
      [zoom],
    );

    useImperativeHandle(ref, () => ({
      present: async () => {
        if (device == null) {
          GlobalHelper.showErrorSnackBar('Không tìm thấy máy ảnh');
          return;
        }

        await Keyboard.dismiss();
        bottomSheetModalRef.current?.present();
      },
      dismiss: () => {
        bottomSheetModalRef.current?.dismiss();
      },
    }));

    const toggleCamera = () => {
      setIsFrontCamera(prevState => !prevState);
    };

    const takePhoto = async () => {
      if (cameraRef.current) {
        try {
          const photo = await cameraRef.current.takePhoto();
          console.log(photo);
          setPhoto({
            ...photo,
            path: (Device?.isAndroid ? 'file://' : '') + photo?.path,
          });
        } catch (e) {
          console.error('Failed to take photo:', e);
        }
      }
    };

    const closeModal = () => {
      setPhoto(undefined);
      bottomSheetModalRef.current?.dismiss();
    };
    const onSavePress = () => {
      onSaveImagePress(photo);
      closeModal();
    };

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        enablePanDownToClose={false}
        handleIndicatorStyle={styles.headerIndicator}
        snapPoints={[Device.height - (Device.insets?.top ?? 0)]}>
        <View style={styles.closeModal}>
          <IconButton
            onPress={closeModal}
            style={styles.closeModal}
            size={MHS._32}
            iconColor={'#FFF'}
            icon={'close'}
          />
        </View>
        <View style={styles.container}>
          {photo ? (
            <View style={styles.previewContainer}>
              <BImage
                height={Device.height}
                width={Device.width}
                contentFit={'cover'}
                source={photo?.path}
              />
              <View style={styles.footerContent}>
                <BButton
                  onPress={() => setPhoto(null)}
                  mode={'contained-tonal'}>
                  {languages.system.captureAgain}
                </BButton>
                <BButton onPress={onSavePress} mode={'contained'}>
                  {languages.base.continue}
                </BButton>
              </View>
            </View>
          ) : (
            <>
              <GestureDetector gesture={gesture}>
                <ReanimatedCamera
                  ref={cameraRef}
                  style={StyleSheet.absoluteFill}
                  device={device}
                  isActive={true}
                  format={format}
                  photo={true}
                  onPreviewStarted={() => console.log('Preview started!')}
                  onPreviewStopped={() => console.log('Preview stopped!')}
                  animatedProps={animatedProps}
                />
              </GestureDetector>

              <View style={styles.controls}>
                <BIconButton
                  style={styles.leftIcon}
                  onPress={toggleCamera}
                  size={MHS._32}
                  icon={'camera-flip-outline'}
                  iconColor={theme.colors.background}
                />
                <BIconButton
                  style={styles.centerIcon}
                  onPress={takePhoto}
                  size={MHS._72}
                  icon={'circle-slice-8'}
                  iconColor={theme.colors.background}
                />
              </View>
            </>
          )}
        </View>
        <View style={styles.safeAreaBottom} />
      </BottomSheetModal>
    );
  },
);

export default CameraSystemComponent;

const createStyles = (theme: ITheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      ...BStyle.centerColumnV,
    },
    previewContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    preview: {
      ...BStyle.fullHeight,
      ...BStyle.fullWidth,
    },
    controls: {
      backgroundColor: theme.colors.shadow,
      position: 'absolute',
      bottom: 0,
      // paddingBottom:20,
      ...BStyle.centerRow,
      ...BStyle.fullWidth,
    },
    closeModal: {
      top: 0,
      position: 'absolute',
      zIndex: 2,
      left: MHS._2,
    },
    leftIcon: {
      position: 'absolute',
      left: MHS._20,
    },
    centerIcon: {
      zIndex: 1,
    },
    footerContent: {
      position: 'absolute',
      bottom: 0,
      backgroundColor: theme.colors.shadow,
      paddingHorizontal: MHS._20,
      paddingVertical: MHS._16,
      ...BStyle.centerRowVBetween,
      ...BStyle.fullWidth,
    },
    headerIndicator: {
      height: 0,
    },
    safeAreaBottom: {
      paddingBottom: Device.insets?.bottom,
      backgroundColor: theme.colors.shadow,
    },
    noDetectCamera: {
      marginHorizontal: MHS._12,
      fontWeight: 'bold',
      color: theme.colors.error,
    },
  });
};

Reanimated.addWhitelistedNativeProps({
  zoom: true,
});
const ReanimatedCamera = Reanimated.createAnimatedComponent(VisionCamera);
