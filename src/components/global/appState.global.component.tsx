// import {useAppSelector} from 'configs/store.config';
// import dayjs from 'dayjs';
// import GlobalHelper from 'helpers/globalHelper';
// import {useAPI} from 'helpers/hooks/api.hook';
// import {memo, useCallback, useEffect, useRef} from 'react';
// import {AppState, AppStateStatus} from 'react-native';

// const AppStateGlobalComponent = () => {
//   const refAppState = useRef(AppState.currentState);
//   const refTimePoint = useRef(dayjs());
//   const refSecondNeedToCall = useRef(43200); //12 hours
//   const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
//   const refIsAuthenticated = useRef(isAuthenticated);
//   const {callThunk, dispatch} = useAPI();

//   useEffect(() => {
//     refIsAuthenticated.current = isAuthenticated;
//   }, [isAuthenticated]);

//   const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
//     if (
//       refAppState.current.match(/inactive|background/) &&
//       nextAppState === 'active'
//     ) {
//       let timeOffApp = dayjs().diff(refTimePoint.current || dayjs(), 'second');
//       if (
//         timeOffApp >= refSecondNeedToCall.current &&
//         refIsAuthenticated.current
//       ) {
//         dispatch(setToken(undefined));
//         callThunk({
//           requestFunction: refreshTokenThunk,
//           actionFailed: () => {
//             GlobalHelper.showErrorSnackBar(
//               'Mạng yếu, không thể kết nối đến máy chủ',
//             );
//           },
//         });
//       }
//     }

//     if (nextAppState.match(/inactive|background/)) {
//       refTimePoint.current = dayjs();
//     }

//     refAppState.current = nextAppState;
//   }, []);

//   useEffect(() => {
//     const subscriptionAppState = AppState.addEventListener(
//       'change',
//       handleAppStateChange,
//     );

//     return () => {
//       subscriptionAppState.remove();
//     };
//   }, []);

//   return null;
// };

// export default memo(AppStateGlobalComponent);
