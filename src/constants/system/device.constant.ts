import {Dimensions, Platform, StatusBar} from "react-native";
import {getStatusBarHeight} from "react-native-safearea-height";
import {initialWindowMetrics} from "react-native-safe-area-context";
import DeviceInfo from "react-native-device-info";

const { width, height } = Dimensions.get("window");
const heightScreen = Dimensions.get("screen").height;
const { frame } = initialWindowMetrics || { frame: { height: height } };

const safeAreaInsetX = { top: 44, bottom: 34 };


export const Device = {
  // isHasSoftMenuBar: Platform.OS === "android" ? NativeModules.SoftMenuBarModule.checkIsSoftMenuBarDisplay() : false,
  ratio: width / heightScreen,
  width,
  height,
  insets: initialWindowMetrics?.insets,
  isWeb: Platform.OS === "web",
  isIos: Platform.OS === "ios",
  isAndroid: Platform.OS === "android",
  safeAreaInsetX,
  heightScreen,
  isTablet: DeviceInfo.isTablet(),
  heightStatusBar: Platform.OS === "ios" ? safeAreaInsetX.top : (StatusBar.currentHeight || 0),
  heightSafeWithStatus: frame.height + (Platform.OS === "ios" ? getStatusBarHeight() : (StatusBar.currentHeight || 0)),
  paddingBottom: safeAreaInsetX.bottom / 2
};
