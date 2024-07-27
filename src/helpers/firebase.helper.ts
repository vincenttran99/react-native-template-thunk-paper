import analytics, {firebase} from '@react-native-firebase/analytics';
import Config from "react-native-config";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {TIMESTAMP_LAST_SCREEN_OPENING} from "helpers/navigation.helper";
import firestore from "@react-native-firebase/firestore";
import GlobalHelper from "helpers/globalHelper";
import {Device} from "constants/system/device.constant";
import FirebaseConstant from "constants/firebase.constant";
import storage from '@react-native-firebase/storage';
import StorageHelper from "helpers/storage.helper";
import {MMKV} from "react-native-mmkv";
import FileHelper from "helpers/file.helper";
import {EEnvironment} from "configs";


dayjs.extend(utc)
// import notifee, {EventType} from "@notifee/react-native";
// import messaging from "@react-native-firebase/messaging";
// import getStore from "configs/store.config";
// import {
//   NAVIGATION_CHAT_ROOM,
//   NAVIGATION_DETAIL_CHALLENGE_SCREEN,
//   NAVIGATION_DETAIL_COURSES_SCREEN,
//   NAVIGATION_DETAIL_POST_SCREEN,
//   NAVIGATION_HOME_SCREEN,
//   NAVIGATION_LIST_USER_GIFT_SCREEN,
//   NAVIGATION_MANAGERMENT_WITHDRAW_MENTOR_SCREEN,
//   NAVIGATION_MEMBERS_SCREEN,
//   NAVIGATION_POST_APPROVAL_SCREEN
// } from "constants/router.constant";
// import {GlobalPopupHelper} from "helpers";
// import {AppState} from "react-native";
// import {MMKV} from "react-native-mmkv";
// import {bindActionCreators} from "redux";
// import {getDetailRoomChat} from "services/chat.service";
// import {getDetailRequest} from "services/home.service";
// import {setDetailRoom} from "store/reducer/chatRoom.reducer.store";
// import {setTokenFirebase} from "store/reducer/system.reducer.store";
// import navigationHelper, {navigationRef} from "./navigation.helper";
// import firestore from "@react-native-firebase/firestore";
// import {getBugChannelIdHelper, getBugDeviceHelper, getBugLogHelper, getBugOwnerIdHelper} from "helpers/storage.helper";
// import {EnumTypedBugFileStorage, NOTIFICATION_SCREEN} from "constants/system.constant";
// import {languages} from "languages";
// import {uploadMedia} from "services/file.service";
// import {Device} from "ui/device.ui";
// import {updateProfileUser} from "store/reducer/user.reducer.store";
//
//
// const storage = new MMKV();
//
// const store = getStore();
// const actions = bindActionCreators({setTokenFirebase, setDetailRoom}, store.dispatch);
//
//
// /**
//  * Notification
//  */
// async function requestUserPermissionHelper() {
//   await notifee.requestPermission();
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
//
//   if (enabled) {
//     console.log("Authorization status:", authStatus);
//   }
// }
//
// async function getFCMTokenHelper() {
//   const fcmToken = storage.getString("fcmToken");
//   if (!fcmToken) {
//     try {
//       await messaging().registerDeviceForRemoteMessages();
//       const token = await messaging().getToken();
//       if (token) {
//         storage.set("fcmToken", token);
//         return token;
//       }
//       return "";
//     } catch (error) {
//       console.log("error fcm token", error);
//       return "";
//     }
//   }
//   return fcmToken;
// }
//
// const createDefaultChannelsHelper = async () => {
//   await notifee.createChannel({
//     id: "taki_education_id",
//     name: "Default Channel",
//     sound: "notification.wav"
//   });
// };
//
// const NotificationHelperHelper = () => {
//   const checkPath = (str1, str2) => {
//     return str1.includes(str2);
//   };
//
//   const handleNotification = async (notification_data: {
//     screen: string;
//     router: string;
//     param: string;
//     thumbnail: string;
//   }) => {
//     if (
//       notification_data?.screen === NOTIFICATION_SCREEN.NAVIGATION_CHAT_ROOM
//     ) {
//       getDetailRoomChat(notification_data?.router)
//         .then(async data => {
//           await actions.setDetailRoom(data);
//           navigationHelper.navigate(NAVIGATION_CHAT_ROOM);
//         })
//         .catch(err => console.log(err));
//       return;
//     }
//     if (notification_data?.screen === NOTIFICATION_SCREEN.POST_IS_CREATED || notification_data.screen === NOTIFICATION_SCREEN.COMMENT_IS_CREATED) {
//       getDetailRequest({
//         request_id: notification_data?.router,
//         auth_id: store.getState().user?.account?._id
//       })
//         .then(async data => {
//           if (data?._id) {
//             navigationHelper.navigate(NAVIGATION_DETAIL_POST_SCREEN, {
//               detailRequest: data
//             });
//           } else {
//             GlobalPopupHelper.alertHelper({
//               type: "error",
//               message: languages.post.postInvalid
//             });
//           }
//         })
//         .catch(err => console.log(err));
//       return;
//     }
//     if (notification_data?.screen === NOTIFICATION_SCREEN.POST_IS_APPROVED || notification_data?.screen === NOTIFICATION_SCREEN.POST_NEED_APPROVING) {
//       navigationHelper.navigate(NAVIGATION_POST_APPROVAL_SCREEN);
//       return;
//     }
//     if (notification_data?.screen === NOTIFICATION_SCREEN.REQUEST_JOIN_YOUR_CHANNEL) {
//       navigationHelper.navigate(NAVIGATION_MEMBERS_SCREEN, {index: 1});
//       return;
//     }
//
//     // Challenge
//
//     if (notification_data?.screen === NOTIFICATION_SCREEN.NAVIGATION_CHALLENGE_CHECKIN) {
//       navigationHelper.navigate(NAVIGATION_DETAIL_CHALLENGE_SCREEN, {item: {_id: notification_data?.router}, index: 4});
//       return;
//     }
//     if (notification_data?.screen === NOTIFICATION_SCREEN.NAVIGATION_CHALLENGE_CHECKIN_APPROVE) {
//       navigationHelper.navigate(NAVIGATION_DETAIL_CHALLENGE_SCREEN, {
//         item: {_id: notification_data?.router},
//         index: 4,
//         tab: "pending"
//       });
//       return;
//     }
//     if (notification_data?.screen === NOTIFICATION_SCREEN.NAVIGATION_CHALLENGE_CREATED) {
//       navigationHelper.navigate(NAVIGATION_DETAIL_CHALLENGE_SCREEN, {
//         item: {_id: notification_data?.router},
//         index: 1
//       });
//       return;
//     }
//     if (notification_data?.screen === NOTIFICATION_SCREEN.NAVIGATION_CHALLENGE_REQUIRE_JOIN_APPROVED || notification_data?.screen === NOTIFICATION_SCREEN.NAVIGATION_CHALLENGE_REQUIRE_JOIN_NEED_APPROVED) {
//       navigationHelper.navigate(NAVIGATION_DETAIL_CHALLENGE_SCREEN, {item: {_id: notification_data?.router}, index: 0});
//       return;
//     }
//     // =================================================================
//
//     // order
//     if (notification_data?.screen === NOTIFICATION_SCREEN.WITHDRAW_REQUEST) {
//       navigationHelper.navigate(NAVIGATION_MANAGERMENT_WITHDRAW_MENTOR_SCREEN);
//       return;
//     }
//     // =================================================================
//
//     // course
//     if (notification_data?.screen === NOTIFICATION_SCREEN.NOTIFICATION_BUY_COURSE_SUCCESS) {
//       navigationHelper.navigate(NAVIGATION_DETAIL_COURSES_SCREEN, {item: {_id: notification_data?.router}});
//       return;
//     }
//     // =================================================================
//
//     // gift
//     if (notification_data?.screen === NOTIFICATION_SCREEN.GIFT_AFTER_CREATED) {
//       navigationHelper.navigate(NAVIGATION_LIST_USER_GIFT_SCREEN);
//       return;
//     }
//     // =================================================================
//   };
//
//   const navigate = (router, params = {}) => {
//     let timeCount = 0;
//     const interval = setInterval(() => {
//       if (navigationRef.isReady() && navigationHelper.getRouteName() === NAVIGATION_HOME_SCREEN) {
//         clearInterval(interval);
//         navigationHelper.navigate(router, params);
//       }
//
//       timeCount += 200;
//       if (timeCount >= 60000) {
//         clearInterval(interval);
//       }
//     }, 200);
//   };
//
//
//   messaging().onNotificationOpenedApp(async (remoteMessage) => {
//     console.log("Notification caused app to open from background state:", remoteMessage.notification);
//     const data: any = remoteMessage?.data || {};
//     handleNotification(data);
//   });
//
//
//   messaging()
//     .subscribeToTopic("all")
//     .then(() => console.log("Subscribed to topic all!"));
//
//   messaging().onTokenRefresh((newFcmToken: string) => {
//     console.log("refreshFCMToken", newFcmToken);
//
//     let isAuth = store.getState()?.user?.isAuthenticated;
//     if (isAuth) actions.setTokenFirebase(newFcmToken);
//   });
//
//   messaging()
//     .getInitialNotification()
//     .then((remoteMessage) => {
//       if (remoteMessage) {
//         console.log("Notification caused app to open from quit state:", remoteMessage.notification);
//         const data: any = remoteMessage?.data || {};
//         handleNotification(data);
//       }
//     });
//
//   messaging().onMessage(async (remoteMessage) => {
//     console.log("notification from foreground state....", remoteMessage, AppState.currentState);
//     if (remoteMessage?.data?.event === "gamifa_start") {
//       const interval = setInterval(() => {
//         if (GlobalPopupHelper.modalChallengeRef.current) {
//           clearInterval(interval);
//           GlobalPopupHelper.modalChallengeRef.current?.showStart();
//         }
//       }, 100);
//     }
//     if (navigationHelper.getRouteName() !== NAVIGATION_CHAT_ROOM) {
//       await notifee.displayNotification({
//         title: remoteMessage.notification?.title,
//         body: remoteMessage.notification?.body || "",
//         data: remoteMessage.data,
//         android: {
//           channelId: "taki_education_id",
//           // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
//           // pressAction is needed if you want the notification to open the app when pressed
//           pressAction: {
//             id: "default"
//           },
//           sound: "notification.wav",
//           smallIcon: "ic_notification",
//           color: "#a51c30"
//         },
//         ios: {
//           sound: "notification.wav"
//         }
//       });
//     }
//   });
//
//   notifee.onBackgroundEvent(async ({type, detail}) => {
//     if (type !== EventType.PRESS) {
//       return
//     }
//     const {router} = detail?.notification?.data || {}
//
//     if (!router) {
//       return;
//     }
//     // @ts-ignore
//     handleNotification(router, detail?.notification?.data || {})
//   })
//
//   return notifee.onForegroundEvent(({type, detail}) => {
//     console.log("onForeground event", type, detail);
//
//     switch (type) {
//       case EventType.DISMISSED:
//         console.log("User dismissed notification", detail);
//         break;
//       case EventType.PRESS:
//         const data: any = detail?.notification?.data || {};
//
//         handleNotification(data);
//
//         console.log("User pressed notification", detail);
//         break;
//     }
//   });
// };
//
// async function createBugToFilesStoreHelper(error: string, stackTrace: string, typeError: "api" | "crash", currentScreen: string) {
//   if (__DEV__) return;
//
//   if (!error && !getBugDeviceHelper()) return;
//
//   //check new log
//   const oldLog = await firestore().collection("Bugs").doc(getBugChannelIdHelper() + currentScreen).get();
//   if (oldLog.exists) return;
//
//   let checkDoneAddBug = false;
//
//   let timeMark = new Date().getTime();
//
//   GlobalPopupHelper.viewShotRef?.current.capture().then(async (uri: string) => {
//
//     await uploadMedia({
//       name: timeMark + ".jpg",
//       uri: Device.isIos ? uri?.replace("file://", "") : uri,
//       type: "image/jpeg",
//     })
//       .then(async (res) => {
//         await firestore()
//           .collection("Bugs")
//           .doc(getBugChannelIdHelper() + currentScreen)
//           .set({
//             device: getBugDeviceHelper(),
//             status: EnumTypedBugFileStorage.New,
//             user: getBugOwnerIdHelper(),
//             time: timeMark,
//             isDevSite: __DEV__,
//             channelId: getBugChannelIdHelper(),
//             detail: getBugLogHelper(),
//             type: typeError,
//             error: error,
//             stackTrace: stackTrace,
//             screenShot: res?.[0]?.callback?.media_url || ""
//           })
//           .then(() => {
//             console.log("Bug added!");
//             checkDoneAddBug = true;
//           })
//           .catch((error) => {
//             console.log(error, "kdfmene")
//           });
//       })
//       .catch((error) => {
//         console.log(error, "ajsdjhasd")
//       })
//
//     if (!checkDoneAddBug) {
//       firestore()
//         .collection("Bugs")
//         .doc(getBugChannelIdHelper() + currentScreen)
//         .set({
//           device: getBugDeviceHelper(),
//           status: EnumTypedBugFileStorage.New,
//           user: getBugOwnerIdHelper(),
//           time: timeMark,
//           isDevSite: __DEV__,
//           channelId: getBugChannelIdHelper(),
//           detail: getBugLogHelper(),
//           type: typeError,
//           error: error,
//           stackTrace: stackTrace
//         })
//         .then(() => {
//           console.log("Bug 22222 added!");
//         })
//         .catch((error) => {
//           console.log(error, "sdjsf")
//         });
//     }
//   }).catch((error) => {
//     console.log(error, "errorjmdbmvb")
//   })
//
//
// }
//
// async function cleanLogBugsHelper() {
//   // Get all logs
//   const usersQuerySnapshot = await firestore().collection("Bugs").get();
//
//   // Create a new batch instance
//   const batch = firestore().batch();
//
//   usersQuerySnapshot.forEach(documentSnapshot => {
//     batch.delete(documentSnapshot.ref);
//   });
//
//   return batch.commit();
// }
//
//
// /**
//  * Logs
//  */
//

