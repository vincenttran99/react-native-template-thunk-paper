import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

import isEqual from 'react-fast-compare';
import {IImageInfo} from 'react-native-image-zoom-viewer/built/image-viewer.type';
import Orientation from 'react-native-orientation-locker';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import WebView from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';
// import VideoPreview from "screens/module/components/video.preview";
import BImage from 'components/base/image.base';
import BText from 'components/base/text.base';
import {Device} from 'constants/system/device.constant';
import {MHS, VS} from 'constants/system/ui/sizes.ui.constant';
import {ITheme} from 'constants/system/ui/theme.constant';
import {useSystemTheme} from 'helpers/hooks/system.hook';
import ObjectHelper from 'helpers/object.helper';
import {ActivityIndicator, Icon, Modal} from 'react-native-paper';
import webPlayer from '../media/webPlayer.component';
// import Modal from "react-native-modal";

const getVideoIdVimeo = (url: string) => {
  const match = /vimeo.*\/(\d+)/i.exec(url);
  if (match) {
    return match[1];
  }
  return null;
};

const getVideoIdYoutube = (url: string) => {
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  }
  return '';
};

export interface IModalMediaGlobalComponentRef {
  show: (
    media: IImageInfo[],
    currentIndex?: number,
    type?: 'image' | 'wistia' | 'video' | 'vimeo' | 'youtube',
  ) => void;
  hide: () => void;
}

const injected = `var isFullScreen = false;
function onFullScreenChange() {
  isFullScreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
  window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'fullScreenChange', data: Boolean(isFullScreen)}));
}

document.addEventListener('fullscreenchange', onFullScreenChange)`;

