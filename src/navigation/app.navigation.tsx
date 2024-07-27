import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";

import setupAxiosInterceptors from "configs/axios.config";
import {useAppDispatch, useAppSelector} from "configs/store.config";
// import { EnumTheme } from "constants/system.constant";
import {StatusBar, StyleSheet, Text, View} from "react-native";
import ErrorBoundary from "react-native-error-boundary";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

import {NavigationContainer} from "@react-navigation/native";
import RNBootSplash from "react-native-bootsplash";
// import { setTokenFirebase } from "store/reducer/system.reducer.store";
import Config from "react-native-config";
import FirebaseHelper from "helpers/firebase.helper";
import {NAVIGATION_LOGIN_SCREEN, NAVIGATION_MAIN_NAVIGATION,} from "constants/system/navigation.constant";
import LoginScreen from "screens/login/login.screen";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import LoadingGlobalComponent from "components/global/loading.global.component";
import GlobalHelper from "helpers/globalHelper";
import SnackBarGlobalComponent from "components/global/snackbar.global.component";
import {PaperProvider} from "react-native-paper";
import {THEME} from "constants/system/ui/theme.constant";
import {EEnvironment} from "configs";
import {VS} from "constants/system/ui/sizes.ui.constant";
import NavigationHelper from "helpers/navigation.helper";
import navigationHelper from "helpers/navigation.helper";
import ViewShot, {CaptureOptions} from "react-native-view-shot";
import MainNavigator from "navigation/main.navigation";
import StorageHelper from "helpers/storage.helper";
import {MMKV} from "react-native-mmkv";
import dayjs from "dayjs";
import {refreshTokenThunk} from "store/reducers/user.reducer.store";

const storage = new MMKV()

setupAxiosInterceptors((status: number) => {
    switch (status) {
        case 401:
            // GlobalPopupHelper.showPopupRequestLogin()
            break;
        case 403:
            // GlobalPopupHelper.showPopupNoPermission()
            break;
    }
});

const optionsScreenShot: CaptureOptions = {format: "jpg", quality: 0.8}
const NativeStack = createNativeStackNavigator();

