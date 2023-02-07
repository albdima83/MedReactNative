import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {View, StyleSheet, LayoutChangeEvent} from 'react-native';
import Image from '../image/image';
import {MImage, Size} from '../../models/app.models';
import ImageHelper from '../../helpers/imageHelper';

export interface IMedImageProps {
  id: string;
  imgs?: MImage[];
  template: string;
  fallbackTemplate?: string;
  suffix?: '' | '@2' | '@3';
  mode?: 'contain' | 'cover' | 'stretch' | 'center';
}

const MedImage = (props: IMedImageProps) => {
  const targetRef = useRef<View>(null);
  const [dimension, setDimension] = useState<Size>({width: 0, height: 0});
  const [url, setUrl] = useState<string | null>(null);
  const preloadUrls = useRef<Array<string>>([]);

  useEffect(() => {
    if (dimension?.width > 0 && dimension?.height > 0) {
      if (props.imgs) {
        preloadUrls.current = [];
        const suff = props.suffix ? props.suffix : '';
        //const suff = '';
        const imgUrl = ImageHelper.getImageURL(
          props.imgs,
          props.template,
          dimension,
          suff,
        ); //props.template,dimension);
        console.log(
          `retrieve img [${props.template}][${dimension.width}x${dimension.height}]`,
        );
        console.log(props.imgs);
        if(!!props.fallbackTemplate){
          const imgFallbackUrl = ImageHelper.getImageURL(
            props.imgs,
            props.fallbackTemplate,
            dimension,
            suff,
          );  
          if(!!imgFallbackUrl){
            preloadUrls.current.push(imgFallbackUrl);
          }
        }
        if (imgUrl) {
          console.log(
            `img [${props.template}] [${dimension.width}x${dimension.height}]: ${imgUrl} `,
          );
          setUrl(imgUrl);
        }
      } else {
      }
    }
  }, [props.imgs, dimension, props.template]);

  const _onLayout = useCallback((event:LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    setDimension({width, height});
  },[]);

  const _onError = () => {
    console.log(`@@@ _onError LOAD IMAGE [${url}]`);
    if(!!preloadUrls.current && preloadUrls.current.length > 0){
      const fallbackImageUrl = preloadUrls.current.pop();
      if(!!fallbackImageUrl){
        console.log(`@@@ _onError LOAD FALLBACK [${fallbackImageUrl}]`);
        setUrl(fallbackImageUrl);
      }
    }
  }

  return (
    <View
      style={[styles.containerImage, StyleSheet.absoluteFillObject]}
      ref={targetRef}
      onLayout={_onLayout}>
      {!!url && (
        <Image
          onError = {_onError}
          style={[StyleSheet.absoluteFillObject]}
          resizeMode={props.mode ?? 'cover'}
          source={{uri: url}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerImage: {
    borderWidth: 0,
    backgroundColor: '#000',
  },
});

export default MedImage;
