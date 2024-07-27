import React, {useCallback, useEffect, useState} from "react";
import firestore from "@react-native-firebase/firestore";
import {ActivityIndicator, FlatList, Pressable, StyleSheet, View} from "react-native";
import navigationHelper from "helpers/navigation.helper";
import {useSystemTheme} from "helpers/hooks/system.hook";
import FirebaseConstant from "constants/firebase.constant";
import BText from "components/base/text.base";
import {FontSize, HS, MHS, VS} from "constants/system/ui/sizes.ui.constant";
import BTextMulti from "components/base/multiText.base";
import GlobalHelper from "helpers/globalHelper";
import languages from "constants/system/languages";
import {NAVIGATION_DETAIL_LOGS_BUG_SCREEN} from "constants/system/navigation.constant";
import {Device} from "constants/system/device.constant";
import {Shadow2} from "constants/system/ui/shadow.ui.constant";
import {ITheme} from "constants/system/ui/theme.constant";
import BButton from "components/base/button.base";

const LogsBugScreen = () => {
    const {styles, theme} = useSystemTheme(createStyles);
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [users, setUsers] = useState<any[]>([]); // Initial empty array of users

    useEffect(() => {
        const subscriber = firestore()
            .collection("Bugs")
            .orderBy('time', 'desc')
            .onSnapshot(querySnapshot => {
                const users: any[] = [];

                querySnapshot.forEach(documentSnapshot => {
                    users.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id
                    });
                });

                setUsers(users);
                setLoading(false);
            });

        // Unsubscribe from events when no longer in use
        return () => subscriber();
    }, []);

    const onUpdateBugs = useCallback((item: any) => {
        if (item?.status === FirebaseConstant.ETypeOfBug.New) {
            firestore()
                .collection('Bugs')
                .doc(item?.id)
                .update({
                    status: FirebaseConstant.ETypeOfBug.Fixed
                })
                .then(() => {
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
                        type: 'success'
                    })
                }).catch(err => console.log(err));
        }
    }, [])

    const renderItem = useCallback(({item}: { item: any }) => {

        return (
            <Pressable
                onPress={() => navigationHelper.navigate(NAVIGATION_DETAIL_LOGS_BUG_SCREEN, {item})}
                style={{
                    width: "100%",
                    backgroundColor: theme.colors.background,
                    borderRadius: MHS._12,
                    paddingHorizontal: MHS._12,
                    paddingVertical: MHS._8,
                    ...Shadow2
                }}>
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
                                fontSize: FontSize._18,
                                fontWeight: 'bold',
                                color: item?.type === "api" ? "red" : "orange"
                            }}
                            style2={{color: item?.isDevSite ? "green" : "blue"}}
                        >{`${item?.type} - |||${item?.isDevSite ? "Dev" : "Live"}`}</BTextMulti>
                        <BText>{new Date(item?.time).toLocaleString()}</BText>
                    </View>

                    <BButton
                        onPress={() => onUpdateBugs(item)}
                        style={{
                            backgroundColor: item?.status === FirebaseConstant.ETypeOfBug.New ? theme.colors.primary : theme.colors.success,
                            borderRadius: MHS._6,
                            paddingHorizontal: MHS._12,
                            paddingVertical: MHS._6,
                            ...Shadow2
                        }}>
                        <BText
                            variant={"bodyMedium"}>{item?.status === FirebaseConstant.ETypeOfBug.New ? "Đã xử lý" : "Đã xong"}</BText>
                    </BButton>
                </View>

                <BText>{item?.error}</BText>
            </Pressable>
        );
    }, []);

    if (loading) {
        return <ActivityIndicator/>;
    }

    return (
        <FlatList
            data={users}
            contentContainerStyle={{
                width: Device.width,
                paddingHorizontal: HS._6,
                gap: MHS._12,
                paddingVertical: VS._12
            }}
            renderItem={renderItem}
            removeClippedSubviews
        />
    );
};


const createStyles = (theme: ITheme) => {
    return StyleSheet.create({});
};

export default LogsBugScreen;
