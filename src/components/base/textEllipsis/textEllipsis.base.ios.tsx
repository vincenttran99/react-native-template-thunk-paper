import React, {memo, useCallback, useLayoutEffect, useRef, useState} from "react";
import {Text} from "react-native-paper";
import {NativeSyntheticEvent, StyleProp, StyleSheet, TextLayoutEventData, TextStyle, View} from "react-native";
import BText from "components/base/text.base";
import languages from "constants/system/languages";
import {BStyle} from "constants/system/ui/styles.constant";

interface IBTextProps extends React.ComponentProps<typeof Text> {
    numberOfLines: number;
    children: string;

    /**
     * Style for "Show more" or "Show less" text at the end of the string.
     */
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
    const lengthNeedToCutRef = useRef(languages.showMore.length + 4);
    const isDoneCalculateRef = useRef(false);
    const isPropsChangeRef = useRef(false);

    useLayoutEffect(() => {
        isPropsChangeRef.current = true;
        textRef.current = children;
        setStateForReRender(old => !old);

        return (() => {
            isDoneCalculateRef.current = false;
        });
    }, [children, style, styleReadMoreText, numberOfLines]);


    useLayoutEffect(() => {
        lengthNeedToCutRef.current = languages.showMore.length + 4;
    }, [languages.showMore]);

    const onTextLayoutOverride = useCallback((event: NativeSyntheticEvent<TextLayoutEventData>) => {
        if (isDoneCalculateRef.current) {
            return;
        }

        isDoneCalculateRef.current = true;
        isPropsChangeRef.current = false;
        if (event.nativeEvent?.lines?.length >= numberOfLines) {
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
    }, [numberOfLines]);

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
        <View style={BStyle.fullWidth}>
            <BText
                // onTextLayout={onTextLayoutOverride}
                numberOfLines={isNeedReadMore && !isPropsChangeRef.current ? undefined : numberOfLines}
                style={[{width: "100%"}, style, {opacity: isDoneCalculateRef.current ? StyleSheet.flatten(style || {})?.opacity : 0}]}
                {...props} >
                {textRef.current}
                {
                    isNeedReadMore &&
                    <BText onPress={switchShowStatus} style={styleReadMoreText}>
                        {isShowAll ? " " + languages.showLess : languages.showMore}
                    </BText>
                }
            </BText>
            {
                (!isDoneCalculateRef.current) ?
                    <BText onTextLayout={onTextLayoutOverride}
                           disabled
                           style={[{width: "100%"}, style, {position: "absolute", opacity: 0, zIndex: -1000}]}
                           {...props} children={children}/>
                    :
                    null
            }
        </View>

    );
}

export default memo(BTextEllipsis)