namespace FirebaseHelper {

    /**
     * File
     */
    export async function updateFile(filePath: string, folderName: string, fileName?: string): Promise<string> {
        let reference = storage().ref(`/${folderName}/${fileName || (dayjs.utc().format(`img_HH_mm_SSS_DD_MM_YY`) + (FileHelper.getFileExtension(filePath) && ("." + FileHelper.getFileExtension(filePath))))}`);
        return await reference.putFile(filePath)
            .then(async (result) => {
                if(result.state === "success"){
                    return await reference.getDownloadURL()
                }
                return ""
            }).catch(()=>{
                return ""
            })
    }


    /**
     * Logs
     */
    export function logEventAnalytics({event, dataObj = {}, logWithTime = false}: {
        event: string,
        dataObj?: object,
        logWithTime?: boolean
    }) {
        try {
            if (!__DEV__ && Config.LOG_EVENT_TO_FIREBASE?.toLowerCase() === "true") {
                if (logWithTime) {
                    event = `${event}_${dayjs(TIMESTAMP_LAST_SCREEN_OPENING).diff(dayjs(), "second")}`
                }
                analytics().logEvent(event, dataObj);
            }
        } catch (error) {

        }
    }

    export function logScreenView(screen: string) {
        firebase.analytics().logScreenView({
            screen_name: screen,
            screen_class: screen
        }).catch(console.log);
    }


