import React, {forwardRef, useCallback, useRef} from "react";
import {IconButton} from "react-native-paper";
import {GestureResponderEvent} from "react-native";
import FirebaseHelper from "helpers/firebase.helper";
import FirebaseConstant from "constants/firebase.constant";
import Animated from "react-native-reanimated";

interface IBIconButtonProps extends React.ComponentProps<typeof IconButton> {
    eventKey?: string;
    logWithTime?: boolean;
    firstLogOnly?: boolean;
}

/**
 * A custom button component that extends the functionality of the React Native Paper Button component.
 * It provides additional features such as event logging and tracking of whether the button has already been logged.
 *
 * @param {IBIconButtonProps} props - The props for the BButton component.
 * @param {Function} props.onPress - The function to be called when the button is pressed.
 * @param {Function} props.onLongPress - The function to be called when the button is long pressed.
 * @param {string} props.eventKey - The event key to be used for logging.
 * @param {boolean} props.logWithTime - Whether to log the event with the current time.
 * @param {boolean} props.firstLogOnly - Whether to only log the event once.
 * @returns {React.JSX.Element} The rendered BButton component.
 */
const BIconButton = (({
                          onPress,
                          onLongPress,
                          eventKey,
                          logWithTime = true,
                          firstLogOnly = true,
                          ...props
                      }: IBIconButtonProps, _: any) => {

    const isAlreadyLogged = useRef<boolean>(false);

    const onPressButton = useCallback((e: GestureResponderEvent) => {
        if (eventKey && ((firstLogOnly && !isAlreadyLogged.current) || !firstLogOnly)) {
            isAlreadyLogged.current = false;
            FirebaseHelper.logEventAnalytics({
                event: `${FirebaseConstant.EAnalyticsEvent.BTN}_${eventKey}`,
                logWithTime
            });
        }
        onPress?.(e);
    }, [onPress, eventKey, firstLogOnly]);

    const onLongPressButton = useCallback((e: GestureResponderEvent) => {
        if (eventKey && ((firstLogOnly && !isAlreadyLogged.current) || !firstLogOnly)) {
            isAlreadyLogged.current = false;
            FirebaseHelper.logEventAnalytics({
                event: `${FirebaseConstant.EAnalyticsEvent.BTN}_${eventKey}_l`,
                logWithTime
            });
        }
        onLongPress?.(e);
    }, [onLongPress, eventKey, firstLogOnly]);

    return <IconButton onPress={onPressButton} onLongPress={onLongPressButton} {...props} />;
})


export const BIconButtonAni = Animated.createAnimatedComponent(forwardRef(BIconButton))
export default BIconButton;