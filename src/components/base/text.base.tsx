import React, {forwardRef, memo} from "react";
import ObjectHelper from "helpers/object.helper";
import {FlexAlignType} from "react-native";
import {customText} from 'react-native-paper'
import isEqual from "react-fast-compare";
import Animated from "react-native-reanimated";

const Text = customText<'bodyNano' | 'bodyMicro' | 'bodyTiny'>()


interface IBTextProps extends React.ComponentProps<typeof Text> {
    fontWeight?: "bold" | "normal" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | undefined,
    fontSize?: number,
    color?: string,
    fontStyle?:  "normal" | "italic" | undefined,
    textAlign?: "center" | "auto" | "left" | "right" | "justify" | undefined,
    textAlignVertical?: "center" | "auto" | "top" | "bottom" | undefined,
    alignSelf?: "auto" | FlexAlignType | undefined,
    textDecorationLine?: "none" | "underline" | "line-through" | "underline line-through"
}

const BText = (({
                    alignSelf,
                    fontWeight,
                    fontSize,
                    color,
                    textAlign,
                    fontStyle,
                    textAlignVertical,
                    style,
                    textDecorationLine,
                    ...props
                }: IBTextProps, _: any): React.JSX.Element => {
    return <Text {...props}
                 allowFontScaling={false}
                 style={[ObjectHelper.removeUndefinedProperties({
                     alignSelf,
                     fontWeight,
                     fontSize,
                     fontStyle,
                     color,
                     textAlign,
                     textAlignVertical,
                     textDecorationLine
                 }), style]}/>;
})

export const BTextAni = Animated.createAnimatedComponent(forwardRef(BText))
export default memo(BText, isEqual)