    export async function createLogBug(error: string, stackTrace: string, typeError: "api" | "crash", currentScreen: string) {
        if (__DEV__ || !(Config.LOG_USER_BUGS_TO_FIREBASE?.toLowerCase() === "true")) return;

        if (!error && !StorageHelper.getBugDevice()) return;

        //check new log
        const oldLog = await firestore().collection("Bugs").doc(currentScreen + dayjs.utc().format("_DD_MM_YY")).get();
        if (oldLog.exists) return;
        let checkDoneAddBug = false;

        let timeMark = new Date().getTime();

        GlobalHelper.ViewShotRef?.current.capture().then(async (uri: string) => {
            await updateFile(
                Device.isIos ? uri?.replace("file://", "") : uri,
                "screenshots",
                timeMark + ".jpg"
            )
                .then(async (screenShotUrl: string) => {
                    await firestore()
                        .collection("Bugs")
                        .doc(currentScreen + dayjs.utc().format("_DD_MM_YY"))
                        .set({
                            device: StorageHelper.getBugDevice(),
                            status: FirebaseConstant.ETypeOfBug.New,
                            user: StorageHelper.getBugOwnerId(),
                            time: timeMark,
                            isDevSite: (new MMKV().getString("env") || (__DEV__ ? EEnvironment.DEVELOP : EEnvironment.PRODUCT)) === EEnvironment.DEVELOP,
                            detail: StorageHelper.getBugLog(),
                            type: typeError,
                            error: error,
                            stackTrace: stackTrace,
                            screenShot: screenShotUrl
                        })
                        .then(() => {
                            console.log("Bug added!");
                            checkDoneAddBug = true;
                        })
                        .catch((error) => {
                            console.log(error, "kdfmene")
                        });
                })
                .catch((error: any) => {
                    console.log(error, "ajsdjhasd")
                })

            if (!checkDoneAddBug) {
                firestore()
                    .collection("Bugs")
                    .doc(currentScreen + dayjs.utc().format("_DD_MM_YY"))
                    .set({
                        device: StorageHelper.getBugDevice(),
                        status: FirebaseConstant.ETypeOfBug.New,
                        user: StorageHelper.getBugOwnerId(),
                        time: timeMark,
                        isDevSite: (new MMKV().getString("env") || (__DEV__ ? EEnvironment.DEVELOP : EEnvironment.PRODUCT)) === EEnvironment.DEVELOP,
                        detail: StorageHelper.getBugLog(),
                        type: typeError,
                        error: error,
                        stackTrace: stackTrace
                    })
                    .then(() => {
                        console.log("Bug added!");
                    })
                    .catch((error) => {
                        console.log(error, "sdjsf")
                    });
            }
        }).catch((error: any) => {
            console.log(error, "errorjmdbmvb")
        })


    }

}

export default FirebaseHelper
