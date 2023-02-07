import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Carousel, CarouselItem, CarouselLayout} from '../../models/app.models';
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';
import MemoHorinzontalList from './components/HorizontalList';
import {useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {getCarouselHeight} from '../../helpers/dimensionsHelper';
import {ICarouselScreenProps} from './ICarouselScreenProps';
import { scale } from '../../helpers/scalingHelper';

const VideoBrandedCollection = (props: ICarouselScreenProps) => {

  const {width,height} = Dimensions.get('window');
  const hListHorizontal = getCarouselHeight(height,props.carouselLayout?.itemLayout?.height ?? 0) + 40;  

  useEffect(() => {
    const firstItem = (props.carousel.items ?? [])[0] ?? null;
    console.log('@@@ firstItem');
    console.log(firstItem);
  }, []);

  const _onFocus = useCallback(
    (item, index) => {
      console.log(`_onFocus index: [${index}]`);
      if (props.onSectionFocus) {
        console.log(`onSectionFocus index: [${props.index}]`);
        props.onSectionFocus(props.carousel, props.index);
      }
    },
    [props.carousel],
  );

  return (
    <View
      focusable={false}
      isTVSelectable={false}
      style={[styles.carouselsContainer, props.style]}>
      {!!props.carousel.title && (
        <Text
          accessible={false}
          importantForAccessibility="no"
          style={styles.titleCarousel}>
          {props.carousel.title}
        </Text>
      )}
      <MemoHorinzontalList
        style={[styles.itemListContainer,{height:hListHorizontal}]}
        onFocus={_onFocus}
        showTitle={true}
        itemLayout={props.carouselLayout.itemLayout}
        index={props.index}
        items={props.carousel.items}
        template={props.carousel.template?.itemsTemplateImage ?? ''}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselsContainer: {
    borderWidth: 0,
    padding: 0,
    paddingLeft: scale(120),
    paddingTop: scale(32),
    flex:1,
    flexGrow:1,
    overflow:'visible',
  },
  titleCarousel: {
    textAlign: 'left',
    fontSize: scale(48),
    color: 'white',
    flexWrap: 'wrap',
    marginBottom: scale(16),
  },
  itemListContainer: {
    zIndex: 2,
  },
});

const arePropsEqual = (prevProps, nextProps) => {
  return nextProps.carousel.id === prevProps.carousel.id;
};

const MemoVideoBrandedCollection = React.memo(VideoBrandedCollection);

export default MemoVideoBrandedCollection;
