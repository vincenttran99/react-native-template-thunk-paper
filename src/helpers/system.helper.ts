// import analytics from "@react-native-firebase/analytics";
import {Device} from 'constants/system/device.constant';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import React from 'react';
import DeviceInfo from 'react-native-device-info';

dayjs.extend(isBetween);

namespace SystemHelper {
  /**
   * Copy from
   * https://github.com/nirsky/react-native-size-matters
   */
  const [shortDimension, longDimension] =
    Device.width > Device.height
      ? [Device.height, Device.width]
      : [Device.width, Device.height];
  const guidelineBaseWidth = 350;
  const guidelineBaseHeight = 680;

  /**
   * horizontalScale
   * @param size
   * Scale by screen horizontal ratio for size compensation
   */
  export function horizontalScale(size: number) {
    return (size * shortDimension) / guidelineBaseWidth;
  }

  /**
   * verticalScale
   * @param size
   * Scale by screen vertical ratio for size compensation
   */
  export function verticalScale(size: number) {
    return (size * longDimension) / guidelineBaseHeight;
  }

  /**
   * moderateHorizontalScale
   * @param size
   * @param factor
   * Scale by screen horizontal ratio with factor for size compensation. Default factor is 0.5.
   */
  export function moderateHorizontalScale(size: number, factor = 0.5) {
    return size + (horizontalScale(size) - size) * factor;
  }

  /**
   * moderateVerticalScale
   * @param size
   * @param factor
   * Scale by screen vertical ratio with factor for size compensation. Default factor is 0.5.
   */
  export function moderateVerticalScale(size: number, factor = 0.5) {
    return size + (verticalScale(size) - size) * factor;
  }

  /**
   * Short name
   */
  export const hs = horizontalScale;
  export const vs = verticalScale;
  export const mhs = moderateHorizontalScale;
  export const mvs = moderateVerticalScale;

  export const checkVersion = (version: string) => {
    if (!version) {
      return false;
    }
    if (Device.isAndroid) {
      return Number(DeviceInfo.getBuildNumber()) < Number(version);
    }
    const arrayCurrent = DeviceInfo.getVersion().split('.');
    const arrayVersion = version.split('.');

    let index = 0;
    for (let i = 0; i < arrayCurrent.length; i++) {
      const element = arrayCurrent[i];
      if (Number(element) >= Number(arrayVersion?.[i])) {
        index++;
      }
    }
    if (index === arrayCurrent.length) {
      return false;
    }
    return true;
  };

  export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Recursively processes and renders special elements based on given filters and properties.
   *
   * @param {React.ReactNode} children - The children elements to be rendered.
   * @param {(string | boolean)[]} [renderOnly] - The list of element display names or booleans to render only.
   * @param {{ [key: string]: string }} [props={}] - Additional properties to pass to the children elements.
   *
   * @returns {React.ReactNode[]} - The filtered and modified children elements.
   */
  export function renderSpecialElement({
    children,
    props = {},
  }: {
    children: React.ReactNode;
    props?: {[key: string]: {[key: string]: any}};
  }): React.ReactNode[] {
    let renderOnly = Object.keys(props);
    // Recursive function to process each child
    const processChild = (child: React.ReactNode): React.ReactNode => {
      // If child is an array, recursively process each element
      // @ts-ignore
      if (React.Children.toArray(child.props.children).length > 0) {
        // @ts-ignore
        return React.cloneElement(
          child,
          child.props,
          React.Children.toArray(child.props.children).map(processChild),
        );
      }

      // If child is a valid React element
      if (React.isValidElement(child)) {
        if (!React.isValidElement(child)) {
          return child;
        }

        // Get the display name of the child element type
        const displayName = (child.type as any).displayName;

        // Check if the element should be included
        if (renderOnly && !renderOnly.includes(displayName)) {
          return null;
        }

        // Recursively process the child elements
        return React.cloneElement(child, props?.[displayName]);
      }

      // Return the original child if it is not a valid React element
      return child;
    };

    // Convert children to an array and process each child
    return React.Children.toArray(children).map(processChild);
  }
}

export default SystemHelper;
