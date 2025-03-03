import React, {useEffect, useState} from 'react';
import {ViewProps} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

interface IBLazyProps extends ViewProps {
  timeRender: number;
  haveIndicator?: boolean;
}

const BLazy = ({haveIndicator = true, ...props}: IBLazyProps) => {
  const [allowRender, setAllowRender] = useState(false);

  useEffect(() => {
    let timeout = setTimeout(() => {
      setAllowRender(true);
    }, props.timeRender);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  if (!allowRender) {
    return haveIndicator ? <ActivityIndicator /> : null;
  }

  return props.children;
};

export default BLazy;
