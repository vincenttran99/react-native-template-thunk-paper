import BText from 'components/base/text.base';
import {Device} from 'constants/system/device.constant';
import languages from 'constants/system/languages';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import GlobalHelper from 'helpers/globalHelper';
import {Linking, PermissionsAndroid} from 'react-native';
import {Permission, requestMultiple, RESULTS} from 'react-native-permissions';
import {Camera} from 'react-native-vision-camera';

dayjs.extend(isBetween);

namespace PermissionHelper {
  export async function requestPermission(
    listPermission: Permission[],
  ): Promise<string> {
    return await requestMultiple(listPermission)
      .then(statuses => {
        let permissionRequestResult: Permission[] = [];
        let isBlocked: boolean = false;
        listPermission.map(item => {
          if (statuses[item] === RESULTS.DENIED)
            permissionRequestResult.push(item);
          if (statuses[item] === RESULTS.BLOCKED) isBlocked = true;
        });

        if (isBlocked) {
          return RESULTS.BLOCKED;
        } else {
          if (permissionRequestResult.length === 0) {
            return RESULTS.GRANTED;
          }
          return RESULTS.DENIED;
        }
      })
      .catch(error => {
        console.log(error);
        return RESULTS.BLOCKED;
      });
  }

  export async function getCameraPermission() {
    const cameraPermission = Camera.getCameraPermissionStatus();
    switch (cameraPermission) {
      case 'granted':
        return true;
      case 'not-determined': {
        let result = await Camera.requestCameraPermission();
        return result === 'granted';
      }
      case 'denied': {
        if (Device.isAndroid) {
          GlobalHelper.showDialog({
            title: languages.base.needPermission,
            content: <BText>{languages.base.needPermissionCamera}</BText>,
            positiveButton: {
              title: languages.base.goToSetting,
              onPress: async () => Linking.openSettings(),
            },
          });
        }
        GlobalHelper.showErrorSnackBar(languages.permission.noPermission);
        return false;
      }
      default:
    }
  }

  export async function getDownloadPermission() {
    if (Device.isIos) return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: languages.permission.downloadPermission,
          message: languages.permission.downloadPermissionDes,
          buttonNegative: languages.base.cancel,
          buttonPositive: languages.base.ok,
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        throw 'no permission';
      }
      return true;
    } catch (err) {
      console.log('err', err);
      GlobalHelper.showErrorSnackBar(languages.permission.noPermission);
      return false;
    }
  }
}

export default PermissionHelper;
