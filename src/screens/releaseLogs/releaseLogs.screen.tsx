import React, {useCallback} from "react";
import {FlatList, StyleSheet} from "react-native";
import {useSystemTheme} from "helpers/hooks/system.hook";
import {HS, MHS, VS} from "constants/system/ui/sizes.ui.constant";
import {ITheme} from "constants/system/ui/theme.constant";
import {Device} from "constants/system/device.constant";
import dataReleaseNote from "../../../scripts/releaseLogs.json";
import {Surface} from "react-native-paper";
import BText from "components/base/text.base";

const ReleaseLogsScreen = () => {
  const { styles, theme } = useSystemTheme(createStyles);


  const renderItem = useCallback(({ item }: { item: any }) => {
    return (
      <Surface style={styles.itemContainer} elevation={2}>
        <BText variant={"bodyLarge"}>{item?.content}</BText>
        <BText variant={"bodyMedium"}>{item?.date}</BText>
      </Surface>
    );
  }, []);

  return (
    <FlatList
      data={dataReleaseNote}
      contentContainerStyle={styles.contentContainerStyle}
      renderItem={renderItem}
      removeClippedSubviews
    />
  );
};


const createStyles = (theme: ITheme) => {
  return StyleSheet.create({
    contentContainerStyle: {
      width: Device.width,
      paddingHorizontal: HS._6,
      gap: MHS._12,
      paddingVertical: VS._12
    },
    itemContainer: {
      width: "100%",
      backgroundColor: theme.colors.background,
      borderRadius: MHS._12,
      paddingHorizontal: MHS._12,
      paddingVertical: MHS._8,
      gap: 10
    }
  });
};

export default ReleaseLogsScreen;
