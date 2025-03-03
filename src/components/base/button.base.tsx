import {EAnalyticsEvent} from 'constants/firebase.constant';
import {FontSize, MHS} from 'constants/system/ui/sizes.ui.constant';
import FirebaseHelper from 'helpers/firebase.helper';
import React, {forwardRef, useCallback, useRef} from 'react';
import {GestureResponderEvent} from 'react-native';
import {Button} from 'react-native-paper';
import Animated from 'react-native-reanimated';

export interface IBButtonProps extends React.ComponentProps<typeof Button> {
  eventKey?: string;
  logWithTime?: boolean;
  firstLogOnly?: boolean;
  size?: 'large' | 'big' | 'medium' | 'small' | 'tiny' | 'micro' | 'nano';
  noMarginLabel?: boolean;
}

const BUTTON_STYLE = {
  large: {
    marginHorizontal: MHS._28,
    marginVertical: MHS._14,
    fontSize: FontSize._16,
  },
  big: {
    marginHorizontal: MHS._26,
    marginVertical: MHS._12,
    fontSize: FontSize._15,
  },
  medium: {
    marginHorizontal: MHS._24,
    marginVertical: MHS._10,
    fontSize: FontSize._14,
  },
  small: {
    marginHorizontal: MHS._22,
    marginVertical: MHS._8,
    fontSize: FontSize._13,
  },
  tiny: {
    marginHorizontal: MHS._20,
    marginVertical: MHS._6,
    fontSize: FontSize._12,
  },
  micro: {
    marginHorizontal: MHS._18,
    marginVertical: MHS._4,
    fontSize: FontSize._11,
  },
  nano: {
    marginHorizontal: MHS._16,
    marginVertical: MHS._2,
    fontSize: FontSize._10,
  },
  noMarginLabel: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
};

/**
 * A custom button component that extends the functionality of the React Native Paper Button component.
 * It provides additional features such as event logging and tracking of whether the button has already been logged.
 *
 * @param {IBButtonProps} props - The props for the BButton component.
 * @param {Function} props.onPress - The function to be called when the button is pressed.
 * @param {Function} props.onLongPress - The function to be called when the button is long pressed.
 * @param {string} props.eventKey - The event key to be used for logging.
 * @param {boolean} props.logWithTime - Whether to log the event with the current time.
 * @param {boolean} props.firstLogOnly - Whether to only log the event once.
 * @returns {React.JSX.Element} The rendered BButton component.
 */
const BButton = (
  {
    onPress,
    onLongPress,
    eventKey,
    logWithTime = false,
    firstLogOnly = true,
    size = 'medium',
    labelStyle,
    noMarginLabel,
    ...props
  }: IBButtonProps,
  _: any,
): React.JSX.Element => {
  const isAlreadyLogged = useRef<boolean>(false);

  const onPressButton = useCallback(
    (e: GestureResponderEvent) => {
      if (
        eventKey &&
        ((firstLogOnly && !isAlreadyLogged.current) || !firstLogOnly)
      ) {
        isAlreadyLogged.current = false;
        FirebaseHelper.logEventAnalytics({
          event: `${EAnalyticsEvent.BTN}_${eventKey}`,
          logWithTime,
        });
      }
      onPress?.(e);
    },
    [onPress, eventKey, firstLogOnly],
  );

  const onLongPressButton = useCallback(
    (e: GestureResponderEvent) => {
      if (
        eventKey &&
        ((firstLogOnly && !isAlreadyLogged.current) || !firstLogOnly)
      ) {
        isAlreadyLogged.current = false;
        FirebaseHelper.logEventAnalytics({
          event: `${EAnalyticsEvent.BTN}_${eventKey}_l`,
          logWithTime,
        });
      }
      onLongPress?.(e);
    },
    [onLongPress, eventKey, firstLogOnly],
  );

  return (
    <Button
      onPress={onPressButton}
      onLongPress={onLongPressButton}
      {...props}
      children={props.children}
      maxFontSizeMultiplier={1}
      labelStyle={[
        BUTTON_STYLE[size],
        noMarginLabel ? BUTTON_STYLE.noMarginLabel : {},
        labelStyle,
      ]}
    />
  );
};

export const BButtonAni = Animated.createAnimatedComponent(forwardRef(BButton));
export default BButton;
