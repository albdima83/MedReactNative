import {useLazyQuery} from '@apollo/client';
import React, {ReactElement, useEffect, useRef} from 'react';
import {PageType} from '../apollo/generated/globalTypes';
import {MPlayPage} from '../apollo/generated/MPlayPage';
import {GET_PAGE} from '../apollo/queries';
import MapperHelper from '../helpers/mapperHelper';
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  ActivityIndicator,
  Platform,
  LayoutChangeEvent,
} from 'react-native';
import {Carousel, LocalCarouselTemplate, Sections, Size} from '../models/app.models';
import {useState} from 'react';
import { LayoutTemplates} from '../configurations/layout';
import MemoBillboardCollection from '../components/carousels/BillboardCollection';
import MemoVideoBrandedCollection from '../components/carousels/VideoBrandedCollection';
import {useCallback} from 'react';
import MemoBillboardBigCollection from '../components/carousels/BillboardBigCollection';
import MemoBillboardCollectionInline from '../components/carousels/BillboardCollectionInline';
import { getCarouselHeight, getCarouselWidth } from '../helpers/dimensionsHelper';
import { RecyclerListView, DataProvider, LayoutProvider, BaseItemAnimator } from "recyclerlistview"
import index from 'uuid-random';
import { ScrollEvent } from 'recyclerlistview/dist/reactnative/core/scrollcomponent/BaseScrollView';
import MemoNavCollection from '../components/carousels/NavCollection';
import useKeyPress from '../hooks/useKeyPress';
import { KEYS_VALUE } from "../hooks/useKeyPress/keys";

export interface IPageScreenProps {
  id: string | null | undefined;
  layout?: string;
}

const CAROUSEL_SUPPORTED =[LocalCarouselTemplate.BillboardCollection,LocalCarouselTemplate.BillboardCollectionInline,LocalCarouselTemplate.VideoBrandedCollection,LocalCarouselTemplate.PosterCollection,LocalCarouselTemplate.OptionCollection, LocalCarouselTemplate.NavCollection, LocalCarouselTemplate.KeyFrameCollection,
LocalCarouselTemplate.OnAirCollection,LocalCarouselTemplate.ScheduleCollection
]

const { width, height } = Dimensions.get('window');

