import BChip from 'components/base/chip.base';
import {BStyle} from 'constants/system/ui/styles.constant';
import {ILabelValue} from 'models/system.model';
import React, {useCallback} from 'react';
import {Control, RegisterOptions, useController} from 'react-hook-form';
import {StyleProp, View, ViewStyle} from 'react-native';
import {Chip, HelperText} from 'react-native-paper';

export interface IFChipElement extends ILabelValue {
  icon?: string;
}

interface IFChipSelectProps {
  control: Control<any>;
  name: string;
  defaultValue?: IFChipElement[];
  hint?: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  rules?: Omit<
    RegisterOptions<any, string>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
  initData: IFChipElement[];
  onValueChange?: (values: IFChipElement[]) => void;
  multi?: boolean;
  chipProps?: React.ComponentProps<typeof Chip>;
}

/**
 * FTextInput is Form TextInput
 * @param control
 * @param info
 * @param rules
 * @param defaultValue
 * @param name
 * @param onChangeText
 * @param props
 * @constructor
 */
export default function FChipSelect({
  control,
  hint,
  rules,
  defaultValue = [],
  name,
  onValueChange,
  initData = [],
  style,
  multi = false,
  containerStyle = {},
  chipProps,
  ...props
}: IFChipSelectProps): React.JSX.Element {
  const {field, fieldState, formState} = useController({
    control: control,
    defaultValue: defaultValue,
    name,
    rules,
  });

  const onValueChangeSwitch = useCallback(
    (valueSelected: IFChipElement) => {
      let newValues = valueSelected;
      if (multi) {
        let indexOfChip = field.value?.findIndex(
          (item: IFChipElement) => item?.value === valueSelected?.value,
        );
        if (indexOfChip === -1) {
          field.onChange?.([...field.value, newValues]);
          onValueChange?.([...field.value, newValues]);
        } else {
          let newArr = [...field.value];
          newArr.splice(indexOfChip, 1);
          field.onChange?.(newArr);
          onValueChange?.(newArr);
        }
      } else {
        field.onChange?.([valueSelected]);
        onValueChange?.([valueSelected]);
      }
    },
    [field, multi],
  );

  const renderChip = (item: IFChipElement) => {
    let selected =
      field.value.findIndex(
        (chip: IFChipElement) => chip?.value === item?.value,
      ) !== -1;
    return (
      <BChip
        selected={selected}
        key={item.value}
        onPress={() => onValueChangeSwitch(item)}
        showSelectedOverlay
        mode={selected ? 'flat' : 'outlined'}
        {...chipProps}
        icon={item?.icon}>
        {item?.label}
      </BChip>
    );
  };

  return (
    <View style={[BStyle.fullWidth, style]}>
      <View style={[BStyle.centerRowVGap6, containerStyle]}>
        {initData.map(renderChip)}
      </View>

      {hint ? (
        <HelperText type={fieldState.invalid ? 'error' : 'info'} visible>
          {hint}
        </HelperText>
      ) : rules !== undefined && fieldState.error?.message ? (
        <HelperText type={'error'} visible={fieldState.invalid}>
          {fieldState.error?.message}
        </HelperText>
      ) : null}
    </View>
  );
}
