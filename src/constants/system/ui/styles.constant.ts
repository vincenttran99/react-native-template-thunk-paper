import {StyleSheet} from "react-native";

export const BStyle = StyleSheet.create({
  fullWidth:{
    width: "100%"
  },
  fullHeight:{
    height: "100%"
  },
  flex1: {
    flex: 1
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  /**
   * Style for row
   */
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  centerRowV: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerRowVBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  centerRowVAround: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  centerRowVEvenly: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  centerRowVEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  centerRowH: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
})
