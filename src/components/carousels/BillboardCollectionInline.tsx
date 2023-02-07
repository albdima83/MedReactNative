import React, {useEffect, useRef, useState} from 'react';
import {CarouselItem} from '../../models/app.models';
import {
  Animated,
  Easing,
  findNodeHandle,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';
import MedImage from '../medimage/MedImage';
import {getCarouselHeight} from '../../helpers/dimensionsHelper';
import {useCallback} from 'react';
import {ICarouselItemView, ICarouselScreenProps} from './ICarouselScreenProps';
import { scale } from '../../helpers/scalingHelper';

const CarouselRoundedItemView = (props: ICarouselItemView) => {
  const ref = useRef(null);
  const refAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const [focused, setFocused] = useState(false);
  const startValue = useRef(new Animated.Value(1)).current;
  const endValue = 1.2;
  const duration = 50;

  console.log("@@@@@ CarouselRoundedItemView");
  console.log(props);
  console.log(props.item.images);

  const _onFocus = useCallback(() => {
    console.log('_onFocus Focused item ', props.item.id);
    setFocused(true);
    if (props.onFocus) {
      props.onFocus(props.item, props.index);
    }
  }, []);

  const _onBlur = useCallback(() => {
    console.log('_onBlur Focused item ', props.item.id);
    setFocused(false);
  }, [props.item]);

  // useEffect(() => {
  //   if (focused) {
  //     refAnimation.current = Animated.timing(startValue, {
  //       toValue: endValue,
  //       duration: duration,
  //       easing: Easing.linear,
  //       useNativeDriver: true,
  //     });
  //     refAnimation.current.start();
  //   } else {
  //     refAnimation.current?.reset();
  //   }
  // }, [focused]);

  return (
    <TouchableHighlight
      ref={ref}
      onFocus={_onFocus}
      onBlur={_onBlur}
      style={styles.carouselRoundedContainer}
      hasTVPreferredFocus={props.hasTVPreferredFocus ?? false}
      underlineColorAndroid="transparent"
      underlayColor="transparent"
      activeOpacity={1}
      nextFocusRight={
        props.blockFocusRight ? findNodeHandle(ref.current) : null
      }>
      <View
        style={[
          styles.carouselRoundedCarousel,
          {
            transform: [
              {
                scale: focused ? 1.12 : 1.0,
              },
            ],
          },
        ]}>
        <MedImage
          id={props.item.id}
          template={props.template ?? ''}
          fallbackTemplate={props.fallbackTemplate}
          imgs={props.item.images}
          mode={'cover'}
          suffix='@2'
        />
      </View>
    </TouchableHighlight>
  );
};

const BillboardCollectionInline = (props: ICarouselScreenProps) => {
  
  useEffect(() => {
    const firstItem = (props.carousel.items ?? [])[0] ?? null;
    console.log('@@@ firstItem');
    console.log(firstItem);
  }, [props.carousel.items]);

  const _onFocus = useCallback((item, index) => {
    console.log(`_onFocus index: [${index}]`);
    if (props.onSectionFocus) {
      console.log(`onSectionFocus index: [${props.index}]`);
      props.onSectionFocus(props.carousel, props.index);
    }
  }, []);

  const _getItemsCount = (): number => {
    return props.carousel?.items?.length ?? 0;
  };

  const _buildRoundedItem = () => {
    const item = (props.carousel?.items ?? [])[0] ?? null;
    return (
      <View style={[styles.carouselRoundedContainer,  props.style]}>
        <CarouselRoundedItemView
          index={0}
          item={item}
          template={props.carousel.template?.templateImage ?? ""}
          fallbackTemplate={props.carousel.template?.fallbackTemplateImage ?? ""}
          onFocus={_onFocus}
        />
      </View>
    );
  };

  const _buildeRoundedCarousel = () => {
    return (
      <View style={[styles.carouselRoundedContainer, props.style]} />
    );
  };

  const _build = () => {
    switch (_getItemsCount()) {
      case 0:
        return <View />;
      case 1:
        return _buildRoundedItem();
      default:
        return _buildRoundedItem();
    }
  };

  return <>{_build()}</>;
};

const styles = StyleSheet.create({
  carouselRoundedContainer: {
    flex: 1,
    flexGrow: 1,
    borderWidth: 0,
    justifyContent: 'center',
    paddingHorizontal: scale(120),
    paddingVertical: scale(40),
  },
  carouselRoundedCarousel: {
    width:'100%',
    height: '100%',
    borderWidth: 0,
    borderRadius: scale(64),
    overflow: 'hidden',
  },
});

const MemoBillboardCollectionInline = React.memo(BillboardCollectionInline);

export default MemoBillboardCollectionInline;
