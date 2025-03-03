import BButton from 'components/base/button.base';
import {MHS} from 'constants/system/ui/sizes.ui.constant';
import {ITheme} from 'constants/system/ui/theme.constant';
import {useSystemTheme} from 'helpers/hooks/system.hook';
import {ILabelValue} from 'models/system.model';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Menu} from 'react-native-paper';

interface IBMenuSelectProps {
  defaultValue?: ILabelValue;
  disabled?: boolean;
  initData: ILabelValue[];
  onValueChange?: (value: ILabelValue) => void;
  buttonProps?: Omit<React.ComponentProps<typeof BButton>, 'children'>;
}

export default function BMenuSelect({
  defaultValue,
  disabled,
  buttonProps,
  initData = [],
  onValueChange,
}: IBMenuSelectProps): React.JSX.Element {
  const {styles} = useSystemTheme(createStyles);

  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [data, setData] = useState<ILabelValue[]>(initData);
  const [valueSelected, setValueSelected] = useState<ILabelValue>(
    defaultValue || initData?.[0],
  );

  useEffect(() => {
    setData(initData);
  }, [initData]);

  const openMenu = useCallback(() => setMenuVisible(true), []);
  const closeMenu = useCallback(() => setMenuVisible(false), []);

  const onPressItem = useCallback(
    (value: ILabelValue) => {
      onValueChange?.(value);
      setValueSelected(value);
      closeMenu();
    },
    [onValueChange],
  );

  const renderItem = useCallback(
    (item: ILabelValue) => {
      return (
        <Menu.Item
          titleMaxFontSizeMultiplier={1}
          key={item.value}
          onPress={() => onPressItem(item)}
          title={item.label}
        />
      );
    },
    [valueSelected],
  );

  return (
    <Menu
      visible={menuVisible}
      onDismiss={closeMenu}
      anchor={
        <BButton
          disabled={disabled}
          size={'tiny'}
          labelStyle={styles.labelStyle}
          style={styles.btnStyle}
          mode={'elevated'}
          onPress={openMenu}
          {...buttonProps}>
          {valueSelected?.label}
        </BButton>
      }>
      {data.map(renderItem)}
    </Menu>
  );
}

const createStyles = (theme: ITheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    labelStyle: {
      marginHorizontal: MHS._10,
      marginVertical: MHS._4,
    },
    btnStyle: {
      borderRadius: MHS._6,
    },
  });
};
