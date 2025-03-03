import * as React from 'react';
import {useMemo} from 'react';
import {Linking, Pressable, PressableProps} from 'react-native';

import BImage from 'components/base/image.base';
import BText from 'components/base/text.base';
import SystemHelper from 'helpers/system.helper';
import {PreviewData, WebHelper} from 'helpers/web.helper';

enum EBPreviewUrl {
  Title = 'BPreviewUrl.Title',
  Description = 'BPreviewUrl.Description',
  Image = 'BPreviewUrl.Image',
}

export interface IBPreviewUrlComponentProps extends PressableProps {
  onPreviewDataFetched?: (previewData: PreviewData) => void;
  previewData?: PreviewData;
  requestTimeout?: number;
  url: string;
}

const BPreviewUrlComponent = React.memo(
  ({
    onPreviewDataFetched,
    previewData,
    requestTimeout = 5000,
    url,
    children,
    ...props
  }: IBPreviewUrlComponentProps) => {
    const [data, setData] = React.useState(previewData);

    React.useEffect(() => {
      let isCancelled = false;
      if (previewData) {
        setData(previewData);
        return;
      }

      const fetchData = async () => {
        setData(undefined);
        const newData = await WebHelper.getPreviewData(url, requestTimeout);
        // Set data only if component is still mounted
        /* istanbul ignore next */
        if (!isCancelled) {
          // No need to cover LayoutAnimation
          /* istanbul ignore next */
          setData(newData);
          onPreviewDataFetched?.(newData);
        }
      };

      fetchData();
      return () => {
        isCancelled = true;
      };
    }, [onPreviewDataFetched, previewData, requestTimeout, url]);

    const handlePress = () =>
      data?.link &&
      Linking.openURL(data.link).catch(() => console.log('ljafn'));

    const ContentPreview = useMemo(
      () =>
        SystemHelper.renderSpecialElement({
          children: children,
          props: {
            [EBPreviewUrl.Title]: {children: data?.title || ''},
            [EBPreviewUrl.Description]: {children: data?.description || ''},
            [EBPreviewUrl.Image]: {source: data?.image || ''},
          },
        }),
      [data, children],
    );

    return (
      <Pressable onPress={handlePress} {...props}>
        {ContentPreview}
      </Pressable>
    );
  },
);

const Title = (props: Omit<React.ComponentProps<typeof BText>, 'children'>) => (
  <BText children={''} {...props} />
);
Title.displayName = EBPreviewUrl.Title;

const Description = (
  props: Omit<React.ComponentProps<typeof BText>, 'children'>,
) => <BText children={''} {...props} />;
Description.displayName = EBPreviewUrl.Description;

const Image = (props: React.ComponentProps<typeof BImage>) => (
  <BImage {...props} />
);
Image.displayName = EBPreviewUrl.Image;

const BPreviewUrl = Object.assign(BPreviewUrlComponent, {
  Title: Title,
  Description: Description,
  Image: Image,
});

export default BPreviewUrl;
