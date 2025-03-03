import {
  BottomSheetFlatList,
  BottomSheetModal,
  WINDOW_WIDTH,
} from '@gorhom/bottom-sheet';
import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import BButton from 'components/base/button.base';
import BImage from 'components/base/image.base';
import BPressable from 'components/base/pressable.base';
import CameraSystemComponent from 'components/base/system/camera.system.component';
import BText from 'components/base/text.base';
import {Device} from 'constants/system/device.constant';
import languages from 'constants/system/languages';
import {PERMISSION} from 'constants/system/system.constant';
import {HIT_SLOP_EXPAND_10, MHS} from 'constants/system/ui/sizes.ui.constant';
import {BStyle} from 'constants/system/ui/styles.constant';
import {ITheme} from 'constants/system/ui/theme.constant';
import FileHelper from 'helpers/file.helper';
import GlobalHelper from 'helpers/globalHelper';
import {useSystemTheme} from 'helpers/hooks/system.hook';
import PermissionHelper from 'helpers/permission.helper';
import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {Control, useController} from 'react-hook-form';
import {Keyboard, StyleSheet, View} from 'react-native';
import {Icon, MD3Colors} from 'react-native-paper';
import {openSettings, RESULTS} from 'react-native-permissions';
import {PhotoFile} from 'react-native-vision-camera';

const NUMBER_PHOTO_ITEMS: number = Math.round(WINDOW_WIDTH / MHS._140);
const PHOTO_ITEM_WIDTH =
  (WINDOW_WIDTH - (NUMBER_PHOTO_ITEMS - 1) * MHS._2) / NUMBER_PHOTO_ITEMS;

interface IFImageSelectProps {
  control: Control<any>;
  name: string;
  maxImage?: number;
  defaultValue?: PhotoIdentifier[];
  hint?: string;
  handleSelectedPhotos?: (selectedPhotos: PhotoIdentifier[]) => void;
  handleSubmitSelectedPhotos?: (selectedPhotos: PhotoIdentifier[]) => void;
  handlePhotoFromCamera?: (photo: PhotoFile) => void;
}

export interface IFImageSelectRef {
  present: () => void;
  dismiss: () => void;
  deleteItem: (item: PhotoIdentifier | number) => void;
}

