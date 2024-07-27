// import analytics from "@react-native-firebase/analytics";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import DeviceInfo from "react-native-device-info";
// import { MMKV } from "react-native-mmkv";
import {Device} from "constants/system/device.constant";

// const storage = new MMKV();
dayjs.extend(isBetween);

namespace SystemHelper{

  /**
   * Copy from
   * https://github.com/nirsky/react-native-size-matters
   */
  const [shortDimension, longDimension] = Device.width > Device.height ? [Device.height, Device.width] : [Device.width, Device.height];
  const guidelineBaseWidth = 350;
  const guidelineBaseHeight = 680;

  /**
   * horizontalScale
   * @param size
   * Scale by screen horizontal ratio for size compensation
   */
  export function horizontalScale(size: number) {
    return size * shortDimension / guidelineBaseWidth;
  }

  /**
   * verticalScale
   * @param size
   * Scale by screen vertical ratio for size compensation
   */
  export function verticalScale(size: number) {
    return size * longDimension / guidelineBaseHeight;
  }

  /**
   * moderateHorizontalScale
   * @param size
   * @param factor
   * Scale by screen horizontal ratio with factor for size compensation. Default factor is 0.5.
   */
  export function moderateHorizontalScale(size: number, factor = 0.5) {
    return size + (horizontalScale(size) - size) * factor;
  }

  /**
   * moderateVerticalScale
   * @param size
   * @param factor
   * Scale by screen vertical ratio with factor for size compensation. Default factor is 0.5.
   */
  export function moderateVerticalScale(size: number, factor = 0.5) {
    return size + (verticalScale(size) - size) * factor;
  }

  /**
   * Short name
   */
  export const hs = horizontalScale;
  export const vs = verticalScale;
  export const mhs = moderateHorizontalScale;
  export const mvs = moderateVerticalScale;



  export const checkVersion = (version: string) => {
    if (!version) {
      return false;
    }
    if (Device.isAndroid) {
      return Number(DeviceInfo.getBuildNumber()) < Number(version);
    }
    const arrayCurrent = DeviceInfo.getVersion().split(".");
    const arrayVersion = version.split(".");

    let index = 0;
    for (let i = 0; i < arrayCurrent.length; i++) {
      const element = arrayCurrent[i];
      if (Number(element) >= Number(arrayVersion?.[i])) {
        index++;
      }
    }
    if (index === arrayCurrent.length) {
      return false;
    }
    return true;
  };


  export const checkVersionNeedUpdate = (versionUpdate: string) => {
    // if (checkVersion(versionUpdate)) {
    //   GlobalPopupHelper.alertRef.current?.alertHelper({
    //     title: languages.updateAvailable,
    //     message: languages.updateAvailableDes,
    //     iconClose: false,
    //     actions: [{
    //       text: languages.cancel,
    //       onPress: RNExitApp.exitApp
    //     }, {
    //       text: languages.confirm,
    //       active: true,
    //       onPress: () => {
    //         Linking.openURL(Platform.select({
    //           ios: `itms-apps://apps.apple.com/us/app/gamifa/id${Config.APP_ID_IOS}`,
    //           default: `https://play.google.com/store/apps/details?id=${Config.APP_ID}`
    //         })).then(() => {
    //           setTimeout(() => {
    //             RNExitApp.exitApp();
    //           }, 300);
    //         }).catch(console.log);
    //       }
    //     }]
    //   });
    // } else {
    //   console.log("KOOooooooÖ Can phai update version " + Platform.OS, versionUpdate);
    // }
  };

  export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default SystemHelper