const PageScreen = (props: IPageScreenProps) => {
  const dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  });
  const dataProviderRef = useRef(dataProvider);
  // @ts-ignore
  const recyclerRef = useRef<RecyclerListView>();
  const refSectionList = useRef<FlatList>(null);
  const [loadingSection, setLoadingSection] = useState(true);
  const [carousels, setCarousels] = useState<Carousel[] | null | undefined>();
  const [dimension, setDimension] = useState<Size>({width, height});
  //const [carouselsProvider, setCarouselsProvider] = useState<DataProvider | null>(null);
  const fadeOutSplashscren = React.useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const yOffset = useRef<number>(0);
  const actualIndex = useRef<number>(-1);
  const previousIndex = useRef<number>(-1);
  const currentYPosition = useRef<number>(0);
  
  

  const _onKeyPressed = (key:(KEYS_VALUE | null | undefined)) => {
      console.log(`PageScreen onKeyPressed: [${key}]`);
      switch(key){
        case KEYS_VALUE.UP:
          _scrollTo(actualIndex.current - 1);
        break;
        case KEYS_VALUE.DOWN:
          _scrollTo(actualIndex.current + 1);
        break;
      }
  }
  const _onKeyUp = (key:(KEYS_VALUE | null | undefined)) => {
    
  }

  const [keyPressed] = useKeyPress({
    onKeyPressed:_onKeyPressed,
    onKeyUp:_onKeyUp,
  });

  const [fetchPage] = useLazyQuery<MPlayPage>(GET_PAGE, {
    onError(error) {
      console.log('@@@ fetchPage error');
      console.log(error);
    },
    onCompleted(data) {
      console.log('@@@ fetchPage');
      console.log(data);
      const type = data.getPage?.type ?? PageType.homepage;
      const sections =
        data.getPage?.sectionInterfacesConnection?.sections ?? [];
      const cls = MapperHelper.getCarouselsFromSectionInterfaces(
        sections,
        null,
        false,
      );
      const clsSupported = cls.filter((cl) => (!!cl.template?.localTemplate) ? (CAROUSEL_SUPPORTED.length == 0 || CAROUSEL_SUPPORTED.indexOf(cl.template.localTemplate) > -1) : false ) ?? [];  
      dataProviderRef.current = dataProvider.cloneWithRows(clsSupported);
      //setLoadingSection(false);
      setCarousels(clsSupported);
      //setCarouselsProvider(dataProvider.cloneWithRows(clsSupported));
      console.log(`cls:[${clsSupported?.length ?? 0}]`);
    },
  });


  useEffect(() => {
    if (props.id) {
      fetchPage({
        variables: {
          id: props.id        
        },
      });
    }
  }, [props.id]);

  const _handleEndReached = (info: {distanceFromEnd: number}) => {
    console.log(`@@@@@ handleEndReached [${info.distanceFromEnd}]`);
  };

  const _onLayout = (event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    console.log(`@@@ LayoutChangeEvent [${width} x ${height}]`);
    setDimension({width, height});
  };


  const _handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    let y = event.nativeEvent.contentOffset.y;
    yOffset.current = y;
    Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
      useNativeDriver: Platform.OS !== "web",
    });
    //console.log(`yOffset:[${y}]`);
  };

  const _scrollNext = () => {

  }

  const _scrollPrev = () => {
    
  }

  const _scrollTo = (index: number) => {
    console.log("==========================");
    console.log("==========================");
    console.log(`actualIndex.current: [${actualIndex.current}]`);
    console.log(`previousIndex.current: [${previousIndex.current}]`);
    console.log(`index: [${index}]`);
    if(!carousels){
      console.log("not carousels")
      return;
    }

    if (index === actualIndex.current) {
      console.log("equals")
      return;
    }

    if(index < 0 || index > (carousels.length - 1)){
      return
    }

    previousIndex.current = actualIndex.current;
    actualIndex.current = index;
    if(index == 0){
      recyclerRef.current.scrollToOffset(
        0,
        0,
        true,
      );
    }else{
      try{
          const topRowIndex = recyclerRef.current.findApproxFirstVisibleIndex();
          const topRow = (carousels ?? [])[topRowIndex];
          const currentOffset = recyclerRef.current.getCurrentScrollOffset();
          const topRowOffset = recyclerRef.current._virtualRenderer.getLayoutManager().getOffsetForIndex(index);
          const direction = (topRowOffset > currentOffset) ? 1 : -1;
          const diff = currentOffset -  topRowOffset.y;
          const scrollOffset = currentOffset + direction * diff;
          console.log(`topRowIndex: [${topRowIndex}]`);
          console.log(`topRow: [${topRow}]`);
          console.log(`topRowOffset: [${topRowOffset.y}]`);
          console.log(`currentOffset: [${currentOffset}]`);
          console.log(`diff: [${diff}]`);
          console.log(`scrollOffset: [${scrollOffset}]`);
          recyclerRef.current.scrollToOffset(
              0,
              scrollOffset,
              true,
          );
      }catch(ex){
        console.log(ex);
      }
      // recyclerRef.current?.scrollToOffset({
      //   offset: newOffset,
      //   animated: true,
      // });
    }
    console.log("END==========================");
    console.log("END==========================");
  }

  const _onFocusSection = (carousel: Carousel, index: number) => {
    console.log(`_onFocusSection: [${index}]`);
    _scrollTo(index);
  };

  const _layoutProvider = new LayoutProvider(
    index => {
        if(!!!carousels) return "";
        const item = carousels[index];
        const localTemplate = item.template?.localTemplate ?? -1;
        console.log(`index:[${index}] layout: [${localTemplate}]`);
        return localTemplate;
    },
    (type, dim) => {
        const template = LocalCarouselTemplate[type];
        const layout = LayoutTemplates[type];
        console.log(`type:[${type}] template:[${template}] layout: [${layout}]`);
        const dWidth = dimension.width;
        const dHeight = dimension.height;
        dim.width = getCarouselWidth(dWidth,layout.width ?? 0);
        dim.height = getCarouselHeight(dHeight,layout.height ?? 0);
        console.log(dim.width);
        console.log(dim.height);   
    }
);

  //const _renderItem = ({item:Carousel, index}) => {
  const _renderItem = (item:Carousel, index:number) => {
    console.log(`@@@@@ renderItem CAROUSEL [${index}] [${item.id}]`);
    //check oif template is define otherwise not paint
    const localTemplate = item.template?.localTemplate ?? -1;
    const carouselLayout = LayoutTemplates[localTemplate];
    console.log(`localTemplate:[${localTemplate}] carouselLayout:[${carouselLayout}]`);
    if(!!!carouselLayout) return null;
    const width = dimension.width;
    const height = dimension.height;
    console.log(`DIMENSION SCREEN [${width} x ${height}]`);
    const cWidth = getCarouselHeight(width,item.template?.carouselLayout?.width ?? 0);
    const cHeight = getCarouselHeight(height,item.template?.carouselLayout?.height ?? 0);
    console.log(
      `_renderItem localTemplate: [${localTemplate}] [${item.nameCollection}]`,
    );
    switch (localTemplate) {
      //case LocalCarouselTemplate.BillboardBigCollection:
      case LocalCarouselTemplate.BillboardCollection:
        //case LocalCarouselTemplate.BillboardCollectionInline:
        console.log('@@@@ BillboardCollection');
        return (
          <MemoBillboardCollection
            index={index}
            carousel={item}
            carouselLayout={carouselLayout}
            onSectionFocus={_onFocusSection}
            style= {{height: cHeight}}
          />
        );

      case LocalCarouselTemplate.BillboardCollectionInline:
        console.log('@@@@ BillboardCollectionInline');
        return (
          <MemoBillboardCollectionInline
            index={index}
            carousel={item}
            carouselLayout={carouselLayout}
            onSectionFocus={_onFocusSection}
            style= {{height: cHeight}}
          />
        );


      case LocalCarouselTemplate.NavCollection:
        return (
          <MemoNavCollection
            index={index}
            carousel={item}
            carouselLayout={carouselLayout}
            onSectionFocus={_onFocusSection}
            style= {{height: cHeight}}
          />
      );    

      case LocalCarouselTemplate.PosterCollection:
      case LocalCarouselTemplate.OnAirCollection:
        case LocalCarouselTemplate.VideoBrandedCollection:
          case LocalCarouselTemplate.KeyFrameCollection:
              case LocalCarouselTemplate.OptionCollection:
                case LocalCarouselTemplate.ScheduleCollection:
        console.log('@@@@ PosterCollection');
      return (
          <MemoVideoBrandedCollection
            index={index}
            carousel={item}
            carouselLayout={carouselLayout}
            onSectionFocus={_onFocusSection}
            style= {{height: cHeight}}
          />
      );
    }

    //return <MemoBillboardCollection index={index} carousel={item}/>
    return <View />;
  };

  const _onViewableItemsChanged = (({ viewableItems }) =>{

  });

  const _renderLoader = () => {
    return (
      <Animated.View
        focusable={false}
        style={[
          styles.loaderContainer,
          {
            opacity: fadeOutSplashscren, // Bind opacity to animated value
          },
        ]}>
        <ActivityIndicator size="large" color="#fff" />
      </Animated.View>
    );
  };

  const _scrollSinkY = Animated.event(
    [{nativeEvent: { contentOffset: { y: scrollY } }}],
    {useNativeDriver: Platform.OS !== "web",},
  );

  const _rowRenderer = (type: string | number, data: any, index: number, extendedState?: object): ReactElement | ReactElement[] | null => {
    return _renderItem(data,index);
  }

  const _onScroll = (rawEvent: ScrollEvent, offsetX: number, offsetY: number) => {
    yOffset.current = offsetY;
  }

  const _loadMore = (preserveScrollPosition:boolean) => {
    const topRowIndex = recyclerRef.current.findApproxFirstVisibleIndex();
    const topRow = (carousels ?? [])[topRowIndex];
    const currentOffset = recyclerRef.current.getCurrentScrollOffset();
    const topRowOffset = recyclerRef.current._virtualRenderer.getLayoutManager().getOffsetForIndex(topRowIndex);
    const diff = currentOffset - topRowOffset.y;
    /*
    this.setState(
      prevState => {
        const items = [...generateItems(10), ...this.state.items];
        return {
          items,
          dataProvider: prevState.dataProvider.cloneWithRows(items),
        };
      },
      () => {
        if (preserveScrollPosition) {
          const topRowNewIndex = _.findIndex(this.state.items, topRow);
          const topRowNewOffset = this._recyclerListView._virtualRenderer.getLayoutManager().getOffsetForIndex(topRowNewIndex);
          this._recyclerListView.scrollToOffset(0, topRowNewOffset.y + diff);
        }
      }
    );
    */
  };

  return (
   <>
    {console.log(`PageScreen renderer: ${carousels}`)}
    {console.log(`PageScreen renderer: ${dataProviderRef.current}`)}
    <View  
      onLayout={_onLayout}
      style={styles.carouselsContainer}>
        {(dataProviderRef.current.getSize() > 0)  && <RecyclerListView
          ref={recyclerRef}
          style={styles.carouselsList}
          layoutProvider={_layoutProvider}
          dataProvider={dataProviderRef.current} 
          //itemAnimator={new BaseItemAnimator()}
          rowRenderer={_rowRenderer}
          onScroll={_onScroll}
          renderAheadOffset={dimension.height * 2}
          scrollViewProps={{
            showsHorizontalScrollIndicator: false,
            showsVerticalScrollIndicator:false
          }}
        />
        }
    </View>
    </> 
  );
  /*
  return (
    <View style={styles.carouselsContainer}>
      
        <Animated.FlatList
          ref={refSectionList}
          data={carousels}
          initialNumToRender={1}
          maxToRenderPerBatch={10}
          removeClippedSubviews={Platform.OS !== 'web'}
          contentContainerStyle={styles.carouselsList}
          scrollEnabled={false}
          ItemSeparatorComponent={null}
          onLayout={_onLayout}
          onScroll={_scrollSinkY}
          onEndReachedThreshold={0.5}
          onEndReached={_handleEndReached}
          keyboardShouldPersistTaps="always"
          keyExtractor={(item, index) => {
            const key = `carousel_${item.id}_${index}`;
            //console.log(`keyExtractor section:[${key}]`);
            return key;
          }}
          renderItem={_renderItem}
        />
      
    </View>
  );*/
};

/*{loadingSection && _renderLoader()}*/

const styles = StyleSheet.create({
  loaderContainer: {
    position:'absolute',
    alignSelf:'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#222',
    top:0,
    left:0,
    right:0,
    bottom:0
  },
  carouselsContainer: {
    flexGrow: 1,
    flex:1,
    overflow:'visible',
    backgroundColor:'green'
  },
  carouselsList: {
    borderWidth: 0,
    backgroundColor:'blue',
    flexGrow: 1,
    flex:1,
  },
});

export default PageScreen;


