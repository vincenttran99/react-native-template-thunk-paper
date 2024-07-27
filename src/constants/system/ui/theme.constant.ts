import {adaptNavigationTheme, configureFonts, MD3DarkTheme, MD3LightTheme, MD3Theme} from "react-native-paper";
import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
    Theme
} from "@react-navigation/native";
import {IThemeType} from "constants/system/system.constant";
import SystemHelper from "helpers/system.helper";
import mhs = SystemHelper.mhs;
import mvs = SystemHelper.mvs;

const fontConfig = {
  "displaySmall": {
    "fontSize": mhs(36,0.3),
    "letterSpacing": mhs(0,0.3),
    "lineHeight": mvs(44,0.1),
  },
  "displayMedium": {
    "fontSize": mhs(45,0.3),
    "letterSpacing": mhs(0,0.3),
    "lineHeight": mvs(52,0.1),
  },
  "displayLarge": {
    "fontSize": mhs(57,0.3),
    "letterSpacing": mhs(0,0.3),
    "lineHeight": mvs(64,0.1),
  },
  "headlineSmall": {
    "fontSize": mhs(24,0.3),
    "letterSpacing": mhs(0,0.3),
    "lineHeight": mvs(32,0.1),
  },
  "headlineMedium": {
    "fontSize": mhs(28,0.3),
    "letterSpacing": mhs(0,0.3),
    "lineHeight": mvs(36,0.1),
  },
  "headlineLarge": {
    "fontSize": mhs(32,0.3),
    "letterSpacing": mhs(0,0.3),
    "lineHeight": mvs(40,0.1),
  },
  "titleSmall": {
    "fontSize": mhs(14,0.3),
    "letterSpacing": mhs(0.1,0.3),
    "lineHeight": mvs(20,0.1),
  },
  "titleMedium": {
    "fontSize": mhs(16,0.3),
    "letterSpacing": mhs(0.15,0.3),
    "lineHeight": mvs(24,0.1),
  },
  "titleLarge": {
    "fontSize": mhs(22,0.3),
    "letterSpacing": mhs(0,0.3),
    "lineHeight": mvs(28,0.1),
  },
  "labelSmall": {
    "fontSize": mhs(11,0.3),
    "letterSpacing": mhs(0.5,0.3),
    "lineHeight": mvs(16,0.1),
  },
  "labelMedium": {
    "fontSize": mhs(12,0.3),
    "letterSpacing": mhs(0.5,0.3),
    "lineHeight": mvs(16,0.1),
  },
  "labelLarge": {
    "fontSize": mhs(14,0.3),
    "letterSpacing": mhs(0.1,0.3),
    "lineHeight": mvs(20,0.1),
  },
  "bodyNano": {
    "fontSize": mhs(6,0.3),
    "letterSpacing": mhs(0.4,0.3),
    "lineHeight": mvs(7,0.1),
  },
  "bodyMicro": {
    "fontSize": mhs(8,0.3),
    "letterSpacing": mhs(0.4,0.3),
    "lineHeight": mvs(10,0.1),
  },
  "bodyTiny": {
    "fontSize": mhs(10,0.3),
    "letterSpacing": mhs(0.4,0.3),
    "lineHeight": mvs(13,0.1),
  },
  "bodySmall": {
    "fontSize": mhs(12,0.3),
    "letterSpacing": mhs(0.4,0.3),
    "lineHeight": mvs(16,0.1),
  },
  "bodyMedium": {
    "fontSize": mhs(14,0.3),
    "letterSpacing": mhs(0.25,0.3),
    "lineHeight": mvs(20,0.1),
  },
  "bodyLarge": {
    "fontSize": mhs(16,0.3),
    "letterSpacing": mhs(0.15,0.3),
    "lineHeight": mvs(24,0.1),
  }
};

const {LightTheme, DarkTheme} = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme
});

export interface ITheme extends MD3Theme, Theme {
  colors: MD3Theme["colors"] & Theme["colors"] & {
    success: string,
    onSuccess: string,
    successContainer: string,
    onSuccessContainer: string,
    warning: string,
    onWarning: string,
    warningContainer: string,
    onWarningContainer: string,
    info: string,
    onInfo: string,
    infoContainer: string,
    onInfoContainer: string,
  }
}

/**
 * get colors set in https://callstack.github.io/react-native-paper/docs/guides/theming
 */

