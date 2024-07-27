import React, {forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef} from "react";
import {FlatList, ImageStyle, Pressable, StyleProp, View, ViewStyle, ViewToken} from "react-native";
import Animated, {SharedValue, useAnimatedScrollHandler, useSharedValue} from "react-native-reanimated";
import isEqual from "react-fast-compare";
import DotSlideListComponent from "components/list/dotSlide.list.component";
import BImage from "components/base/image.base";
import {ImageContentFit} from "expo-image";

interface IIHorizontalSlideItem {
    image: string | number;

    [key: string]: any;
}

interface IHorizontalSlideListComponentProps {
    images: IIHorizontalSlideItem[],
    onPressItem?: (item: IIHorizontalSlideItem) => void,
    style?: StyleProp<ViewStyle>
    contentContainerStyle?: StyleProp<ViewStyle>
    width: number,
    height: number,
    imageStyle?: StyleProp<ImageStyle>,
    infinity?: boolean
    containerDotStyle?: StyleProp<ViewStyle>,
    activeDotColor?: string,
    inactiveDotColor?: string,
    autoPlay?: boolean
    duration?: number
    havePagination?: boolean
    translationXParent?: SharedValue<number>
    contentFit?: ImageContentFit
    onViewableItemsChanged?: ((info: {
        viewableItems: ViewToken[],
        changed: ViewToken[]
    }) => void) | SharedValue<((info: {
        viewableItems: ViewToken[],
        changed: ViewToken[]
    }) => void) | null | undefined> | null
}

const HorizontalSlideListComponent = (({
                                           images,
                                           containerDotStyle,
                                           activeDotColor,
                                           inactiveDotColor,
                                           style,
                                           onViewableItemsChanged,
                                           width,
                                           translationXParent = useSharedValue(0),
                                           autoPlay = false,
                                           infinity = true,
                                           height,
                                           contentFit = 'cover',
                                           havePagination = true,
                                           imageStyle,
                                           duration = 3000,
                                           onPressItem,
                                           contentContainerStyle
                                       }: IHorizontalSlideListComponentProps, ref: any) => {
    const translationX = useSharedValue(0);
    const listRef = useRef<FlatList>(null)
    const DATA = useMemo(() => infinity ? [images[images.length - 1], ...images, images[0]] : images, [images, infinity])
    const intervalPlayRef = useRef<NodeJS.Timeout>()

    useImperativeHandle(
        ref,
        () => ({
            scrollToIndex
        }),
        []
    );

    const scrollToIndex = useCallback((params: {animated?: boolean | null | undefined, index: number, viewOffset?: number | undefined, viewPosition?: number | undefined})=>{
        listRef.current?.scrollToIndex(params)
    },[])

    useEffect(() => {
        if (autoPlay) {
            intervalPlayRef.current = setInterval(() => {
                if (!infinity && translationX.value >= width * (DATA.length - 2) && intervalPlayRef.current) {
                    clearInterval(intervalPlayRef.current)
                }

                listRef.current?.scrollToOffset({
                    offset: infinity ? translationX.value + width : Math.min(translationX.value + width, width * (DATA.length - 1)),
                    animated: true
                })
            }, duration)
        }

        return (() => {
            if (intervalPlayRef.current) {
                clearInterval(intervalPlayRef.current)
            }
        })
    }, [autoPlay, duration, infinity, DATA.length, width]);

    const renderPage = useCallback(({item}: { item: IIHorizontalSlideItem }) => {
        return (
            <Pressable onPress={() => onPressItem?.(item)}>
                <BImage source={item.image}

                        style={[imageStyle, {width, height}]} contentFit={contentFit}/>
            </Pressable>
        )
    }, [width, contentFit])


    const scrollHandlerAnimation = useAnimatedScrollHandler((event) => {
        translationX.value = event.contentOffset.x;
        translationXParent.value = event.contentOffset.x;
    });

    const onMomentumScrollEnd = useCallback(() => {
        if (!infinity) {
            return
        }

        if (Math.round(translationX.value / width) === 0) {
            listRef.current?.scrollToIndex({index: DATA.length - 2, animated: false})
        }

        if (Math.round(translationX.value / width) === DATA.length - 1) {
            listRef.current?.scrollToIndex({index: 1, animated: false})
        }
    }, [width, DATA.length])

    const getItemLayout = useCallback((_: any, index: number) => (
        {length: width, offset: width * index, index}
    ), [width])

    return (
        <View>
            <Animated.FlatList
                style={[style, {width, height}]}
                onScroll={scrollHandlerAnimation}
                initialScrollIndex={infinity ? 1 : 0}
                ref={listRef}
                horizontal
                onViewableItemsChanged={onViewableItemsChanged}
                getItemLayout={getItemLayout}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                contentContainerStyle={contentContainerStyle}
                renderItem={renderPage}
                data={DATA}
                bounces={false}
                scrollEventThrottle={16}
                onMomentumScrollEnd={onMomentumScrollEnd}
            />

            {
                havePagination &&
                <DotSlideListComponent
                    containerStyle={containerDotStyle}
                    numOfDots={DATA.length}
                    activeColor={activeDotColor}
                    infinity={infinity}
                    inactiveColor={inactiveDotColor}
                    size={width}
                    translationValue={translationX}/>
            }

        </View>
    );
});

export default memo(forwardRef(HorizontalSlideListComponent), isEqual)