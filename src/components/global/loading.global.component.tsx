import React, {forwardRef, memo, useCallback, useImperativeHandle, useRef, useState} from "react";
import {View} from "react-native";
import {Device} from "constants/system/device.constant";
import {ActivityIndicator, MD2Colors} from "react-native-paper";


export interface ILoadingGlobalComponentRef {
  showLoading: (autoHide: boolean, duration?: number) => void;
  hideLoading: Function;
}

function LoadingGlobalComponent(_: any, ref: React.ForwardedRef<ILoadingGlobalComponentRef>) {

  const [isLoading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useImperativeHandle(
    ref,
    () => ({
      showLoading,
      hideLoading
    }),
    []
  );

  const showLoading = useCallback((autoHide: boolean = true, duration: number = 10000) => {
    setLoading(true);
    /**
     * Auto hide Loading if loading more than 10 seconds
     */
    if (autoHide) {
      timeoutRef.current = setTimeout(() => {
        setLoading(false);
        clearTimeout(timeoutRef.current);
      }, duration);
    }
  }, []);

  const hideLoading = useCallback(() => {
    setLoading(false);
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <View style={{ position: "absolute" }}>
      <View style={{
        width: Device.width,
        height: Device.heightScreen,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <ActivityIndicator animating={true} color={MD2Colors.red800} />
      </View>
    </View>
  );
}


export default memo(forwardRef(LoadingGlobalComponent));