export default function AppNavigation() {

    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const tokenExpires = useAppSelector(state => state.user.tokenExpires);
    const oldTokenExpires = useMemo(()=>tokenExpires,[])
    const routeNameRef = useRef("");
    const themeType = useAppSelector((state) => state.system.themeType);
    const [isProduct, setIsProduct] = useState<boolean | null>((storage.getString("env") || (__DEV__ ? EEnvironment.DEVELOP : EEnvironment.PRODUCT))===EEnvironment.PRODUCT);
    const theme = useMemo(() => THEME[themeType], [themeType])
    const dispatch = useAppDispatch();


    useLayoutEffect(() => {
        if(isAuthenticated){
            /**
             * Refresh the token when open app
             * Backend-er said "It ok"
             */
            dispatch(refreshTokenThunk())
        }

        StorageHelper.clearBugLog()
    }, []);

    useEffect(() => {
        // const updateFirebaseToken = async () => {
        //   const token = await getFCMTokenHelper();
        //   dispatch(setTokenFirebase(token));
        // };
        // updateFirebaseToken();

        StorageHelper.setBugDevice();

        // return () => {
        //   endConnection();
        // };
    }, []);

    // useEffect(() => {
    //   if (isProduct !== null) {
    //     requestUserPermissionHelper()
    //     createDefaultChannelsHelper()
    //     NotificationHelperHelper()
    //   }
    // }, [isProduct])

    const onErrorCrashApp = useCallback((error: any, stackTrace: string) => {
        if (!__DEV__) {
            FirebaseHelper.createLogBug(String(error), stackTrace, "crash", navigationHelper.getRouteName() || "");
        }
    }, []);


    if (isAuthenticated && dayjs(tokenExpires).isSame(oldTokenExpires)) {
        return null;
    }

    return (
        <PaperProvider theme={theme}>
            <ViewShot style={styles.container} ref={GlobalHelper.ViewShotRef} options={optionsScreenShot}>

                <BottomSheetModalProvider>
                    <NavigationContainer ref={NavigationHelper.navigationRef}
                                         theme={theme}
                                         linking={{
                                             prefixes: [`${Config.DEEP_LINK}://`]
                                         }}
                                         onReady={() => {
                                             routeNameRef.current = NavigationHelper.navigationRef.current?.getCurrentRoute()?.name || "";
                                             StorageHelper.setBugLog(routeNameRef.current);
                                             NavigationHelper.updateTimestampLastScreenOpening()
                                             FirebaseHelper.logScreenView(routeNameRef.current)
                                             RNBootSplash.hide({fade: true});
                                         }}
                                         onStateChange={async () => {
                                             NavigationHelper.updateTimestampLastScreenOpening()
                                             const previousRouteName = routeNameRef.current;
                                             const currentRouteName = NavigationHelper.navigationRef.current?.getCurrentRoute()?.name || "";

                                             if (previousRouteName !== currentRouteName) {
                                                 StorageHelper.setBugLog("|_|" + currentRouteName);
                                                 FirebaseHelper.logScreenView(currentRouteName)
                                             }
                                             routeNameRef.current = currentRouteName;
                                         }}>
                        <StatusBar barStyle={"dark-content"} translucent={true}
                                   backgroundColor={"transparent"}/>
                        <ErrorBoundary onError={onErrorCrashApp}>
                            <NativeStack.Navigator
                                screenOptions={{
                                    animation: "slide_from_right",
                                    headerBackTitleVisible: false,
                                    headerShown: false
                                }}
                            >
                                {
                                    isAuthenticated ?
                                        <NativeStack.Screen
                                            name={NAVIGATION_MAIN_NAVIGATION}
                                            component={MainNavigator}
                                        />
                                        :
                                        <NativeStack.Screen
                                            name={NAVIGATION_LOGIN_SCREEN}
                                            component={LoginScreen}
                                        />
                                }
                            </NativeStack.Navigator>
                        </ErrorBoundary>
                    </NavigationContainer>
                </BottomSheetModalProvider>
                {/*<AppStateApp ref={GlobalPopupHelper.appStateRef} />*/}
                {/*<SocketConnect ref={GlobalPopupHelper.globalSocketRef} />*/}
                <LoadingGlobalComponent ref={GlobalHelper.LoadingRef}/>
                <SnackBarGlobalComponent ref={GlobalHelper.SnackBarRef}/>
                {/*<WrapDropdown ref={GlobalPopupHelper.globalAlertRef} />*/}
                {/*<WrapAlertView ref={GlobalPopupHelper.alertRef} />*/}
                {/*<WrapActionSheetView ref={GlobalPopupHelper.actionSheetRef} />*/}
                {/*<DisconnectNetworkScreen />*/}
                {/*<ModalMedia ref={GlobalPopupHelper.modalMediaRef} />*/}
                {/*<ModalMediaPost ref={GlobalPopupHelper.modalMediaPostRef} />*/}
                {/*<LevelupModal ref={GlobalPopupHelper.levelUpRef} />*/}
                {/*<FaqPointScreen ref={GlobalPopupHelper.faqPointRef} />*/}
                {/*<FaqDiamondScreen ref={GlobalPopupHelper.faqDiamond} />*/}
                {
                    !isProduct ? (
                        <View pointerEvents="none" style={styles.devType}>
                            <Text style={styles.title}>{"DEVELOP"}</Text>
                        </View>
                    ) : null
                }
            </ViewShot>
        </PaperProvider>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    devType: {
        position: "absolute",
        top: VS._10,
        right: -VS._50,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        width: VS._160,
        height: VS._32,
        justifyContent: "center",
        alignItems: "center",
        transform: [{rotate: "45deg"}]
    },
    title: {
        color: "white",
        fontWeight: "600"
    }
});
