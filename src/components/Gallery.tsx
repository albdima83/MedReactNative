import React, { useCallback, useRef } from 'react';
import {StyleSheet, ScrollView, Text,FlatList, Dimensions, View, Animated, LayoutChangeEvent, LayoutRectangle, NativeSyntheticEvent, NativeScrollEvent} from 'react-native';
//import shuffle from 'lodash.shuffle';
import GalleryItem from './GalleryItem';
import {DEFAULT_ITEMS} from '../utils/DefaultItems';
import { RecyclerListView, DataProvider, LayoutProvider, BaseDataProvider, WindowCorrection } from "recyclerlistview";
import { ScrollEvent } from 'recyclerlistview/dist/reactnative/core/scrollcomponent/BaseScrollView';
import { FocusableComponentLayout, FocusContext, FocusDetails, KeyPressDetails, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useState } from 'react';

export interface IGalleryProps {
  galleryId:string;
  title:string;
  rowNumber?: number;
}

const ViewTypes = {
  FULL: 0,
  HALF_LEFT: 1,
  HALF_RIGHT: 2
};



const Gallery = ({galleryId,title,rowNumber}: IGalleryProps) => {
  const items = DEFAULT_ITEMS;

  //console.log(`@@@@ galleryId [${galleryId}]`);
  const listRef = useRef<FlatList>(null);
  const layoutScroll = useRef<LayoutRectangle>();
  const previousIndex = useRef<Number>(-1);
  
  const viewabilityConfig = {
    minimumViewTime: 3000,
    viewAreaCoveragePercentThreshold: 100,
    waitForInteraction: true,
  };
  const {width} = Dimensions.get('window');
  const SPACING = 5;
  const ITEM_LENGTH = 220;
  const EMPTY_ITEM_LENGTH = (width - ITEM_LENGTH) / 2;
  
  /*
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.row}>
      {items.map((item, i) => (
        <GalleryItem
          key={i}
          title={item.name}
          image={item.image}
          hasTVPreferredFocus={rowNumber === 0 && i === 0}
          blockFocusRight={i === items.length - 1}
        />
      ))}
    </ScrollView>
  );
  */

  const getItemLayout = ( data:any,index: number) => {
    //console.log(`getItemLayout [${index}] [${data}]`);
    return { length: 0 , offset: 200 , index }
  }

  /*
  const handleScroll=(event)=>{
    let xOffset=event.nativeEvent.contentOffset.x / 200;
    //console.log(`xOffset:[${xOffset}]`);
  }*/

  /*
  const onViewableItemsChanged = ({ viewableItems, changed}) => {
    //console.log("@@@ onViewableItemsChanged");
    //console.log(changed);
  }*/

  const dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  });

  const _dataProvider  = dataProvider.cloneWithRows(items);

  const _layoutProvider = new LayoutProvider(
    
    index => {
      if (index < 3) {
        return ViewTypes.FULL;
      } else {
          return ViewTypes.HALF_LEFT;
      } 
    },
    (type, dim) => {

        switch (type) {
            default:
              dim.width=320;
              dim.height=400;
        }
        //console.log(dim);
    }
  );

  const _handleListEnd = () => {
    //console.log("@@@@ _handleListEnd");
  }

  
  const _rowRender = (type: string | number, data: any, index: number)  => {
    //console.log(`@@@@@ renderItem SECTION [${index}]`);
    const image = data.image;
    const title = data.title;
    //console.log(`renderItem GALLERY ITEM:[${index}]`);
    return <GalleryItem
      key={index.toString()}
      title={title}
      image={image}
      index={index}
      hasTVPreferredFocus={false}
      blockFocusRight={index === items.length - 1} 
         />
  }

  const _applyWindowCorrection = (offsetX: number, offsetY: number, windowCorrection: WindowCorrection) => {
      //console.log("====================");
      //console.log("@@@ _applyWindowCorrection");
      //console.log(`offsetX: [${offsetX}]`);
      //console.log(`offsetY: [${offsetY}]`);
      //console.log(`windowCorrection: [${windowCorrection}]`);
      //console.log(windowCorrection);
  }

  const _onScroll = (rawEvent: ScrollEvent, offsetX: number, offsetY: number) =>{ //(event: NativeSyntheticEvent<NativeScrollEvent>) => {
    //console.log("====================");
    //console.log("@@@ _onScroll");
    //console.log(`offsetX: [${event.nativeEvent.contentOffset.x}]`);
    //console.log(`offsetY: [${event.nativeEvent.contentOffset.y}]`);
    
  }
  

  const onAssetFocus = useCallback(
    (layout: FocusableComponentLayout,
      props: any,
      details: FocusDetails) => {
      let left = layout.left;
      let width = layout.width;
      width = (width <= 0) ? 200 : width;
      const index = props.index as number;  
      //console.log("onAssetFocus");
      //console.log(left);
      //console.log(width);
      //console.log(index);
      const pIndex = previousIndex.current ?? -1;
      const forward = (index > pIndex);
      previousIndex.current = index;
      const dimWidth = layoutScroll.current?.width ?? 0;
      const viewElement = (index + 1) * width + 56 *(index + 1);
      //console.log(`dimWidth: [${dimWidth}]`);
      //console.log(`left: [${left}]`);
      //console.log(`viewElement: [${viewElement}]`);
      //console.log(`index: [${index}]`);
      //console.log(`pIndex: [${pIndex}]`);
      //console.log(`forward: [${forward}]`);
      if(viewElement >= dimWidth){
        const offset = ((viewElement) + width/2) - dimWidth;
        //console.log(`offset: [${offset}]`);
        listRef.current?.scrollToOffset({
          offset: offset,
          animated: true
        });
      }else{
        if(index == 1 && !forward){
          listRef.current?.scrollToOffset({
            offset: 0,
            animated: true
          });
        }
      }
    },
    [listRef]
  );
  
  const onAssetPress = useCallback((asset:any) => {
    
  }, []);

  const _onLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    //console.log(`@@@ _onLayout width: [${width}]`);
    layoutScroll.current = event.nativeEvent.layout;
  }
  

  
  return (
    
    <View style={{marginBottom:24,flex:1,backgroundColor:'yellow',padding:16,overflow:'hidden',position: 'relative'}}>
      <Text style={styles.title}>{title}</Text>
      <RecyclerListView 
                  scrollViewProps={{
                    showsHorizontalScrollIndicator: false,
                    showsVerticalScrollIndicator: false,
                  }}
                  onScroll={_onScroll}
                  style={styles.hList}
                  isHorizontal={true}
                  onEndReached={_handleListEnd}
                  layoutProvider={_layoutProvider} 
                  dataProvider={_dataProvider} 
                  rowRenderer={_rowRender} 
                  applyWindowCorrection={_applyWindowCorrection}
      />
    </View>
  );  
  /*
  return (
    
      <View style={{marginBottom:24,flex:1,height:400,backgroundColor:'yellow',padding:16,overflow:'visible'}}>
        <Text style={styles.title}>{title}</Text>
        <FlatList
          onLayout={_onLayout}
          ref={listRef}
          data={items}
          scrollEnabled={false}
          legacyImplementation={false}
          nestedScrollEnabled={true}
          horizontal={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style = {styles.hList}
          ItemSeparatorComponent = {null}
          initialNumToRender={12}
          renderToHardwareTextureAndroid
          removeClippedSubviews={false}
          contentContainerStyle={styles.hListContainer}
          contentInsetAdjustmentBehavior="never"
          onEndReachedThreshold={0.5}
          decelerationRate={"fast"}
          onScroll={_onScroll}
          renderItem={({item,index}) => {
            //console.log(`renderItem GALLERY ITEM:[${index}]`);
            return <GalleryItem
            key={index.toString()}
            onFocus={onAssetFocus}
            onEnterPress={onAssetPress}
            title={item.name}
            image={item.image}
            index={index}
            hasTVPreferredFocus={false}
            blockFocusRight={index === items.length - 1}
            />
          }}
            keyExtractor={(item,index) => {
              const key =index.toString();
              ////console.log(`keyExtractor GALLERY ITEM:[${key}]`);
              return key;
            }
          }
        />
      </View>
      
  ); */  
  

};

const styles = StyleSheet.create({
  hListContainer:{
    alignItems: 'center',
    flexDirection : 'row',
    paddingLeft: 16,
  },
  hList:{
    flex:1,
    backgroundColor:'blue',
    paddingTop:24,
    paddingBottom:24,
    maxWidth:'100vh',
  },
  title:{
    fontSize:24,
    color:'black',
  },
  row: {
    marginBottom: 50,
  },
});

export default Gallery;
