import React, {useState, useCallback, useEffect} from 'react';
import {StyleSheet, View, TouchableHighlight, Text} from 'react-native';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';

export interface IMenuItem {
  id:string,
  title:string;
  setMenuFocus?: (value: boolean) => void;
}

const MenuItem = ({id,title}: IMenuItem) => {
  //const [focus, setFocus] = useState(false);
  const { ref, focused } = useFocusable();
  
  /*
  useEffect(()=>{
    if(setMenuFocus){
      //console.log(`@@@ setMenuFocus [${id}] [${focused}]`);
      setMenuFocus(focused);
    }
  },[focused]);
 */
  return (
    <TouchableHighlight
      ref={ref}
      style={[styles.item, focused ? styles.itemFocused : null]}>
      <View>
        <Text>{title}</Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#808080',
    alignSelf: 'stretch',
    height: 30,
    left: 0,
    marginBottom: 25,
    marginHorizontal: 25,
    borderRadius: 5,
  },
  itemFocused: {
    backgroundColor: '#714add',
  },
});

export default MenuItem;
