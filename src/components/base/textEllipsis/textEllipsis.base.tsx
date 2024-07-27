import React, {memo, useCallback, useLayoutEffect, useRef, useState} from "react";
import {Text} from "react-native-paper";
import {NativeSyntheticEvent, StyleProp, StyleSheet, TextLayoutEventData, TextStyle} from "react-native";
import BText from "components/base/text.base";
import languages from "constants/system/languages";

interface IBTextProps extends React.ComponentProps<typeof Text> {
  numberOfLines: number;
  children: string;
  styleReadMoreText?: StyleProp<TextStyle>;
}

/**
 * You should provide a width for this component.
 * @param numberOfLines
 * @param onTextLayout
 * @param children
 * @param styleReadMoreText
 * @param style
 * @param props
 * @constructor
 */
const BTextEllipsis = ({
                                        numberOfLines,
                                        onTextLayout,
                                        children,
                                        styleReadMoreText,
                                        style,
                                        ...props
                                      }: IBTextProps): React.JSX.Element => {

  const [isNeedReadMore, setIsNeedReadMore] = useState(false);
  const [_, setStateForReRender] = useState(false);
  const [isShowAll, setIsShowAll] = useState(false);
  const textRef = useRef(children);
  const shortTextRef = useRef(children);
  const lengthNeedToCutRef = useRef(languages.showMore.length + 6);
  const isDoneCalculateRef = useRef(false);
  const isPropsChangeRef = useRef(false);

  useLayoutEffect(() => {
    isPropsChangeRef.current = true;
    textRef.current = children;

    return (() => {
      isDoneCalculateRef.current = false;
    });
  }, [children, style, styleReadMoreText, numberOfLines]);

  useLayoutEffect(() => {
    lengthNeedToCutRef.current = languages.showMore.length + 6;
  }, [languages.showMore]);

  const onTextLayoutOverride = useCallback((event: NativeSyntheticEvent<TextLayoutEventData>) => {
    onTextLayout?.(event);

    if (isDoneCalculateRef.current) {
      return;
    }

    isDoneCalculateRef.current = true;
    isPropsChangeRef.current = false;
    if (event.nativeEvent?.lines?.length > numberOfLines) {
      let shortText = "";
      for (let i = 0; i < numberOfLines; i++) {
        shortText = shortText.concat(event.nativeEvent?.lines[i].text);
      }

      shortTextRef.current = shortText.slice(0, -lengthNeedToCutRef.current) + "... ";
      textRef.current = shortTextRef.current;
      setIsNeedReadMore(true);
    } else {
      setIsNeedReadMore(false);
    }

    setStateForReRender(old => !old);
  }, [onTextLayout, numberOfLines]);

  const switchShowStatus = useCallback(() => {
    if (isShowAll) {
      textRef.current = shortTextRef.current;
      setIsShowAll(false);
    } else {
      textRef.current = children;
      setIsShowAll(true);
    }
  }, [isShowAll, children]);

  return (
    <BText onTextLayout={onTextLayoutOverride}
           numberOfLines={isNeedReadMore && !isPropsChangeRef.current ? undefined : numberOfLines}
           style={[{ width: "100%" }, style, { opacity: isDoneCalculateRef.current ? StyleSheet.flatten(style || {})?.opacity : 0 }]}
           {...props} >
      {textRef.current}
      {
        isNeedReadMore &&
        <BText onPress={switchShowStatus} style={styleReadMoreText}>
          {isShowAll ? " " + languages.showLess : languages.showMore}
        </BText>
      }
    </BText>
  );
}

export default memo(BTextEllipsis)