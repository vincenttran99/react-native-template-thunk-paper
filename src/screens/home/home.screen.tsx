import React, {useRef} from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import BText from "components/base/text.base";
import {FontSize, HS, MHS, VS} from "constants/system/ui/sizes.ui.constant";
import {ITheme} from "constants/system/ui/theme.constant";
import {useSystemTheme} from "helpers/hooks/system.hook";
import {Divider} from "react-native-paper";
import BTextMulti from "components/base/multiText.base";
import BButton from "components/base/button.base";
import BTextInput from "components/base/textInput.base";
import GlobalHelper from "helpers/globalHelper";
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from "@gorhom/bottom-sheet";
import navigationHelper from "helpers/navigation.helper";
import {NAVIGATION_LOGS_BUG_SCREEN, NAVIGATION_RELEASE_LOGS_SCREEN} from "constants/system/navigation.constant";
import SkeletonContainerComponent from "components/skeleton/skeletonContainer.component";
import BTextEllipsis from "components/base/textEllipsis/textEllipsis.base";
import RNRestart from "react-native-restart";
import {MMKV} from "react-native-mmkv";
import {EEnvironment} from "configs";
import BDivider from "components/base/divider.base";
import HorizontalSlideListComponent from "components/list/horizontalSlide.list.component";
import {Device} from "constants/system/device.constant";

const storage = new MMKV()

const DATA_IMAGE = [
  {image:require('assets/images/image1.png')},
  {image:require('assets/images/image2.png')},
  {image:require('assets/images/image3.png')},
  {image:require('assets/images/image4.png')},
]

export default function HomeScreen() {
  const { styles, theme } = useSystemTheme(createStyles);
  const bottomSheetRef = useRef<BottomSheet>(null);

  function showSnackBar() {
    GlobalHelper.showSnackBar({ content: "Hello" });
  }

  async function switchEnvironment (){
    const env = storage.getString("env") || (__DEV__ ? EEnvironment.DEVELOP : EEnvironment.PRODUCT);
    if (env === EEnvironment.PRODUCT) {
      GlobalHelper.showSnackBar({
        type: 'success',
        content: "Prepare to switch back to -----DEVELOPER MODE-----",
      });
      storage.set("env", EEnvironment.DEVELOP)
      setTimeout(() => {
        RNRestart.restart()
      }, 2000)
    } else {
      GlobalHelper.showSnackBar({
        type: 'success',
        content: "Prepare to switch back to -----PRODUCTION MODE-----",
      });
      storage.set("env", EEnvironment.PRODUCT)
      setTimeout(() => {
        RNRestart.restart()
      }, 2000)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollViewStyle} contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.componentView}>
          <BText variant={"headlineMedium"}>Button</BText>
          <Divider />
          <BButton onPress={switchEnvironment}>Switch DEV/PRO environment</BButton>
          <BButton mode={"contained"} onPress={showSnackBar}>Show snackbar</BButton>
          <BButton mode={"elevated"} onPress={() => bottomSheetRef.current?.expand()}>Show bottom sheet</BButton>
          <BButton mode={"outlined"} onPress={() => navigationHelper.navigate(NAVIGATION_LOGS_BUG_SCREEN)}>Bugs
            list</BButton>
          <BButton mode={"contained-tonal"} onPress={() => navigationHelper.navigate(NAVIGATION_RELEASE_LOGS_SCREEN)}>Release
            logs</BButton>
        </View>

        <View style={styles.componentView}>
          <BText variant={"headlineMedium"}>TextInput</BText>
          <Divider />
          <BTextInput placeholder={"Textinput"} />
          <BTextInput mode={"outlined"} placeholder={"Textinput"} />
          <BTextInput mode={"outlined"} label={"Hello"} />
        </View>

        <View style={styles.componentView}>
          <BText variant={"headlineMedium"}>TextEllipsis</BText>
          <Divider />
          <BTextEllipsis numberOfLines={3} styleReadMoreText={{ color: "red" }} style={{ width: "100%", fontSize: 16 }}>
            The string against which to match the regular expression. All values are coerced to strings, so omitting it
            or
            passing undefined causes test() to search for the string "undefined", which is rarely what you want.
          </BTextEllipsis>
        </View>


        <View style={styles.componentView}>
          <BText variant={"headlineMedium"}>Multi text</BText>
          <Divider />
          <BTextMulti
            style1={{ color: "red", fontWeight: "bold", fontSize: FontSize.H2 }}
            style2={{ color: "green", fontWeight: "500", fontStyle: "italic" }}
            style3={{ color: "brown", fontSize: FontSize.H3, textDecorationLine: "line-through" }}
          >Hello |||Every||| One</BTextMulti>
        </View>

        <View style={styles.componentView}>
          <BText variant={"headlineMedium"}>Divider</BText>
          <BDivider style={{height:2}} />
          <BDivider style={{height:2}} type={'dashed'}/>
          <BDivider style={{height:2}} type={'dotted'}/>
        </View>

        <View style={styles.componentView}>
          <BText variant={"headlineMedium"}>Divider</BText>
          <HorizontalSlideListComponent
              width={Device.width-HS._48}
              height={(Device.width-HS._48)/2.63}
              style={styles.styleSlide}
              images={DATA_IMAGE}
              infinity
              activeDotColor={theme.colors.secondary}
              containerDotStyle={styles.containerDotStyle}
              autoPlay
          />
        </View>

        <View style={styles.componentView}>
          <BText variant={"headlineMedium"}>Skeleton</BText>
          <Divider />

          {/*square*/}
          <SkeletonContainerComponent>
            <View style={{ width: 100, height: 100 }} />
          </SkeletonContainerComponent>

          {/*circle*/}
          <SkeletonContainerComponent>
            <View style={{ width: 100, height: 100, borderRadius: 100 }} />
          </SkeletonContainerComponent>

          {/*line text*/}
          <SkeletonContainerComponent>
            <View style={{ width: "100%", height: 20, borderRadius: 6 }} />
          </SkeletonContainerComponent>
          <SkeletonContainerComponent>
            <View style={{ width: "100%", height: 20, borderRadius: 6 }} />
          </SkeletonContainerComponent>
        </View>
      </ScrollView>


      <BottomSheet
        ref={bottomSheetRef}
        enablePanDownToClose
        index={-1}
        backdropComponent={(props) => <BottomSheetBackdrop disappearsOnIndex={-1} appearsOnIndex={0} {...props} />}
        snapPoints={["50%"]}>
        <BottomSheetView style={styles.contentContainer}>
          <BText variant={"headlineLarge"}>Hello guys</BText>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};


const createStyles = (theme: ITheme) => {
  return StyleSheet.create({
    container: {
      flex: 1
    },
    contentContainerStyle: {
      justifyContent: "center",
      alignItems: "center",
      gap: VS._32,
      paddingBottom: VS._20
    },
    scrollViewStyle: {
      flex: 1
    },
    componentView: {
      width: "100%",
      gap: MHS._6,
      paddingHorizontal: HS._24
    },
    contentContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.infoContainer
    },
    styleSlide:{
      borderRadius: MHS._12
    },
    containerDotStyle:{
      position:'absolute',
      bottom: MHS._6,
      alignSelf:'center'
    },
  });
};
