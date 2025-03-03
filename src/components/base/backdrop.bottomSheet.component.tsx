import {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {BottomSheetDefaultBackdropProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import React from 'react';

export default function BackdropBottomSheetComponent(
  props: BottomSheetDefaultBackdropProps,
) {
  return (
    <BottomSheetBackdrop
      style={{zIndex: 999}}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      {...props}
    />
  );
}
