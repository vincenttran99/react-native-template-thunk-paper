import BText from 'components/base/text.base';
import React, {forwardRef, useImperativeHandle, useState} from 'react';

interface IBTypingTextProps
  extends Omit<React.ComponentProps<typeof BText>, 'children'> {}

const BTypingText = forwardRef((props: IBTypingTextProps, ref: any) => {
  const [textMessageShow, setTextMessageShow] = useState('');

  useImperativeHandle(ref, () => ({
    setText: (text: string) => {
      setTextMessageShow(text);
    },
  }));

  if (!textMessageShow) {
    return null;
  }

  return <BText {...props}>{textMessageShow}</BText>;
});

export default BTypingText;
