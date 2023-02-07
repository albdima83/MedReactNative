import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import React, { useRef } from "react";
import { useCallback, useState } from "react";
import { Animated, Dimensions, FlatList,StyleSheet, NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import { RecyclerListView, DataProvider, LayoutProvider, BaseDataProvider } from "recyclerlistview";
import { ScrollEvent } from "recyclerlistview/dist/reactnative/core/scrollcomponent/BaseScrollView";
import { Sections } from "../models/app.models";
import Gallery from "./Gallery";

const ViewTypes = {
    FULL: 0,
    HALF_LEFT: 1,
    HALF_RIGHT: 2
};

const LISTS = Array.from(Array(10).keys());
const SECTIONS_DATA = LISTS.map((index)=> {
    return {id:`carousel_${index}`,index,title:`Title ${index}`,data:[`Title ${index}`]};
});

export interface IContentProps{
    sections:Sections
}

const Content = ({sections:Sections}) => {
    
    const {width,height} = Dimensions.get('window');
    const { ref, focusKey } = useFocusable();
    const [selectedAsset, setSelectedAsset] = useState(null);
    const refSectionList = useRef(null);

    const scrollY = React.useRef(new Animated.Value(0)).current;

  
    const onAssetPress = useCallback((asset:any) => {
      setSelectedAsset(asset);
    }, []);
  
    

    const _layoutProvider = new LayoutProvider(
        index => {
          return ViewTypes.FULL;
        },
        (type, dim) => {
            switch (type) {
                default:
                    dim.width = width;
                    dim.height = 400;
                break;
            }
        }
    );
    
    const dataProvider = new DataProvider((r1, r2) => {
        return r1 !== r2;
    });
    
    const _dataProvider  = dataProvider.cloneWithRows(SECTIONS_DATA);

    const _rowRender = (type: string | number, data: any, index: number)  => {
        //console.log(`@@@@@ renderItem SECTION [${index}]`);
        const id = data.id;
        const title = data.title;
        return(<Gallery galleryId={id} title={title} rowNumber={index} />);
    }
    
    const handleScroll=(rawEvent: ScrollEvent, offsetX: number, offsetY: number)=>{
        console.log('rawEvent');
        console.log(rawEvent);
        console.log(`yOffset:[${offsetY}]`);
    }

    const renderItem = ({item,index}:any)  => {
        //console.log(`@@@@@ renderItem SECTION [${index}]`);
        const id = item.id;
        const title = item.title;
        return(<Gallery galleryId={id} title={title} rowNumber={index} />);
    }

    const handleEndReached = ()=>{
        console.log(`@@@@@ handleEndReached`);
    };

    
    return (
            <View style={{flex:1,maxHeight:'100vh',overflow:'hidden',minHeight: 1, minWidth: 1}}>
                <RecyclerListView
                        style={{ minWidth:1, minHeight: 1}} // set this
                        ref={refSectionList}
                        dataProvider={_dataProvider}
                        onScroll={handleScroll}
                        onEndReachedThreshold={0.5}
                        onEndReached={handleEndReached}
                        layoutProvider={_layoutProvider}
                        rowRenderer={_rowRender}
                        /> 
            </View>
    )
  
    /*
    return (
            <View style={{flex:1,overflow:'hidden'}}>
                <FocusContext.Provider value={focusKey}>
                <RecyclerListView 
                style={{ minHeight: 1, minWidth: 1 }}
                layoutProvider={_layoutProvider} 
                dataProvider={_dataProvider} 
                rowRenderer={_rowRender} 
                />
                </FocusContext.Provider>
            </View>      
    );
    */
    
  }

  const styles = StyleSheet.create({
    carouselsContainer: {
        flex: 1,
        flexGrow: 1,
        borderWidth: 0,
       },
  });
  


  export default Content;