const FImageSelect = forwardRef(
  (
    {
      handleSelectedPhotos,
      control,
      name,
      maxImage = 1,
      handleSubmitSelectedPhotos,
      defaultValue = [],
      handlePhotoFromCamera,
      ...props
    }: IFImageSelectProps,
    ref: ForwardedRef<IFImageSelectRef>,
  ) => {
    const {styles, theme} = useSystemTheme(createStyles);
    const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);
    const [loading, setLoading] = useState(false);
    const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
    const bottomSheetCameraModalRef = React.useRef<BottomSheetModal>(null);
    const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
    const {field, fieldState, formState} = useController({
      control: control,
      defaultValue: defaultValue,
      name,
    });
    const maxImageAvailable = useMemo(
      () =>
        field?.value?.reduce((total: number, item: PhotoIdentifier) => {
          if (item?.node?.type === 'camera') {
            total -= 1;
          }
          return total;
        }, 5),
      [field?.value, maxImage],
    );

    useImperativeHandle(ref, () => ({
      present: () => {
        Keyboard.dismiss();
        showModalSelect();
      },
      dismiss: () => {
        bottomSheetModalRef.current?.dismiss();
      },
      deleteItem: (item: PhotoIdentifier | number) => {
        pressPhoto(typeof item === 'number' ? field?.value?.[item] : item);
      },
    }));

    const getPhotos = async (after: string | undefined = undefined) => {
      if (loading) return;

      setLoading(true);

      try {
        const photosData = await CameraRoll.getPhotos({
          first: 20,
          assetType: 'Photos',
          after: after,
          include: ['filename'],
        });

        if (after) {
          setPhotos(prevPhotos => [...prevPhotos, ...photosData.edges]);
        } else {
          setPhotos([{node: {id: 'camera'}}, ...photosData.edges]);
        }
        setEndCursor(photosData.page_info.end_cursor);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const loadMorePhotos = () => {
      if (endCursor) {
        getPhotos(endCursor);
      }
    };

    const showCamera = React.useCallback(async () => {
      await bottomSheetCameraModalRef.current?.present();
    }, []);

    const onSaveImagePress = () => {
      handleSubmitSelectedPhotos?.(field?.value || []);
      bottomSheetModalRef.current?.dismiss();
    };

    const pressPhoto = (photo: PhotoIdentifier) => {
      console.log(photo, 'photo');
      if (maxImageAvailable > 1) {
        const indexOfPhoto = field?.value?.findIndex(
          (selected: PhotoIdentifier) =>
            selected?.node?.image?.uri === photo?.node?.image?.uri,
        );
        if (indexOfPhoto !== -1) {
          let newArr = [...field?.value];
          newArr.splice(indexOfPhoto, 1);
          handleSelectedPhotos?.(newArr);
          field.onChange(newArr);
        } else {
          handleSelectedPhotos?.([...(field?.value || []), photo]);
          field?.onChange([...(field?.value || []), photo]);
        }
      } else {
        handleSelectedPhotos?.([photo]);
        field?.onChange([photo]);
        bottomSheetModalRef.current?.dismiss();
      }
    };

    const onSaveImageCameraPress = (photo: PhotoFile) => {
      handlePhotoFromCamera?.(photo);
      let objectPhotoIdentifier =
        FileHelper.convertPhotoFileToIdentifier(photo);
      if (objectPhotoIdentifier) {
        handleSubmitSelectedPhotos?.([
          ...(field?.value || []),
          objectPhotoIdentifier,
        ]);
        field?.onChange?.([...(field?.value || []), objectPhotoIdentifier]);
        bottomSheetModalRef.current?.dismiss();
      }
    };

    const renderItem = ({
      item,
      index,
    }: {
      item: PhotoIdentifier;
      index: number;
    }) => {
      if (item?.node?.id === 'camera') {
        return (
          <BPressable
            onPress={showCamera}
            style={{
              marginEnd: index + (1 % NUMBER_PHOTO_ITEMS) === 0 ? 0 : MHS._2,
            }}>
            <View style={styles.cameraItem}>
              <Icon size={MHS._48} source={'camera-outline'} />
            </View>
          </BPressable>
        );
      }

      const isSelected = field?.value?.some(
        (photo: PhotoIdentifier) =>
          photo?.node?.image?.uri === item?.node?.image?.uri,
      );
      const selectedPhotoFromLibrary = field?.value?.filter(
        (photo: PhotoIdentifier) => photo?.node?.type !== 'camera',
      );
      const selectedIndex = isSelected
        ? selectedPhotoFromLibrary.findIndex(
            (photo: PhotoIdentifier) =>
              photo?.node?.image?.uri === item?.node?.image?.uri,
          ) + 1
        : null;
      return (
        <BPressable
          onPress={() => pressPhoto(item)}
          disabled={
            selectedPhotoFromLibrary?.length >= maxImageAvailable && !isSelected
          }
          style={{
            marginEnd: index + (1 % NUMBER_PHOTO_ITEMS) === 0 ? 0 : MHS._2,
          }}>
          <BImage
            width={PHOTO_ITEM_WIDTH}
            source={{uri: item?.node?.image?.uri}}
          />

          {maxImageAvailable > 1 &&
            (selectedPhotoFromLibrary?.length < maxImageAvailable ||
              isSelected) && (
              <View
                style={[
                  styles.selectedOverlay,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.primary
                      : theme.colors.text,
                  },
                ]}>
                <View style={styles.circle}>
                  <BText
                    fontWeight={'600'}
                    variant={'labelMedium'}
                    color={MD3Colors.tertiary100}>
                    {selectedIndex}
                  </BText>
                </View>
              </View>
            )}
        </BPressable>
      );
    };

    const ItemSeparatorComponent = React.useCallback(
      () => <View style={styles.separator} />,
      [],
    );

    const showModalSelect = useCallback(async () => {
      const permission = await PermissionHelper.requestPermission([
        ...PERMISSION.permissionLibrary,
        ...PERMISSION.permissionCamera,
      ]);

      if (permission === RESULTS.BLOCKED) {
        GlobalHelper.showDialog({
          title: languages.permission.permissionLibraryDenied,
          content: <BText>{languages.permission.openSettingToGrant}</BText>,
          negativeButton: {
            title: languages.base.cancel,
          },
          positiveButton: {
            title: languages.base.goToSetting,
            onPress: async () =>
              await openSettings().catch(() =>
                console.warn('cannot open settings'),
              ),
          },
        });
        return;
      }

      if (permission !== RESULTS.GRANTED) {
        return;
      }

      if ((photos?.length || 0) <= 0) {
        await getPhotos();
      }

      bottomSheetModalRef.current?.present();
    }, []);

    return (
      <View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          enablePanDownToClose={false}
          enableDynamicSizing={false}
          handleIndicatorStyle={styles.headerIndicator}
          snapPoints={[Device.height - (Device.insets?.top ?? 0)]}>
          <View style={styles.header}>
            <BText variant={'titleLarge'}>{languages.base.choosePhotos}</BText>
            <BButton
              hitSlop={HIT_SLOP_EXPAND_10}
              noMarginLabel
              onPress={onSaveImagePress}>
              {languages.base.close}
            </BButton>
          </View>
          <BottomSheetFlatList
            numColumns={NUMBER_PHOTO_ITEMS}
            data={photos}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorComponent}
            renderItem={renderItem}
            onEndReached={loadMorePhotos}
            onEndReachedThreshold={0.5}
          />
          {maxImageAvailable > 1 && (
            <View style={styles.footer}>
              <BText variant={'titleMedium'} fontWeight={'600'}>
                {languages.system.imagesSelected.replace(
                  '{count}',
                  String(field?.value?.length),
                )}
              </BText>
              <BButton mode={'contained'} onPress={onSaveImagePress}>
                {languages.base.continue}
              </BButton>
            </View>
          )}
        </BottomSheetModal>
        <CameraSystemComponent
          onSaveImagePress={onSaveImageCameraPress}
          ref={bottomSheetCameraModalRef}
        />
      </View>
    );
  },
);

