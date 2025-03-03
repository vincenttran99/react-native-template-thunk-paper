import {Device} from 'constants/system/device.constant';
import {Platform} from 'react-native';
import {PERMISSIONS} from 'react-native-permissions';

export enum ESystemStatus {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Success = 'success',
}

export enum IThemeType {
  Light,
  ExactDark,
  AdaptiveDark,
}

export const PERMISSION = {
  permissionVideoCall: Device.isIos
    ? [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE]
    : [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.RECORD_AUDIO],
  permissionMedia: Device.isIos
    ? [
        PERMISSIONS.IOS.CAMERA,
        PERMISSIONS.IOS.MICROPHONE,
        PERMISSIONS.IOS.PHOTO_LIBRARY,
      ]
    : Number(Platform.Version) >= 33
    ? [
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
        PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
      ]
    : [
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ],
  permissionRecord: Device.isIos
    ? [PERMISSIONS.IOS.MICROPHONE]
    : Number(Platform.Version) >= 33
    ? [PERMISSIONS.ANDROID.RECORD_AUDIO, PERMISSIONS.ANDROID.READ_MEDIA_AUDIO]
    : [
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ],
  permissionLibrary: Device.isIos
    ? [PERMISSIONS.IOS.PHOTO_LIBRARY]
    : Number(Platform.Version) >= 33
    ? [
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      ]
    : [
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ],
  permissionDownload:
    Number(Platform.Version) >= 33
      ? [
          PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
          PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
        ]
      : Number(Platform.Version) >= 23
      ? [
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ]
      : [],
  permissionCamera: Device.isIos
    ? [PERMISSIONS.IOS.CAMERA]
    : [PERMISSIONS.ANDROID.CAMERA],
  permissionCall: Device.isIos
    ? []
    : [PERMISSIONS.ANDROID.POST_NOTIFICATIONS, PERMISSIONS.ANDROID.CALL_PHONE],
};

export const GLOBAL_HTML_TAG_STYLE = {
  img: {
    alignSelf: 'center',
    objectFit: 'contain',
  },
};

export const ERROR_CODE_IGNORE = ['example'];
