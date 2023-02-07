import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  findNodeHandle,
  Alert,
  Animated,
  ImageSourcePropType,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FocusableComponentLayout, FocusDetails, KeyPressDetails, useFocusable } from '@noriginmedia/norigin-spatial-navigation';


export interface IGalleryItemProps {
  title: string;
  image: ImageSourcePropType;
  index:number;
  hasTVPreferredFocus: boolean;
  blockFocusRight: boolean;
  onEnterPress?: (props: object, details: KeyPressDetails) => void;
  onFocus?: (
    layout: FocusableComponentLayout,
    props: object,
    details: FocusDetails
  ) => void;
}



const GalleryItem = ({title, image, index, hasTVPreferredFocus, blockFocusRight,onEnterPress, onFocus}:IGalleryItemProps) => {

  
  const { ref, focused, focusSelf } = useFocusable({
    onFocus:onFocus,
    extraProps: {
      index,
      title
    }
  });
  //console.log(`@@@@ GalleryItem [${title}] [${focused}]`);
  const startValue = useRef(new Animated.Value(1)).current;
  const endValue = 1.13;
  const duration = 400;

  

  const showAlert = () =>
    Alert.alert(
    title,
    title,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
    ],
  );

  
  useEffect(()=>{
    if(focused){
      Animated.timing(startValue, {
        toValue: endValue,
        duration: duration,
        useNativeDriver: true,
      }).start();
    }else{
      Animated.timing(startValue, {
        toValue: 1.0,
        duration: duration,
        useNativeDriver: true,
      }).start();
    }
  },[focused]);

  /*
  onFocus={focusSelf}
  onBlur={focusSelf}
  */

  return (
    <TouchableHighlight
      ref={ref}
      onFocus={focusSelf}
      onBlur={focusSelf}
      onPress={showAlert}
      underlayColor="transparent"
      activeOpacity={1}
      style={[styles.wrapper, focused ? styles.wrapperFocused : null]}
      >
      <Animated.View 
        style={[styles.containerItem,focused ? styles.wrapperFocused : null,StyleSheet.absoluteFillObject,{
          transform: [
            {
              scale: startValue,
            },
          ],
        }]}>
        <Image style={[StyleSheet.absoluteFillObject]} source={image} />
        <Text style={styles.text}>{title}</Text>
      </Animated.View >
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 0,
    borderRadius: 10,
    marginRight:56,
    padding:24,
    width:300,
    height:280,
    alignItems:'center',
    overflow:'visible',
  },
  wrapperFocused: {
    opacity:1.0
  },
  containerItem:{
    overflow:'hidden',
    borderRadius: 10,
    backgroundColor:'black',
    opacity:0.8
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    zIndex:10
  },
  text: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

//export default React.memo(GalleryItem);

export default GalleryItem;