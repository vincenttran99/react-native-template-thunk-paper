import {createNativeStackNavigator} from "@react-navigation/native-stack";
import React, {useMemo} from "react";
import {
    NAVIGATION_DETAIL_LOGS_BUG_SCREEN,
    NAVIGATION_HOME_SCREEN,
    NAVIGATION_LOGS_BUG_SCREEN,
    NAVIGATION_RELEASE_LOGS_SCREEN
} from "constants/system/navigation.constant";
import {useSystemTheme} from "helpers/hooks/system.hook";
import HomeScreen from "screens/home/home.screen";
import LogsBugScreen from "screens/logsBugFileStorage/logsBug.screen";
import DetailLogsBugScreen from "screens/logsBugFileStorage/detail.LogsBug.screen";
import languages from "constants/system/languages";
import ReleaseLogsScreen from "screens/releaseLogs/releaseLogs.screen";
import DefaultAppbarComponent from "components/appbar/default.appbar.component";
import {NativeStackHeaderProps} from "@react-navigation/native-stack/src/types";


const StackNavigator = createNativeStackNavigator();

const MainNavigator = () => {
    const {theme} = useSystemTheme();

    const screenOptions = useMemo(() => {
        return {
            header: (props: NativeStackHeaderProps) => <DefaultAppbarComponent {...props} />,
        }
    }, [languages, theme])

    return (
        <StackNavigator.Navigator
            initialRouteName={NAVIGATION_HOME_SCREEN}
            screenOptions={screenOptions}
        >
            <StackNavigator.Screen name={NAVIGATION_HOME_SCREEN} options={{title: languages.home.home}}
                                   component={HomeScreen}/>
            <StackNavigator.Screen name={NAVIGATION_LOGS_BUG_SCREEN} options={{title: languages.logsBug.logs}}
                                   component={LogsBugScreen}/>
            <StackNavigator.Screen name={NAVIGATION_DETAIL_LOGS_BUG_SCREEN}
                                   options={{title: languages.detailLogsBug.detail}} component={DetailLogsBugScreen}/>
            <StackNavigator.Screen name={NAVIGATION_RELEASE_LOGS_SCREEN}
                                   options={{title: languages.releaseLogs.logs}} component={ReleaseLogsScreen}/>

        </StackNavigator.Navigator>
    );
};

export default MainNavigator;
