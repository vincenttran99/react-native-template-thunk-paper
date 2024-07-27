import SystemHelper from "helpers/system.helper";

const mhs = SystemHelper.mhs;
const hs = SystemHelper.hs;
const vs = SystemHelper.vs;
const mvs = SystemHelper.mvs;

export const HIT_SLOP_EXPAND_20 = {top: mhs(20), left: mhs(20), right: mhs(20), bottom: mhs(20)};
export const HIT_SLOP_EXPAND_10 = {top: mhs(10), left: mhs(10), right: mhs(10), bottom: mhs(10)};

/**
 * Fontsize for text and icon
 */
export const FontSize = {
  //Default special size
  H1: mhs(28, 0.3),
  H2: mhs(28, 0.3) - 3,
  H3: mhs(28, 0.3) - 6,
  H4: mhs(28, 0.3) - 9,
  H5: mhs(28, 0.3) - 12,


  _2: mhs(2, 0.3),
  _10: mhs(10, 0.3),
  _11: mhs(11, 0.3),
  _12: mhs(12, 0.3),
  _13: mhs(13, 0.3),
  _14: mhs(14, 0.3),
  _15: mhs(15, 0.3),
  _16: mhs(16, 0.3),
  _18: mhs(18, 0.3),
  _20: mhs(20, 0.3),
  _22: mhs(22, 0.3),
  _24: mhs(24, 0.3),
  _26: mhs(26, 0.3),
  _28: mhs(28, 0.3),
  _30: mhs(30, 0.3),

};

/**
 * Scale by screen horizontal ratio for size compensation
 */
export const HS = {
  _1: hs(1),
  _4: hs(4),
  _6: hs(6),
  _12: hs(12),
  _20: hs(20),
  _24: hs(24),
  _48: hs(48),
  _72: hs(72),
};

/**
 * Scale by screen vertical ratio for size compensation
 */
export const VS = {
  _1: vs(1),
  _6: vs(6),
  _10: vs(10),
  _12: vs(12),
  _16: vs(16),
  _20: vs(20),
  _50: vs(50),
  _64: vs(64),
  _160: vs(160),
  _460: vs(460),
  _32: vs(32),
};

/**
 * Scale by screen horizontal ratio with factor is 0.5 for size compensation
 */
export const MHS = {
  _1: mhs(1),
  _2: mhs(2),
  _4: mhs(4),
  _5: mhs(5),
  _6: mhs(6),
  _7: mhs(7),
  _8: mhs(8),
  _9: mhs(9),
  _10: mhs(10),
  _12: mhs(12),
  _14: mhs(14),
  _16: mhs(16),
  _18: mhs(18),
  _20: mhs(20),
  _22: mhs(22),
  _24: mhs(24),
  _26: mhs(26),
  _28: mhs(28),
  _32: mhs(32),
  _36: mhs(36),
  _40: mhs(40),
  _44: mhs(44),
  _48: mhs(48),
  _52: mhs(52),
  _60: mhs(60),
  _68: mhs(68),
  _72: mhs(72),
  _80: mhs(80),
  _90: mhs(90),
  _100: mhs(100),
  _120: mhs(120),
  _140: mhs(140),
  _160: mhs(160)
};

/**
 * Scale by screen vertical ratio with factor is 0.5 for size compensation
 */
export const MVS = {
  _1: mvs(1),
  _16: mvs(16),
};
