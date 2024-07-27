import {useEffect, useMemo} from "react";
import {useAppSelector} from "configs/store.config";
import {ImageStyle, TextStyle, ViewStyle} from "react-native";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {useTheme} from "react-native-paper";
import {IThemeType} from "constants/system/system.constant";
import {ITheme} from "constants/system/ui/theme.constant";
import {useNavigation} from "@react-navigation/native";


dayjs.extend(isBetween);


type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export function useSystemTheme<T extends NamedStyles<T> | NamedStyles<any>>(createStyle?: (theme: ITheme) => T): {
  styles: T,
  themeType: IThemeType,
  theme: ITheme
} {
  const themeType = useAppSelector((state) => state.system.themeType);

  const theme = useTheme() as ITheme;
  const styles = useMemo(() => {
    return createStyle?.(theme) || {} as T;
  }, [theme]);

  return {theme, themeType, styles};
}


/**
 * Note: use options={{gestureEnabled: false}}
 * @param isOnlyBack
 * @param onRemoveHandle
 */
export function usePreventRemoveScreen(isOnlyBack: boolean = true, onRemoveHandle?: ()=> Promise<boolean>) {
  const navigation = useNavigation()
  useEffect(() => {
        navigation.addListener('beforeRemove', async (e) => {
          if(isOnlyBack && e.data.action.type === 'GO_BACK') {
              e.preventDefault();
              if (typeof onRemoveHandle === 'function') {
                let allowBack = await onRemoveHandle()
                if (allowBack) {
                  navigation.dispatch(e.data.action)
                }
              }
          }

          if(!isOnlyBack){
            e.preventDefault();
            if (typeof onRemoveHandle === 'function') {
              let allowBack = await onRemoveHandle()
              if (allowBack) {
                navigation.dispatch(e.data.action)
              }
            }
          }
        })
      }, [navigation, isOnlyBack])
}