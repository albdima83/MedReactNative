import React, {useEffect, useState,useRef} from 'react';
import {Carousel, CarouselItem, CarouselLayout} from '../../models/app.models';
import {Dimensions, StyleSheet, TouchableHighlight, View, Text} from 'react-native';
import MemoHorinzontalList from './components/HorizontalList';
import MedImage from '../medimage/MedImage';
import LinearGradient from 'react-native-linear-gradient';
import {getCarouselHeight, getCarouselWidth} from '../../helpers/dimensionsHelper';
import {useCallback} from 'react';
import {ICarouselScreenProps} from './ICarouselScreenProps';
import { scale } from '../../helpers/scalingHelper';

const BillboardCollection = (props: ICarouselScreenProps) => {
  const [itemSelected, setItemSelected] = useState<CarouselItem | null>(null);
  const {width,height} = Dimensions.get('window');
  const hListHorizontal = getCarouselHeight(height,props.carouselLayout?.itemLayout?.height ?? 0) + 32;
  // @ts-ignore
  const refRecycle = useRef<RecyclerListView>();
  

  useEffect(() => {
    const firstItem = (props.carousel.items ?? [])[0] ?? null;
    console.log('@@@ firstItem');
    console.log(firstItem);
    setItemSelected(firstItem);
  }, [props.carousel.items]);

  const _onFocus = useCallback(
    (item:CarouselItem, index:number) => {
      console.log(`_onFocus index: [${index}]`);
      setItemSelected(item);
      if (props.onSectionFocus) {
        console.log(`onSectionFocus index: [${props.index}]`);
        props.onSectionFocus(props.carousel, props.index);
      }
    },
    [props.carousel],
  );

  console.log(`@@@@@@@@@@@ BillboardCollection:[${JSON.stringify(props.style)}]`);  
  console.log(`@@@@@@@@@@@ BillboardCollection:[${JSON.stringify(props.carouselLayout.itemLayout)}]`);  

  
  return (
    <View 
        focusable={false}
        isTVSelectable={false}
        style={[styles.carouselsContainer, props.style]}>
        {!!itemSelected  &&(
          <View style={styles.backgroundImage}>
            <MedImage
              id={`big_${itemSelected?.id}`}
              template={props.carousel.template?.itemsTemplateImage ?? ''}
              imgs={itemSelected?.images}
              mode={'cover'}
              suffix='@2'
            />
          </View>
        )}
        <LinearGradient
          start={{x: 0, y: 1}}
          end={{x: 0, y: 0}}
          locations={[0, 0.3, 0.5, 0.6]}
          colors={[
            'rgba(10, 10, 10, 1)',
            'rgba(10, 10, 10, 0.8)',
            'rgba(10, 10, 10, 0.3)',
            'rgba(10, 10, 10, 0)',
          ]}
          style={styles.backgroundGradient}
        />
        <View 
          focusable={false}
          style={[styles.containerItemListContainer, {height: hListHorizontal}]}>
          <MemoHorinzontalList
            ref={refRecycle}
            onFocus={_onFocus}
            style={[styles.itemListContainer, {height: hListHorizontal}]}
            itemLayout={props.carouselLayout.itemLayout}
            index={props.index}
            items={props.carousel.items}
            template={props.carousel.template?.itemsTemplateImage ?? ''}
          />
        </View> 
        
      </View>
  );
};

const styles = StyleSheet.create({
  carouselsContainer: {
    borderWidth: 0,
    padding: 0,
    flex:1,
    flexDirection:'row',
    alignItems:'flex-end',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#222',
    zIndex: 0,
  },
  containerItemListContainer:{
    zIndex:2,
    flex: 1,
    flexGrow: 1,
    paddingLeft: scale(120),
    paddingTop: scale(32),
    overflow:'visible',
    backgroundColor:'transpatent'
  },
  itemListContainer: {
    zIndex:2,
    flex: 1,
    flexGrow: 1,
    overflow:'visible',
    backgroundColor:'transpatent'
  },
});

const MemoBillboardCollection = React.memo(BillboardCollection);

export default MemoBillboardCollection;
