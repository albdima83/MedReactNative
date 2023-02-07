import React, {useEffect, useState} from 'react';
import {Carousel, CarouselItem, CarouselLayout} from '../../models/app.models';
import {Dimensions, StyleSheet, View} from 'react-native';
import MemoHorinzontalList from './components/HorizontalList';
import MedImage from '../MedImage';
import LinearGradient from 'react-native-linear-gradient';
import {getCarouselHeight} from '../../helpers/dimensionsHelper';
import {useCallback} from 'react';
import {ICarouselScreenProps} from './ICarouselScreenProps';

const BillboardBigCollection = (props: ICarouselScreenProps) => {
  const [itemSelected, setItemSelected] = useState<CarouselItem | null>(null);
  

  useEffect(() => {
    const firstItem = (props.carousel.items ?? [])[0] ?? null;
    console.log('@@@ firstItem');
    console.log(firstItem);
    setItemSelected(firstItem);
  }, [props.carousel.items]);

  const _onFocus = useCallback(
    (item, index) => {
      console.log(`_onFocus index: [${index}]`);
      setItemSelected(item);
      if (props.onSectionFocus) {
        console.log(`onSectionFocus index: [${index}]`);
        props.onSectionFocus(props.carousel, props.index);
      }
    },
    [props.carousel],
  );

  return (
    <View style={styles.carouselsContainer}>
      {!!itemSelected && (
        <View style={styles.backgroundImage}>
          <MedImage
            id={`big_${itemSelected.id}`}
            template={props.carousel.template?.itemsTemplateImage ?? ''}
            imgs={itemSelected.images}
            mode={'cover'}
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
      <MemoHorinzontalList
        onFocus={_onFocus}
        style={styles.itemListContainer}
        itemLayout={props.carouselLayout.itemLayout}
        index={props.index}
        items={props.carousel.items}
        template={props.carousel.template?.itemsTemplateImage ?? ''}
      />
    </View>
  );
  /*
    return (
        <>
            {itemSelected && <MedImage imgs={itemSelected?.images} template={props.carousel.template?.itemsTemplateImage ?? ""} />}
            {(!!props.carousel.items && props.carousel.items.length > 0) &&
            <View style={[styles.carouselsContainer,{width,height:height-140}]}>
                <HorinzontalList index={props.index} items={props.carousel.items} template={props.carousel.template?.itemsTemplateImage ?? ""} />
            </View>}
        </>
    );
    */
};

const styles = StyleSheet.create({
  carouselsContainer: {
    borderWidth: 0,
    padding: 0,
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
  itemListContainer: {
    zIndex: 2,
  },
});

const MemoBillboardBigCollection = React.memo(BillboardBigCollection);

export default MemoBillboardBigCollection;