export const THEME: {
  [IThemeType.Light]: ITheme,
  [IThemeType.ExactDark]: ITheme,
  [IThemeType.AdaptiveDark]: ITheme,
} = {
  [IThemeType.Light]: {
    ...MD3LightTheme,
    ...LightTheme,
    fonts: configureFonts({config: fontConfig}),
    colors: {
      ...MD3LightTheme.colors,
      ...LightTheme.colors,
      "primary": "rgb(122, 89, 0)",
      "onPrimary": "rgb(255, 255, 255)",
      "primaryContainer": "rgb(255, 222, 162)",
      "onPrimaryContainer": "rgb(38, 25, 0)",
      "secondary": "rgb(182, 33, 42)",
      "onSecondary": "rgb(255, 255, 255)",
      "secondaryContainer": "rgb(255, 218, 215)",
      "onSecondaryContainer": "rgb(65, 0, 5)",
      "tertiary": "rgb(111, 93, 0)",
      "onTertiary": "rgb(255, 255, 255)",
      "tertiaryContainer": "rgb(255, 225, 107)",
      "onTertiaryContainer": "rgb(34, 27, 0)",
      "error": "rgb(186, 26, 26)",
      "onError": "rgb(255, 255, 255)",
      "errorContainer": "rgb(255, 218, 214)",
      "onErrorContainer": "rgb(65, 0, 2)",
      "background": "rgb(255, 251, 255)",
      "onBackground": "rgb(30, 27, 22)",
      "surface": "rgb(255, 251, 255)",
      "onSurface": "rgb(30, 27, 22)",
      "surfaceVariant": "rgb(237, 225, 207)",
      "onSurfaceVariant": "rgb(77, 70, 57)",
      "outline": "rgb(127, 118, 103)",
      "outlineVariant": "rgb(209, 197, 180)",
      "shadow": "rgb(0, 0, 0)",
      "scrim": "rgb(0, 0, 0)",
      "inverseSurface": "rgb(52, 48, 42)",
      "inverseOnSurface": "rgb(248, 239, 231)",
      "inversePrimary": "rgb(244, 190, 72)",
      "elevation": {
        "level0": "transparent",
        "level1": "rgb(248, 243, 242)",
        "level2": "rgb(244, 238, 235)",
        "level3": "rgb(240, 233, 227)",
        "level4": "rgb(239, 232, 224)",
        "level5": "rgb(236, 228, 219)"
      },
      "surfaceDisabled": "rgba(30, 27, 22, 0.12)",
      "onSurfaceDisabled": "rgba(30, 27, 22, 0.38)",
      "backdrop": "rgba(54, 48, 36, 0.4)",


      success: "rgb(56, 107, 1)",
      onSuccess: "rgb(255, 255, 255)",
      successContainer: "rgb(183, 244, 129)",
      onSuccessContainer: "rgb(13, 32, 0)",
      warning: "rgb(121, 89, 0)",
      onWarning: "rgb(255, 255, 255)",
      warningContainer: "rgb(255, 223, 160)",
      onWarningContainer: "rgb(38, 26, 0)",
      info: "rgb(0, 99, 154)",
      onInfo: "rgb(255, 255, 255)",
      infoContainer: "rgb(206, 229, 255)",
      onInfoContainer: "rgb(0, 29, 50)"
    }
  },
  [IThemeType.ExactDark]: {
    ...MD3DarkTheme,
    ...DarkTheme,
    mode: "exact",
    fonts: configureFonts({config: fontConfig}),
    colors: {
      ...MD3DarkTheme.colors,
      ...DarkTheme.colors,
      "primary": "rgb(244, 190, 72)",
      "onPrimary": "rgb(64, 45, 0)",
      "primaryContainer": "rgb(92, 66, 0)",
      "onPrimaryContainer": "rgb(255, 222, 162)",
      "secondary": "rgb(255, 179, 175)",
      "onSecondary": "rgb(104, 0, 13)",
      "secondaryContainer": "rgb(147, 0, 22)",
      "onSecondaryContainer": "rgb(255, 218, 215)",
      "tertiary": "rgb(226, 197, 74)",
      "onTertiary": "rgb(58, 48, 0)",
      "tertiaryContainer": "rgb(84, 70, 0)",
      "onTertiaryContainer": "rgb(255, 225, 107)",
      "error": "rgb(255, 180, 171)",
      "onError": "rgb(105, 0, 5)",
      "errorContainer": "rgb(147, 0, 10)",
      "onErrorContainer": "rgb(255, 180, 171)",
      "background": "rgb(30, 27, 22)",
      "onBackground": "rgb(233, 225, 217)",
      "surface": "rgb(30, 27, 22)",
      "onSurface": "rgb(233, 225, 217)",
      "surfaceVariant": "rgb(77, 70, 57)",
      "onSurfaceVariant": "rgb(209, 197, 180)",
      "outline": "rgb(153, 143, 128)",
      "outlineVariant": "rgb(77, 70, 57)",
      "shadow": "rgb(0, 0, 0)",
      "scrim": "rgb(0, 0, 0)",
      "inverseSurface": "rgb(233, 225, 217)",
      "inverseOnSurface": "rgb(52, 48, 42)",
      "inversePrimary": "rgb(122, 89, 0)",
      "elevation": {
        "level0": "transparent",
        "level1": "rgb(41, 35, 25)",
        "level2": "rgb(47, 40, 26)",
        "level3": "rgb(54, 45, 28)",
        "level4": "rgb(56, 47, 28)",
        "level5": "rgb(60, 50, 29)"
      },
      "surfaceDisabled": "rgba(233, 225, 217, 0.12)",
      "onSurfaceDisabled": "rgba(233, 225, 217, 0.38)",
      "backdrop": "rgba(54, 47, 36, 0.4)",


      success: "rgb(156, 215, 105)",
      onSuccess: "rgb(26, 55, 0)",
      successContainer: "rgb(40, 80, 0)",
      onSuccessContainer: "rgb(183, 244, 129)",
      warning: "rgb(248, 189, 42)",
      onWarning: "rgb(64, 45, 0)",
      warningContainer: "rgb(92, 67, 0)",
      onWarningContainer: "rgb(255, 223, 160)",
      info: "rgb(150, 204, 255)",
      onInfo: "rgb(0, 51, 83)",
      infoContainer: "rgb(0, 74, 117)",
      onInfoContainer: "rgb(206, 229, 255)"
    }
  },
  [IThemeType.AdaptiveDark]: {
    ...MD3DarkTheme,
    ...DarkTheme,
    mode: "adaptive",
    fonts: configureFonts({config: fontConfig}),
    colors: {
      ...MD3DarkTheme.colors,
      ...DarkTheme.colors,
      "primary": "rgb(244, 190, 72)",
      "onPrimary": "rgb(64, 45, 0)",
      "primaryContainer": "rgb(92, 66, 0)",
      "onPrimaryContainer": "rgb(255, 222, 162)",
      "secondary": "rgb(255, 179, 175)",
      "onSecondary": "rgb(104, 0, 13)",
      "secondaryContainer": "rgb(147, 0, 22)",
      "onSecondaryContainer": "rgb(255, 218, 215)",
      "tertiary": "rgb(226, 197, 74)",
      "onTertiary": "rgb(58, 48, 0)",
      "tertiaryContainer": "rgb(84, 70, 0)",
      "onTertiaryContainer": "rgb(255, 225, 107)",
      "error": "rgb(255, 180, 171)",
      "onError": "rgb(105, 0, 5)",
      "errorContainer": "rgb(147, 0, 10)",
      "onErrorContainer": "rgb(255, 180, 171)",
      "background": "rgb(30, 27, 22)",
      "onBackground": "rgb(233, 225, 217)",
      "surface": "rgb(30, 27, 22)",
      "onSurface": "rgb(233, 225, 217)",
      "surfaceVariant": "rgb(77, 70, 57)",
      "onSurfaceVariant": "rgb(209, 197, 180)",
      "outline": "rgb(153, 143, 128)",
      "outlineVariant": "rgb(77, 70, 57)",
      "shadow": "rgb(0, 0, 0)",
      "scrim": "rgb(0, 0, 0)",
      "inverseSurface": "rgb(233, 225, 217)",
      "inverseOnSurface": "rgb(52, 48, 42)",
      "inversePrimary": "rgb(122, 89, 0)",
      "elevation": {
        "level0": "transparent",
        "level1": "rgb(41, 35, 25)",
        "level2": "rgb(47, 40, 26)",
        "level3": "rgb(54, 45, 28)",
        "level4": "rgb(56, 47, 28)",
        "level5": "rgb(60, 50, 29)"
      },
      "surfaceDisabled": "rgba(233, 225, 217, 0.12)",
      "onSurfaceDisabled": "rgba(233, 225, 217, 0.38)",
      "backdrop": "rgba(54, 47, 36, 0.4)",


      success: "rgb(156, 215, 105)",
      onSuccess: "rgb(26, 55, 0)",
      successContainer: "rgb(40, 80, 0)",
      onSuccessContainer: "rgb(183, 244, 129)",
      warning: "rgb(248, 189, 42)",
      onWarning: "rgb(64, 45, 0)",
      warningContainer: "rgb(92, 67, 0)",
      onWarningContainer: "rgb(255, 223, 160)",
      info: "rgb(150, 204, 255)",
      onInfo: "rgb(0, 51, 83)",
      infoContainer: "rgb(0, 74, 117)",
      onInfoContainer: "rgb(206, 229, 255)"
    }
  }
};