const ModalMediaGlobalComponent = forwardRef(
  (_, ref: React.Ref<IModalMediaGlobalComponentRef>) => {
    const {styles, theme} = useSystemTheme(createStyles);
    const refIndexAlbum = useRef(0);
    const refMediaData = useRef<any[]>([]);
    const [type, setType] = useState('image');
    // const videoRef = useRef<any>(null)
    const isLanscape = useSharedValue(1);
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      show(media: any[], currentIndex: number = 0, type = 'image') {
        refMediaData.current = media;
        refIndexAlbum.current = currentIndex;

        setType(type);
        setVisible(true);
      },
      hide() {
        setVisible(false);
      },
    }));

    useEffect(() => {
      if (!visible) {
        Orientation.lockToPortrait();
        // videoRef.current?.paused()
        isLanscape.value = withTiming(0, {duration: 0});
      }
    }, [visible]);

    const close = useCallback(() => setVisible(false), []);

    const renderIndicator = (
      currentIndex?: number | undefined,
      allSize?: number | undefined,
    ) => {
      return (
        <View style={styles.viewHeader}>
          <BText style={styles.viewHeaderText}>
            {currentIndex}/{allSize}
          </BText>
        </View>
      );
    };

    const onStateChange = useCallback((state: string) => {
      if (state === 'ended') {
        console.log(state, 'state video');
      }
    }, []);

    const onMessage = useCallback((event: any) => {
      try {
        const message = ObjectHelper.parseJSON(event?.nativeEvent?.data);
        if (message?.eventType !== 'fullScreenChange') {
          return;
        }

        changeToLanscape(`${message.data}` === 'true');
      } catch (error) {}
    }, []);

    const changeToLanscape = useCallback((isLan: Boolean) => {
      if (Device.isAndroid) {
        if (isLan) {
          Orientation.lockToLandscape();
        } else {
          Orientation.lockToPortrait();
        }
      }
    }, []);

    const renderContent = useCallback(() => {
      if (type === 'youtube') {
        const video_id = getVideoIdYoutube(refMediaData.current?.[0]?.url);

        return (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <YoutubePlayer
              height={VS._200}
              width={Device.width}
              play={true}
              mute={true}
              videoId={video_id}
              onChangeState={onStateChange}
              onFullScreenChange={changeToLanscape}
            />
            <TouchableOpacity style={styles.btnTop} onPress={close}>
              <Icon source={'close'} color={'#ffffff'} size={MHS._28} />
            </TouchableOpacity>
          </View>
        );
      }
      if (type === 'wistia') {
        const video_id = refMediaData.current?.[0]?.url
          ?.split('?')?.[0]
          ?.split('/')?.[
          refMediaData.current?.[0]?.url?.split('?')?.[0]?.split('/').length - 1
        ];
        return (
          <View style={{...StyleSheet.absoluteFillObject}}>
            <WebView
              style={{...StyleSheet.absoluteFillObject}}
              javaScriptEnabled={true}
              mediaPlaybackRequiresUserAction={false}
              builtInZoomControls={false}
              allowsInlineMediaPlayback={true}
              scalesPageToFit={false}
              scrollEnabled={false}
              allowfullscreen
              injectedJavaScript={injected}
              onMessage={onMessage}
              bounces={false}
              source={{
                html: webPlayer(video_id),
                baseUrl: 'https://wistia.com',
              }}
            />
            <TouchableOpacity style={styles.btnTop} onPress={close}>
              <Icon source={'close'} color={'#ffffff'} size={MHS._28} />
            </TouchableOpacity>
          </View>
        );
      }
      if (type === 'vimeo') {
        const video_id = getVideoIdVimeo(refMediaData.current?.[0]?.url);
        return (
          <View style={{...StyleSheet.absoluteFillObject}}>
            <WebView
              style={{...StyleSheet.absoluteFillObject}}
              onError={console.log}
              allowsFullscreenVideo
              allowfullscreen
              injectedJavaScript={injected}
              javaScriptEnabled={true}
              onMessage={onMessage}
              scrollEnabled={false}
              allowsInlineMediaPlayback={true}
              automaticallyAdjustContentInsets
              source={{
                html: `
              <html>

              <head>
                  <meta http-equiv="Content-Security-Policy"
                      content="default-src * gap:; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src *; img-src * data: blob: android-webview-video-poster:; style-src * 'unsafe-inline';">
                      <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1, maximum-scale=1"
                      />
                      <style>
                        html,
                        body {
                          overflow-x: hidden;
                          overflow-y: hidden;
                          padding: 0;
                          margin: 0;
                        }
                        body {
                          position: relative;
                          padding: 0;
                          margin: 0;
                          background-color: black;
                        }
                      </style>
                      </head>
              
              <body style="margin: 0; padding: 0">
                  <iframe src="https://player.vimeo.com/video/${video_id}" webkitallowfullscreen mozallowfullscreen allowfullscreen
                      width="100%" height="100%" margin="0" padding="0" marginwidth="0" marginheight="0" hspace="0" vspace="0" ,
                      frameborder="0" scrolling="no">
                  </iframe>
              </body>
              
              </html>
        `,
              }}
            />
            <TouchableOpacity style={styles.btnTop} onPress={close}>
              <Icon source={'close'} color={'#ffffff'} size={MHS._28} />
            </TouchableOpacity>
          </View>
        );
      }
      // if (type === "video") {
      //   return (
      //     <View style={{...StyleSheet.absoluteFillObject}}>
      //       <VideoPreview
      //         ref={videoRef}
      //         url={refMediaData.current?.[0]?.url}
      //         onPressLanscape={(v) => {
      //           isLanscape.value = withTiming(v ? 1 : 0, {duration: 300})
      //         }}
      //       />
      //       <TouchableOpacity style={styles.btnTop} onPress={close}>
      //         <IconLeft width={FontSizes._16} height={FontSizes._16}/>
      //       </TouchableOpacity>
      //     </View>
      //   )
      // }

      return (
        <ImageViewer
          index={refIndexAlbum.current}
          imageUrls={refMediaData.current}
          enableImageZoom={true}
          enableSwipeDown={true}
          saveToLocalByLongPress={false}
          renderImage={({source, style}) => (
            <BImage
              needConvertLink={false}
              hasBlur={false}
              source={source}
              contentFit={'contain'}
              style={style}
            />
          )}
          loadingRender={() => (
            <ActivityIndicator
              animating
              color={theme.colors.primary}
              size={'large'}
            />
          )}
          style={styles.containerMedia}
          onSwipeDown={() => {
            setVisible(false);
          }}
          renderIndicator={renderIndicator}
          renderHeader={() => (
            <TouchableOpacity style={styles.btnTop} onPress={close}>
              <Icon source={'close'} color={'#ffffff'} size={MHS._28} />
            </TouchableOpacity>
          )}
        />
      );
    }, [type]);

    const styleViewVideo = useAnimatedStyle(() => {
      return {
        height:
          isLanscape.value == 1 ? Device.width : Device.heightSafeWithStatus,
        width:
          isLanscape.value == 1 ? Device.heightSafeWithStatus : Device.width,
        transform:
          isLanscape.value == 1 ? [{rotate: '90deg'}] : [{rotate: '0deg'}],
      };
    });

    return (
      <Modal visible={visible} style={styles.modal}>
        <View style={styles.containerModalBlock}>
          <Animated.View style={[styleViewVideo]}>
            {renderContent()}
          </Animated.View>
        </View>
      </Modal>
    );
  },
);

const createStyles = (theme: ITheme) => {
  return StyleSheet.create({
    modal: {
      flex: 1,
      margin: 0,
    },
    btnTop: {
      height: MHS._36,
      width: MHS._36,
      borderRadius: 50,
      position: 'absolute',
      top: !Device.isX ? 20 : 64,
      zIndex: 1000000,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      right: MHS._20,
    },
    containerModal: {
      height: '100%',
      width: Device.width,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
      backgroundColor: theme.colors.shadow,
    },
    containerModalBlock: {
      width: Device.width,
      height: Device.heightSafeWithStatus,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000000',
    },
    video: {
      width: '100%',
      flex: 1,
      alignSelf: 'center',
      position: 'relative',
      backgroundColor: '#000000',
    },
    viewHeader: {
      top: !Device.isX ? 26 : 66,
      width: '100%',
      position: 'absolute',
      textAlign: 'center',
      alignItems: 'center',
      height: 36,
      alignContent: 'center',
    },
    viewHeaderText: {
      fontWeight: '900',
      color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.3)',
      overflow: 'hidden',
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 4,
      zIndex: 10000,
    },
    styleVideo: {
      width: '100%',
      height: '100%',
    },
    containerMedia: {
      width: Device.width,
    },
  });
};

export default memo(ModalMediaGlobalComponent, isEqual);
