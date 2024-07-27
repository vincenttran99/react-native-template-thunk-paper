import React, {memo, useMemo} from "react";
import {Image} from 'expo-image';
import isEqual from "react-fast-compare";
import {StyleSheet} from "react-native";

const BLUR_HASH = {blurhash: "LASE7~PbUyqJqEQpeTugQUn5tSkq"}


interface IBImageProps extends React.ComponentProps<typeof Image> {
    width?: number
    height?: number
    round?: boolean
}

function BImage({width, height, round, style, ...props}: IBImageProps): React.JSX.Element {

    const styleImage = useMemo(() => {
        let currentWidth = width || StyleSheet.flatten(style || {})?.width
        let currentHeight = height || StyleSheet.flatten(style || {})?.height
        return ({
            width: currentWidth,
            height: currentHeight,
            borderRadius: round ? Math.max(width || 0, height || 0) : StyleSheet.flatten(style || {})?.borderRadius,
        })
    }, [style, width, height, round])

    return <Image transition={800} {...props} placeholder={BLUR_HASH} style={[style, styleImage]}/>
}


export default memo(BImage, isEqual)