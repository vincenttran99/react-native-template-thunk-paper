import {BottomSheetFlatList, BottomSheetModal} from '@gorhom/bottom-sheet';
import BackdropBottomSheetComponent from 'components/base/backdrop.bottomSheet.component';
import BCheckBox from 'components/base/checkbox.base';
import BDivider from 'components/base/divider.base';
import BText from 'components/base/text.base';
import languages from 'constants/system/languages';
import {MHS} from 'constants/system/ui/sizes.ui.constant';
import {BStyle} from 'constants/system/ui/styles.constant';
import {ITheme} from 'constants/system/ui/theme.constant';
import {useSystemTheme} from 'helpers/hooks/system.hook';
import debounce from 'lodash.debounce';
import {ILabelValue} from 'models/system.model';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Control, RegisterOptions, useController} from 'react-hook-form';
import {Pressable, StyleSheet, View} from 'react-native';
import {HelperText, Searchbar, TextInput} from 'react-native-paper';

export interface ISingleSelectItem extends ILabelValue {
  [key: string]: any;
}

interface IFSingleSelectProps
  extends Omit<React.ComponentProps<typeof TextInput>, 'defaultValue'> {
  control: Control<any>;
  name: string;
  defaultValue?: {value: any; label?: string};
  hint?: string;
  rules?: Omit<
    RegisterOptions<any, string>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
  search?: boolean;
  searchPlaceHolder?: string;
  onChangeSearchValue?: (value: string) => Promise<ISingleSelectItem[]>;
  heightSelectBox?: string | number;
  initData: ISingleSelectItem[];
  onValueChange?: (value: ISingleSelectItem) => void;
  renderItem?: (
    item: ISingleSelectItem,
    currentValue: ISingleSelectItem,
    onPress: (value: ISingleSelectItem) => void,
  ) => React.JSX.Element;
}

export default function FSingleSelect({
  control,
  hint,
  rules,
  defaultValue,
  name,
  renderItem,
  onChangeText,
  disabled,
  search = false,
  searchPlaceHolder,
  onChangeSearchValue,
  heightSelectBox = '50%',
  initData = [],
  onValueChange,
  style,
  ...props
}: IFSingleSelectProps): React.JSX.Element {
  const {theme, styles} = useSystemTheme(createStyles);
  const {field, fieldState} = useController({
    control: control,
    defaultValue: defaultValue,
    name,
    rules,
  });
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [data, setData] = useState<ISingleSelectItem[]>(initData);
  useEffect(() => {
    setData(initData);
  }, [initData]);

  const showPicker = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, [field.value]);

  const onPressItem = useCallback(
    (value: ISingleSelectItem) => {
      onValueChange?.(value);
      field.onChange?.(value);
      bottomSheetModalRef.current?.dismiss();
    },
    [onValueChange],
  );

  const renderItemDefault = useCallback(
    ({item}: {item: ISingleSelectItem}) => {
      if (renderItem) {
        return renderItem(item, field?.value, onPressItem);
      }

      return (
        <Pressable style={styles.viewItem} onPress={() => onPressItem(item)}>
          <BText
            variant={'bodyLarge'}
            fontWeight={field?.value?.value === item.value ? 'bold' : 'normal'}
            color={
              field?.value?.value === item.value
                ? theme.colors.primary
                : theme.colors.text
            }>
            {String(item?.label || item?.value)}
          </BText>

          {field?.value?.value === item.value ? (
            <BCheckBox style={{borderRadius: 1000}} isChecked />
          ) : null}
        </Pressable>
      );
    },
    [field?.value, renderItem],
  );

  const SearchBar = useCallback(() => {
    const [searchQuery, setSearchQuery] = useState<string>('');

    const onSearch = useCallback(
      async (
        text: string,
        initData: ISingleSelectItem[],
        onChangeSearchValue?: (value: string) => Promise<ISingleSelectItem[]>,
      ) => {
        let valueSearch = text.trim().toLowerCase();
        if (valueSearch.length === 0) {
          setData(initData);
        } else {
          if (typeof onChangeSearchValue === 'function') {
            let newData = await onChangeSearchValue(valueSearch);
            setData(newData);
          } else {
            setData(() =>
              initData.filter(item =>
                item.label.toLowerCase().includes(valueSearch),
              ),
            );
          }
        }
      },
      [],
    );

    const onSearchDebounce = useCallback(
      debounce(onSearch, onChangeSearchValue ? 500 : 200),
      [],
    );

    const onChangeText = useCallback(
      (text: string) => {
        setSearchQuery(text);
        onSearchDebounce(text, initData, onChangeSearchValue);
      },
      [initData, onChangeSearchValue],
    );

    return (
      <Searchbar
        placeholder={searchPlaceHolder || languages.base.search}
        onChangeText={onChangeText}
        value={searchQuery}
        maxFontSizeMultiplier={1}
        allowFontScaling={false}
        style={styles.searchBar}
      />
    );
  }, [styles, initData, onChangeSearchValue]);

  const keyExtractor = useCallback(
    (_: any, index: number) => index.toString(),
    [],
  );

  return (
    <Pressable
      disabled={disabled}
      style={BStyle.fullWidth}
      onPress={showPicker}>
      <TextInput
        mode={'outlined'}
        {...props}
        style={[style, {textAlign: 'auto'}]}
        error={fieldState.invalid}
        value={
          field.value ? String(field.value?.label || field.value?.value) : ''
        }
        ref={field.ref}
        editable={false}
        allowFontScaling={false}
        maxFontSizeMultiplier={1}
        disabled={disabled}
        pointerEvents={'none'}
        right={
          <TextInput.Icon
            onPress={showPicker}
            icon={'arrow-down-drop-circle-outline'}
          />
        }
      />

      {hint ? (
        <HelperText type={fieldState.invalid ? 'error' : 'info'} visible>
          {hint}
        </HelperText>
      ) : rules !== undefined && fieldState.error?.message ? (
        <HelperText type={'error'} visible={fieldState.invalid}>
          {fieldState.error?.message}
        </HelperText>
      ) : null}

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={[heightSelectBox]}
        handleComponent={null}
        backdropComponent={BackdropBottomSheetComponent}
        style={styles.viewBottomSheet}
        onDismiss={() => setData(initData)}
        enableDynamicSizing={false}>
        <View style={BStyle.centerRowVBetween}>
          <BText variant={'titleMedium'}>{props.label}</BText>
          <Pressable onPress={() => bottomSheetModalRef.current?.dismiss()}>
            <BText color={theme.colors.primary}>{languages.base.close}</BText>
          </Pressable>
        </View>
        {search ? <SearchBar /> : null}
        <BottomSheetFlatList
          data={data}
          showsVerticalScrollIndicator={false}
          keyExtractor={keyExtractor}
          renderItem={renderItemDefault}
          contentContainerStyle={styles.contentContainerStyle}
          ItemSeparatorComponent={() => <BDivider />}
        />
      </BottomSheetModal>
    </Pressable>
  );
}

const createStyles = (theme: ITheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    viewItem: {
      paddingVertical: MHS._12,
      ...BStyle.centerRowVBetween,
    },
    viewBottomSheet: {
      paddingHorizontal: MHS._16,
      paddingTop: MHS._22,
    },
    contentContainerStyle: {
      paddingTop: MHS._12,
      paddingBottom: MHS._36,
    },
    searchBar: {
      marginTop: MHS._12,
      marginBottom: MHS._6,
    },
  });
};
