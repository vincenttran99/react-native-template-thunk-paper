import {Image} from 'expo-image';
import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';

const BLUR_HASH = {blurhash: 'LASE7~PbUyqJqEQpeTugQUn5tSkq'};

interface IBImageProps extends React.ComponentProps<typeof Image> {
  width?: number;
  height?: number;
  round?: boolean;
  hasBlur?: boolean;
}

export default function BImage({
  width,
  hasBlur = true,
  height,
  round,
  style,
  transition,
  ...props
}: IBImageProps): React.JSX.Element {
  const styleImage = useMemo(() => {
    let currentWidth = width || StyleSheet.flatten(style || {})?.width;
    let currentHeight =
      height ||
      StyleSheet.flatten(style || {})?.height ||
      (typeof currentWidth === 'number' ? currentWidth : undefined);
    return {
      width: currentWidth,
      height: currentHeight,
      borderRadius: round
        ? Math.max(Number(currentWidth) || 0, Number(currentHeight) || 0)
        : StyleSheet.flatten(style || {})?.borderRadius,
    };
  }, [style, width, height, round]);

  return (
    <Image
      {...props}
      transition={transition || 300}
      placeholder={hasBlur ? BLUR_HASH : undefined}
      style={[style, styleImage]}
    />
  );
}
