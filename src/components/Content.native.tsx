import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import React, { useRef } from "react";
import { useCallback, useState } from "react";
import { Animated,Text, Dimensions, FlatList,StyleSheet, NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import { RecyclerListView, DataProvider, LayoutProvider, BaseDataProvider } from "recyclerlistview";
import Gallery from "./Gallery";
import {Sections} from '../models/app.models';

const ViewTypes = {
    FULL: 0,
    HALF_LEFT: 1,
    HALF_RIGHT: 2
};


export interface IContentProps{
    sections:Sections
}

const Content = ({sections}:IContentProps) => {
    
    const {width,height} = Dimensions.get('window');
    const { ref, focusKey } = useFocusable();
    const [selectedAsset, setSelectedAsset] = useState(null);
    const refSectionList = useRef<FlatList>(null);

    const scrollY = React.useRef(new Animated.Value(0)).current;

    const handleScroll=(event:NativeSyntheticEvent<NativeScrollEvent>)=>{
        let yOffset=event.nativeEvent.contentOffset.y / 240;
        Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
        )
        console.log(`yOffset:[${yOffset}]`);
    }

    const renderItem = ({item,index}:any)  => {
        //console.log(`@@@@@ renderItem SECTION [${index}]`);
        const id = item.id;
        const title = item.title;
        return(<Gallery galleryId={id} title={title} rowNumber={index} />);
    }

    const handleEndReached = (info: { distanceFromEnd: number })=>{
        console.log(`@@@@@ handleEndReached [${info.distanceFromEnd}]`);
    };

    
    return (
            <View style={{flex:1}}>
               <Text>Content</Text>
            </View>
    )
  }

  const styles = StyleSheet.create({
    carouselsContainer: {
        flex: 1,
        flexGrow: 1,
        borderWidth: 0,
       },
  });
  


  export default Content;