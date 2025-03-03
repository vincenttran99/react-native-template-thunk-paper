import BChip from 'components/base/chip.base';
import {FontSize} from 'constants/system/ui/sizes.ui.constant';
import {BStyle} from 'constants/system/ui/styles.constant';
import {ITheme} from 'constants/system/ui/theme.constant';
import {useSystemTheme} from 'helpers/hooks/system.hook';
import {ILabelValue} from 'models/system.model';
import React, {useCallback, useState} from 'react';
import {
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

export interface IHorizontalOptionsListComponentProps extends ScrollViewProps {
  data: ILabelValue[];
  initIndex?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  itemContainerStyle?: StyleProp<ViewStyle>;
  onItemSelected?: (item: ILabelValue) => void;
}

export default function HorizontalOptionsListComponent({
  data,
  initIndex = 0,
  contentContainerStyle,
  itemContainerStyle,
  onItemSelected,
}: IHorizontalOptionsListComponentProps) {
  const {styles, theme} = useSystemTheme(createStyles);
  const [selectedItem, setSelectedItem] = useState<ILabelValue>(
    data?.[initIndex],
  );

  const pressItem = useCallback((item: ILabelValue) => {
    setSelectedItem(item);
    onItemSelected?.(item);
  }, []);

  const renderTime = useCallback(
    (item: ILabelValue, index: number) => {
      let isSelected = selectedItem.value === item.value;
      return (
        <BChip
          style={[
            {alignItems: 'center', justifyContent: 'center'},
            itemContainerStyle,
          ]}
          selected={isSelected}
          onPress={() => pressItem(item)}
          mode={isSelected ? 'flat' : 'outlined'}
          showSelectedOverlay
          key={index.toString()}
          textStyle={{fontSize: FontSize._10}}>
          {item.label}
        </BChip>
      );
    },
    [selectedItem],
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        {
          ...BStyle.centerRowVGap6,
        },
        contentContainerStyle,
      ]}>
      {data.map(renderTime)}
    </ScrollView>
  );
}

const createStyles = (theme: ITheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
  });
};
