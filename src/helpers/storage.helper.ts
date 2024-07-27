import {MMKV} from 'react-native-mmkv'
import DeviceInfo from "react-native-device-info";
import {StringHelper} from "helpers/string.helper";
import Config from "react-native-config";

export const storage = new MMKV()

namespace StorageHelper{

  export function setBugOwnerId(data: string) {
    storage.set("bug.ownerid", data)
  }

  export function getBugOwnerId() {
    return storage.getString("bug.ownerid") || ""
  }

  export async function setBugDevice() {
    if (__DEV__ || !(Config.LOG_USER_BUGS_TO_FIREBASE?.toLowerCase() === "true")) return;

    let realtimeData = {
      getBuildNumber: DeviceInfo.getBuildNumber(),
      getCarrier: await DeviceInfo.getCarrier(),
      getFontScale: await DeviceInfo.getFontScale(),
      getFreeDiskStorage: Math.floor((await DeviceInfo.getFreeDiskStorage()) / 1000000) + " MB",
      getPowerState: await DeviceInfo.getPowerState(),
      getVersion: DeviceInfo.getVersion(),
      getSystemVersion: DeviceInfo.getSystemVersion(),
      getUserAgent: await DeviceInfo.getUserAgent(),
      isLandscape: await DeviceInfo.isLandscape(),
      isLocationEnabled: await DeviceInfo.isLocationEnabled(),
    }
    if (storage.contains("bug.device")) {
      storage.set("bug.device", JSON.stringify({...JSON.parse(storage.getString("bug.device") || "{}"), ...realtimeData}))
    } else {
      storage.set("bug.device", JSON.stringify({
        getApplicationName: DeviceInfo.getApplicationName(),
        getBuildId: await DeviceInfo.getBuildId(),
        getBrand: DeviceInfo.getBrand(),
        getDeviceType: DeviceInfo.getDeviceType(),
        getBundleId: DeviceInfo.getBundleId(),
        getDeviceName: await DeviceInfo.getDeviceName(),
        getFirstInstallTime: new Date(await DeviceInfo.getFirstInstallTime()).toLocaleString(),
        getInstallerPackageName: await DeviceInfo.getInstallerPackageName(),
        getDeviceId: DeviceInfo.getDeviceId(),
        getSystemName: DeviceInfo.getSystemName(),
        hasNotch: DeviceInfo.hasNotch(),
        hasDynamicIsland: DeviceInfo.hasDynamicIsland(),
        isTablet: DeviceInfo.isTablet(),
        getTotalDiskCapacity: Math.floor((await DeviceInfo.getTotalDiskCapacity()) / 1000000) + " MB",
        getTotalDiskCapacityOld: Math.floor((await DeviceInfo.getTotalDiskCapacityOld()) / 1000000) + " MB",
        getTotalMemory: Math.floor((await DeviceInfo.getTotalMemory()) / 1000000) + " MB",
        supportedAbis: await DeviceInfo.supportedAbis(),
        ...realtimeData
      }))
    }

  }

  export function getBugDevice() {
    return storage.getString("bug.device") || ""
  }

  export function setBugLog(data: string) {
    if (__DEV__ || !(Config.LOG_USER_BUGS_TO_FIREBASE?.toLowerCase() === "true")) return;
    storage.set("bug.logs", StringHelper.truncateStringForLogBugs((storage.getString("bug.logs") || "") + data, 20000))
  }

  export function clearBugLog() {
    storage.set("bug.logs", "")
  }

  export function getBugLog() {
    return storage.getString("bug.logs") || ""
  }

}

export default StorageHelper
