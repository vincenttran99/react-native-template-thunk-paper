import React, {memo, useCallback, useMemo} from "react";
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import {useSystemTheme} from "helpers/hooks/system.hook";
import {ITheme} from "constants/system/ui/theme.constant";
import {MHS} from "constants/system/ui/sizes.ui.constant";
import {MD3Colors} from "react-native-paper";
import Animated, {interpolateColor, SharedValue, useAnimatedStyle} from "react-native-reanimated";
import isEqual from "react-fast-compare";

interface IDotSlideListComponentProps {
    translationValue: SharedValue<number>,
    numOfDots: number,
    containerStyle?: StyleProp<ViewStyle>,
    activeColor?: string,
    inactiveColor?: string,
    infinity?: boolean,
    size: number,
}

const DotSlideListComponent = ({
                                   translationValue,
                                   numOfDots,
                                   infinity = true,
                                   size,
                                   containerStyle,
                                   inactiveColor = MD3Colors.neutral90,
                                   activeColor
                               }: IDotSlideListComponentProps) => {
        const {styles, theme} = useSystemTheme(createStyles);
        const DATA = useMemo(() => [...Array(numOfDots)], [numOfDots])

        const Pagination = useCallback(({index}: { index: number }) => {
            if (infinity && (index === 0 || index === numOfDots - 1)) {
                return null
            }

            const stylePagination = useAnimatedStyle(() => {
                return {
                    backgroundColor: interpolateColor(translationValue.value,
                        [size * (index - 1), size * index, size * (index + 1)],
                        [inactiveColor, activeColor || theme.colors.inversePrimary, inactiveColor])
                };
            });

            return (
                <Animated.View style={[styles.containerPagination, stylePagination]}/>
            )
        }, [activeColor, inactiveColor, size, infinity])

        return (
            <View style={[styles.container, containerStyle]}>
                {DATA.map((_, index) => <Pagination key={index.toString()} index={index}/>)}
            </View>
        );
    }
;


const createStyles = (theme: ITheme) => {
    return StyleSheet.create({
        container: {
            gap: MHS._6,
            flexDirection: "row"
        },
        containerPagination: {
            width: MHS._10,
            aspectRatio: 1,
            borderRadius: MHS._16
        }
    });
};

export default memo(DotSlideListComponent, isEqual)