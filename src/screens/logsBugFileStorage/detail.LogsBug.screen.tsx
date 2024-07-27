import React, {useCallback, useState} from "react";
import {Image, Pressable, ScrollView, StyleSheet, View} from "react-native";
import {useRoute} from "@react-navigation/native";

import Clipboard from "@react-native-community/clipboard";
import firestore from "@react-native-firebase/firestore";
import navigationHelper from "helpers/navigation.helper";
import {useSystemTheme} from "helpers/hooks/system.hook";
import FirebaseConstant from "constants/firebase.constant";
import GlobalHelper from "helpers/globalHelper";
import languages from "constants/system/languages";
import BTextMulti from "components/base/multiText.base";
import {FontSize, HS, MHS, VS} from "constants/system/ui/sizes.ui.constant";
import BText from "components/base/text.base";
import {Shadow2} from "constants/system/ui/shadow.ui.constant";
import {Device} from "constants/system/device.constant";
import {ITheme} from "constants/system/ui/theme.constant";

const DetailLogsBugScreen = () => {
    const {styles, theme} = useSystemTheme(createStyles);
    const route = useRoute<any>();
    const [item, setItem] = useState<any>(route?.params?.item);
    const [device] = useState<any>(JSON.parse(route?.params?.item?.device || "{}"));
    const [screenStack] = useState<any>((route?.params?.item?.detail || "").split("|_|"));

    const onUpdateBugs = useCallback(() => {
        if (item?.status === FirebaseConstant.ETypeOfBug.New) {
            firestore()
                .collection('Bugs')
                .doc(item?.id)
                .update({
                    status: FirebaseConstant.ETypeOfBug.Fixed
                })
                .then(() => {
                    setItem((old: any) => ({
                        ...old,
                        status: FirebaseConstant.ETypeOfBug.Fixed
                    }))
                    GlobalHelper.showSnackBar({
                        content: languages.logsBug.updated,
                        type: 'success'
                    })
                }).catch(err => console.log(err));
        } else {
            firestore()
                .collection('Bugs')
                .doc(item?.id)
                .delete()
                .then(() => {
                    GlobalHelper.showSnackBar({
                        content: languages.logsBug.deleted,
                        type: "success"
                    })
                    navigationHelper.goBack();
                }).catch(err => console.log(err));
        }
    }, [item])

    const renderObjectInfo = useCallback((item: string, parent: any) => {
        return (
            // <TextBase fontSize={16} key={item} onPress={() => Clipboard.setString(String(parent?.[item]) || "")}
            //           title={item + ": "} fontWeight={"bold"}
            //           style={styles.paddingVer4}>
            //     <TextBase fontSize={16}
            //               title={typeof parent?.[item] === "object" ? JSON.stringify(parent?.[item]) : String(parent?.[item])}/>
            // </TextBase>

            <BTextMulti
                key={item}
                onPress={() => Clipboard.setString(String(parent?.[item]) || "")}
                style1={[{fontSize: FontSize._16, fontWeight: 'bold'}, styles.paddingVer4]}
                style2={{fontWeight: '300'}}
            >
                {`${item}: |||${typeof parent?.[item] === "object" ? JSON.stringify(parent?.[item]) : String(parent?.[item])}`}
            </BTextMulti>
        );
    }, []);

    const renderAPI = useCallback((item: string) => {
        let apiObject = JSON.parse(item.replace("API_", ""));

        return (
            <View
                key={apiObject?.endpoint}
                style={styles.viewAPI}>
                <View style={styles.viewTopAPI}>

                    <BTextMulti
                        style1={{fontSize: FontSize._16, fontWeight: 'bold', color: "red"}}
                        style2={{color: apiObject?.hasAuth ? "black" : "red"}}
                        style3={{color: apiObject?.type == "get" ? "green" : "blue"}}
                    >
                        {`API - |||${apiObject?.hasAuth ? "Có AUTH - " : "Không AUTH - "}|||${apiObject?.type}`}
                    </BTextMulti>


                    <BText style={{
                        fontWeight: 'bold',
                        color: Number(apiObject?.responseCode) >= 300 ? theme.colors.error : theme.colors.success
                    }}
                    >{apiObject?.responseCode}</BText>
                </View>

                <BText variant={"bodyLarge"} style={styles.marginTop16}>{"Endpoint:"}</BText>
                <BText variant={"bodyLarge"}
                       onPress={() => Clipboard.setString(apiObject?.endpoint || "")}
                >{apiObject?.endpoint || "Không có"}</BText>

                <BText variant={"bodyLarge"} style={styles.marginTop16}>{"Data Request:"}</BText>
                {
                    typeof apiObject?.data === "object" ? Object.keys(apiObject?.data).map((item) => renderObjectInfo(item, apiObject?.data)) :
                        <BText>{"Không có"}</BText>
                }

                <BText variant={'bodyLarge'} style={styles.marginTop16}>{"Response:"}</BText>
                {
                    typeof apiObject?.typeOfResponse === "object" ? Object.keys(apiObject?.typeOfResponse).map((item) => renderObjectInfo(item, apiObject?.typeOfResponse)) :
                        <BText>{"Không có"}</BText>
                }

                {
                    apiObject?.error &&
                    <>
                        <BText variant={'bodyLarge'}
                               style={styles.marginTop16}>{"Error:"}</BText>
                        <BText variant={'bodyLarge'}
                               onPress={() => Clipboard.setString(apiObject?.error || "")}>{apiObject?.error || "Không có"}</BText>
                    </>
                }

                {
                    apiObject?.messageError &&
                    <>
                        <BText variant={'bodyLarge'}
                               style={styles.marginTop16}>{"Error Message:"}</BText>
                        <BText variant={'bodyLarge'}
                               onPress={() => Clipboard.setString(apiObject?.messageError || "")}>{apiObject?.messageError || "Không có"}</BText>

                    </>
                }

            </View>
        );
    }, []);

    const renderScreenStack = useCallback((item: string, index: number) => {
        let actionStack = item.split("|*|");
        let screen = actionStack.shift();

        return (
            <View style={{width: "100%"}} key={"screen_" + index + "screen"}>
                <BText variant={'bodyLarge'} style={styles.marginTop16}>{screen}</BText>
                {
                    actionStack.map(renderAPI)
                }
            </View>

        );
    }, []);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: VS._20}}>
            <View style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: MHS._12
            }}>
                <View>
                    <BTextMulti
                        style1={{
                            fontSize: FontSize._22,
                            fontWeight: "bold",
                            color: item?.type === "api" ? "red" : "orange"
                        }}
                        style2={{color: item?.isDevSite ? "green" : "blue"}}
                    >
                        {`${item?.type} - |||${item?.isDevSite ? "Dev" : "Live"}`}
                    </BTextMulti>
                    <BText>{new Date(item?.time).toLocaleString()}</BText>
                </View>

                <Pressable
                    onPress={onUpdateBugs}
                    style={{
                        backgroundColor: item?.status === FirebaseConstant.ETypeOfBug.New ? theme.colors.primary : theme.colors.success,
                        borderRadius: MHS._6,
                        paddingHorizontal: MHS._18,
                        paddingVertical: MHS._10,
                        ...Shadow2
                    }}>
                    <BText
                        variant={"bodyMedium"}>{item?.status === FirebaseConstant.ETypeOfBug.New ? "Đã xử lý" : "Đã xong"}</BText>
                </Pressable>
            </View>

            <BText variant={"bodyLarge"} style={styles.marginTop16}>{"Lỗi:"}</BText>
            <BText onPress={() => Clipboard.setString(item?.error || "")}>{item?.error || "Không có"}</BText>

            {
                item?.screenShot ?
                    <>
                        <BText variant={'bodyLarge'} style={styles.marginTop16}>{"Screenshot:"}</BText>
                        <Pressable onPress={() => Clipboard.setString(item?.screenShot || "")}>
                            <Image source={{uri: item?.screenShot}}
                                   style={{width: "100%", height: Device.height, borderWidth: 1, borderColor: 'black'}}
                                   resizeMode={"contain"}/>
                        </Pressable>

                    </>
                    : null
            }


            <BText variant={'bodyLarge'} style={styles.marginTop16}>{"Stack Trace:"}</BText>
            <BText onPress={() => Clipboard.setString(item?.stackTrace || "")}
            >{item?.stackTrace || "Không có"}</BText>

            <BText variant={"bodyLarge"} style={styles.marginTop16}>{"Account ID:"}</BText>
            <BText onPress={() => Clipboard.setString(item?.user || "")}>{item?.user || "Không có"}</BText>

            <BText variant={"bodyLarge"} style={styles.marginTop16}>{"Channel ID:"}</BText>
            <BText onPress={() => Clipboard.setString(item?.channelId || "")}>{item?.channelId || "Không có"}</BText>

            <BText variant={"bodyLarge"} style={styles.marginTop16}>{"Thiết bị:"}</BText>
            {
                Object.keys(device).map((item) => renderObjectInfo(item, device))
            }

            <BText variant={"bodyLarge"} style={styles.marginTop16}>{"Logs:"}</BText>
            {
                screenStack.map(renderScreenStack)
            }
        </ScrollView>
    );
};


const createStyles = (theme: ITheme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: MHS._12,
            backgroundColor: theme.colors.background
        },
        marginTop16: {
            marginTop: VS._16
        },
        viewAPI: {width: "100%", paddingLeft: HS._20, marginTop: VS._12, paddingBottom: VS._12, borderBottomWidth: 1},
        viewTopAPI: {
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: MHS._12
        },
        paddingVer4: {
            paddingVertical: MHS._4
        }
    });
};

export default DetailLogsBugScreen;
