import React, {LegacyRef, ReactElement, Ref, useCallback, useEffect, useRef, useState} from 'react';
import {CarouselItem, CarouselItemLayout} from '../../../models/app.models';
import { RecyclerListView,ProgressiveListView, DataProvider, LayoutProvider, BaseItemAnimator } from "recyclerlistview"
import { FlashList } from "@shopify/flash-list";

import {
  Animated,
  Text,
  FlatList,
  StyleSheet,
  View,
  LayoutRectangle,
  LayoutChangeEvent,
  TouchableHighlight,
  findNodeHandle,
  StyleProp,
  ViewStyle,
  Easing,
  Platform,
} from 'react-native';
import MedImage from '../../medimage/MedImage';
import {
  ICarouselItemView,
  ICarouselItemsScreenProps,
} from '../ICarouselScreenProps';
import { scale } from '../../../helpers/scalingHelper';

const CarouselItemView = (props: ICarouselItemView) => {
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

  console.log(`@@@ dHeight: ${dHeight}`);
  return (
    <TouchableHighlight
      ref={ref}
      onFocus={_onFocus}
      onBlur={_onBlur}
      hasTVPreferredFocus={props.hasTVPreferredFocus ?? false}
      underlineColorAndroid="transparent"
      underlayColor="transparent"
      activeOpacity={1}
      style={[{paddingRight:spaceX,paddingLeft:spaceX},styles.wrapper, focused ? styles.wrapperFocused : null]}
      nextFocusRight = {_nextFocusRight()}
      >
      <View style={[styles.containerItem]}>
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
          ]} >
          <MedImage
            id={props.item.id}
            imgs={props.item.images}
            template={props.template}
            mode="cover"
          />
        </View>
        {(props.itemLayout?.showTitle ?? false) && (
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
        )}
      </View>
    </TouchableHighlight>
  );
};

const MemoCarouselItemView = React.memo(CarouselItemView);