export default FImageSelect;

const createStyles = (theme: ITheme) => {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: MHS._16,
      paddingHorizontal: MHS._16,
    },
    btnHeaderLeft: {
      flex: 1,
      alignItems: 'flex-start',
    },
    btnHeaderRight: {
      flex: 1,
      alignItems: 'flex-end',
    },
    separator: {
      height: MHS._2,
    },
    selectedOverlay: {
      position: 'absolute',
      top: MHS._4,
      right: MHS._4,
      borderRadius: MHS._24,
      width: MHS._24,
      height: MHS._24,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    },
    circle: {
      borderColor: MD3Colors.tertiary100,
      borderWidth: MHS._2,
      borderRadius: MHS._24,
      width: MHS._24,
      height: MHS._24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    footer: {
      paddingHorizontal: MHS._16,
      paddingTop: MHS._16,
      paddingBottom: MHS._32,
      ...BStyle.centerRowVBetween,
      backgroundColor: theme.colors.primaryContainer,
    },
    headerIndicator: {
      height: 0,
    },
    cameraItem: {
      width: PHOTO_ITEM_WIDTH,
      height: PHOTO_ITEM_WIDTH,
      ...BStyle.centerColumnH,
      justifyContent: 'center',
      backgroundColor: theme.colors.backdrop,
    },
  });
};
