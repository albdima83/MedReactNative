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
  Easing,
  findNodeHandle,
  Platform,
} from 'react-native';
import MemoHorinzontalList from './components/HorizontalList';
import MedImage from '../MedImage';
import {useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {getCarouselHeight} from '../../helpers/dimensionsHelper';
import {ICarouselItemView, ICarouselScreenProps} from './ICarouselScreenProps';
import { scale } from '../../helpers/scalingHelper';


const NavItemView = (props: ICarouselItemView) => {
    
    const ref = useRef(null);
    const refAnimation = useRef<Animated.CompositeAnimation | null>(null);
    const [focused, setFocused] = useState(false);
    const startValue = useRef(new Animated.Value(1)).current;
    const itemWidth = scale(props.itemLayout?.width ?? 0);
    const itemHeight = scale(props.itemLayout?.height ?? 0);
    const spaceX = scale(props.itemLayout?.x ?? 0);
    const spaceY = scale(props.itemLayout?.y ?? 0);
    const endValue = 1.2;
    const duration = 50;
  
    const _onFocus = useCallback(() => {
      console.log(`_onFocus ITEM[${props.index}]`);
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
  
    useEffect(() => {
      if (focused) {
        refAnimation.current = Animated.timing(startValue, {
          toValue: endValue,
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: Platform.OS !== "web",
        });
        refAnimation.current.start();
      } else {
        refAnimation.current?.reset();
      }
    }, [focused, startValue]);
  
    const _nextFocusRight = () => {
      console.log("@@@ _nextFocusRight");
      console.log(`blockFocusRight> index: [${props.index}] blockFocusRight: [${props.blockFocusRight}]]`);
      const actualNode = findNodeHandle(ref.current);
      console.log(actualNode);
      return props.blockFocusRight ? actualNode : null
    }
    const dHeight = itemHeight + spaceY * 2;
    const dWidth = itemWidth + spaceX * 2;
  
    console.log(`@@@ NavItemView dHeight: ${dHeight}`);
    console.log(`@@@ NavItemView dWidth: ${dWidth}`);

    
    return (
      <TouchableHighlight
        ref={ref}
        onFocus={_onFocus}
        onBlur={_onBlur}
        hasTVPreferredFocus={props.hasTVPreferredFocus ?? false}
        underlineColorAndroid="transparent"
        underlayColor="transparent"
        activeOpacity={1}
        style={[{paddingRight:spaceX},styles.wrapper, focused ? styles.wrapperFocused : null]}
        nextFocusRight = {_nextFocusRight()}
        >
        <View style={[{height:dHeight,width:dWidth},styles.containerItem]}>
          <View
            style={[
              styles.containerItemImage,
              focused ? styles.wrapperFocused : null,
              {
                transform: [
                  {
                    scale: focused ? 1.12 : 1.0,
                  },
                ],
              },
            ]}>
            <Text
              numberOfLines={1}
              accessible={false}
              importantForAccessibility="no"
              style={[
                styles.labelItemCarousel,
                focused ? styles.labelItemCarouselFocused : null,
              ]}>
              {props.item.title}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };
  
  const MemoNavItemView = React.memo(NavItemView);

const NavCollection = (props: ICarouselScreenProps) => {

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

  const _renderItem = useCallback( (item: CarouselItem, index: number)=> {
    const blockFocusRight = (index >= ((props.carousel.items ?? []).length - 1));
    return <MemoNavItemView 
        index={index}
        item={item}
        itemLayout = {props.carouselLayout.itemLayout}
        blockFocusRight = {blockFocusRight}
        onFocus = {_onFocus}
        template= ''
    />
  },[props.carousel]);

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
        renderItem={_renderItem}
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
  wrapper: {
    borderWidth: 0,
    //alignItems: 'center',
    paddingTop:scale(16),
    paddingBottom:scale(16),
    width:'100%',
    height:'100%',
  },
  wrapperFocused: {
    opacity: 1.0,
  },
  containerItem: {
    flex:1,
    flexGrow:1,
  },
  containerItemImage: {
    overflow: 'hidden',
    borderRadius: scale(24),
    backgroundColor: '#000',
    opacity: 0.6,
    justifyContent: 'center', //Centered horizontally
    alignItems: 'center', //Centered vertically
    flex:1,
    flexGrow:1
  },
  labelItemCarousel: {
    color: 'white',
    fontSize: scale(28),
    opacity: 0.4,
    textAlign:'center',
    textAlignVertical:'center',
    alignSelf:'center',
    ...Platform.select({
      ios: {
        justifyContent:"center"
      },
      android: {}
  })
  },
  labelItemCarouselFocused: {
    opacity: 1,
  },
});

const arePropsEqual = (prevProps, nextProps) => {
  return nextProps.carousel.id === prevProps.carousel.id;
};

const MemoNavCollection = React.memo(NavCollection);

export default MemoNavCollection;