const HorinzontalList = (props: ICarouselItemsScreenProps, ref:React.MutableRefObject<any>) => {

  const _dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  });
  // @ts-ignore 
  const refList = useRef<FlashList<CarouselItem> | null>(null);
  const layoutScroll = useRef<LayoutRectangle>();
  const lastIndex = useRef<number>(-1);
  const itemWidth = props.itemLayout.width;
  const itemHeight = props.itemLayout.height;
  const spaceX = props.itemLayout.x ?? 0;
  const spaceY = props.itemLayout.y ?? 0;
  const [listProvider, setListProvider] = useState<DataProvider | null>(_dataProvider.cloneWithRows(props.items ?? []));
  // @ts-ignore
  const refRecycle = useRef<RecyclerListView>(ref);
  
  const _onLayout = (event: LayoutChangeEvent) => {
    layoutScroll.current = event.nativeEvent.layout;
    console.log('@@@@ _onLayout');
    console.log(event.nativeEvent);
  };

  const _onViewableItemsChanged = ({viewableItems, changed}) => {
    console.log('Visible items are', viewableItems);
    console.log('Changed in this iteration', changed);
  };

  const _onScroll = () => {
    //console.log("====================");
    //console.log("@@@ _onScroll");
    //console.log(`offsetX: [${event.nativeEvent.contentOffset.x}]`);
    //console.log(`offsetY: [${event.nativeEvent.contentOffset.y}]`);
  };

  const _getDirection = (index: number): string => {
    return lastIndex.current <= index ? 'RIGHT' : 'LEFT';
  };

  const _onFocus = useCallback(
    (item, index) => {
      console.log('===============');
      console.log(index);
      console.log(item);
      /*
      refList?.current?.scrollToIndex({
        index,
        animated:true
      });*/
      if (props.onFocus) {
        props.onFocus(item, index);
      }
    },
    [props],
  );

  const _getItemLayout = (data, index) => {
    console.log('@@@ _getItemLayout');
    const dim = itemWidth + props.itemLayout.x * 2;
    return {
      length: dim, //  WIDTH + (MARGIN_HORIZONTAL * 2)
      offset: dim * index, //  ( WIDTH + (MARGIN_HORIZONTAL*2) ) * (index)
      index,
    };
  };

  //const _renderItem = ({item, index}) => {
  const _renderItem = (item, index) => {
    if(!!props.renderItem){
      return props.renderItem(item,index);
    }
    const blockFocusRight = (index >= ((props.items ?? []).length - 1));
    console.log(`@@@ _renderItem blockFocusRight> [${props.index}] [${index}] [${blockFocusRight}]`);
    return (
      <MemoCarouselItemView
        index={index}
        onFocus={_onFocus}
        showTitle={props.showTitle}
        item={item}
        itemLayout={props.itemLayout}
        blockFocusRight={blockFocusRight}
        hasTVPreferredFocus={props.index === 0 && index === 0}
        template={props.template}
      />
    );
  };

  const _layoutProvider = new LayoutProvider(
    index => {
        return "item_hz";
    },
    (type, dim) => {
        console.log(`type:[${type}]}]`);
        const dWidth = scale(itemWidth + spaceX * 2);
        const dHeight = scale(itemHeight + spaceY * 2);
        dim.width = dWidth ;
        dim.height = dHeight
        console.log(dim.width);
        console.log(dim.height);   
    }
  );

  const dHeight = itemHeight + spaceY;

  const _rowRenderer = (type: string | number, data: any, index: number, extendedState?: object): ReactElement | ReactElement[] | null => {
     return _renderItem(data,index);
  }

  
  return (
    <View  
    focusable={false}
    style={[styles.carouselsContainer, props.style]}>
        {!!props.items && props.items.length && !!listProvider && <RecyclerListView
          ref={refRecycle}
          style={styles.hListContainer}
          isHorizontal={true}
          layoutProvider={_layoutProvider}
          dataProvider={listProvider} 
          rowRenderer={_rowRenderer}
          onScroll={_onScroll}
          renderAheadOffset={2200}
          scrollViewProps = {{
              scrollbars:false,
              showsHorizontalScrollIndicator: false,
              showsVerticalScrollIndicator:false
            }
          }
        />
        }
    </View>
  )


  /*      
  return (
    <>
      {!!props.items && props.items.length && (
        
        <View
          focusable={false}
          style={[styles.carouselsContainer, props.style]}>
          <FlashList
            viewabilityConfig={{
              waitForInteraction: true,
              itemVisiblePercentThreshold: 50,
              minimumViewTime: 1000,
            }}
            onLayout={_onLayout}
            ref={refList}
            data={props.items}
            contentInsetAdjustmentBehavior="never"
            scrollEnabled={true}
            nestedScrollEnabled={true}
            horizontal={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            estimatedListSize= {{
              width:scale(itemWidth + spaceX * 2),
              height:scale(itemHeight + spaceY * 2)
            }}
            estimatedFirstItemOffset={100}
            estimatedItemSize= {scale(itemWidth + spaceX * 2)}
            ItemSeparatorComponent={null}
            renderToHardwareTextureAndroid
            removeClippedSubviews={false}
            contentContainerStyle={styles.hListContainer}
            decelerationRate={'fast'}
            keyboardShouldPersistTaps={'never'}
            onScroll={_onScroll}
            renderItem={_renderItem}
            keyExtractor={(item, index) => {
              const key = `hlist_${item.id}_${index}}`;
              ////console.log(`keyExtractor GALLERY ITEM:[${key}]`);
              return key;
            }}
          />
        </View>
      )}
    </>
  );
  */
};

const styles = StyleSheet.create({
  carouselsContainer: {
    borderWidth: 0,
    padding: 0,
    borderRadius: 0,
    overflow:'visible',
  },
  hListContainer: {
  },
  hList: {
    //paddingTop:24,
    //paddingBottom:24,
  },
  wrapper: {
    borderWidth: 0,
    //alignItems: 'center',
    paddingTop:16,
    paddingBottom:16,
    flexGrow:1,
    flex:1
  },
  wrapperFocused: {
    opacity: 1.0,
  },
  containerItem: {
    flexDirection: 'column',
    flexGrow:1,
    //alignSelf:'center',
    overflow:'visible'
  },
  containerItemImage: {
    overflow: 'hidden',
    borderRadius: scale(24),
    backgroundColor: '#000',
    opacity: 0.6,
    flex:1,
    flexGrow:1,
  },
  labelItemCarousel: {
    color: 'white',
    fontSize: scale(28),
    alignContent: 'center',
    opacity: 0.4,
    textAlign:'center',
    paddingTop:scale(8)
  },
  labelItemCarouselFocused: {
    opacity: 1,
    paddingTop:scale(16)
  },
});

// @ts-ignore
const MemoHorinzontalList = React.memo( React.forwardRef<RecyclerListView,ICarouselItemsScreenProps>(HorinzontalList));

export default MemoHorinzontalList;
