import SystemHelper from "helpers/system.helper";

const moderateHorizontalScale = SystemHelper.moderateHorizontalScale

interface Shadow {
  shadowColor: string,
  shadowOffset: {
    width: number,
    height: number,
  },
  shadowOpacity: number,
  shadowRadius: number,

  elevation: number,
}

export const Shadow7: Shadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: moderateHorizontalScale(4, 1),
  },
  shadowOpacity: 0.30,
  shadowRadius: moderateHorizontalScale(4.65, 1),

  elevation: 7,
};

export const Shadow5: Shadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: moderateHorizontalScale(3, 1),
  },
  shadowOpacity: 0.25,
  shadowRadius: moderateHorizontalScale(3.65, 1),

  elevation: 5,
};

export const Shadow3: Shadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: moderateHorizontalScale(2, 1),
  },
  shadowOpacity: 0.2,
  shadowRadius: moderateHorizontalScale(2.22, 1),

  elevation: 3,
};

export const Shadow2: Shadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: moderateHorizontalScale(2, 1),
  },
  shadowOpacity: 0.4,
  shadowRadius: moderateHorizontalScale(1.41, 1),

  elevation: 2,
};

export const Shadow1: Shadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: moderateHorizontalScale(1, 1),
  },
  shadowOpacity: 0.1,
  shadowRadius: moderateHorizontalScale(0.7, 1),

  elevation: 1,
};

export const Shadow0: Shadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0,
  shadowRadius: 0,

  elevation: 0,
};
