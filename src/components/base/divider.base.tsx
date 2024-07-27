import React, {forwardRef, memo, useMemo} from "react";
import {Divider} from "react-native-paper";
import Animated from "react-native-reanimated";
import isEqual from "react-fast-compare";
import {StyleSheet, View} from "react-native";
import {useSystemTheme} from "helpers/hooks/system.hook";
import {MHS} from "constants/system/ui/sizes.ui.constant";

interface IBDividerProps extends React.ComponentProps<typeof Divider> {
    type?: "solid" | "dotted" | "dashed"
}

const BDivider = (({type = "solid", style, bold, ...props}: IBDividerProps, _: any): React.JSX.Element => {
    const {theme} = useSystemTheme()
    const styleDashOrDot = useMemo(() => ({
        borderStyle: type,
        borderWidth: Number(StyleSheet.flatten(style || {})?.height || (bold ? MHS._1 : StyleSheet.hairlineWidth)),
        borderColor: StyleSheet.flatten(style || {})?.backgroundColor || theme.colors.outlineVariant,
        margin: -Number(StyleSheet.flatten(style || {})?.height || (bold ? MHS._1 : StyleSheet.hairlineWidth)),
        marginTop: 0,
        height: 0,
        backgroundColor: "#00000000"
    }), [style, type, bold])

    return (
        <View style={{overflow: 'hidden'}}>
            <Divider {...props} bold={bold} style={[style, (type === "solid" ? {} : styleDashOrDot)]}/>
        </View>
    )

})


export const BDividerAni = Animated.createAnimatedComponent(forwardRef(BDivider))
export default memo(BDivider, isEqual)

