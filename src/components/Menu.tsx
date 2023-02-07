import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import React, {useCallback, useState,useEffect} from 'react';
import {FlatList, ListRenderItem, StyleSheet, View} from 'react-native';
import useTimeout from '../hooks/useTimeout';
import MenuItem from './MenuItem';
import KEYS from '../keys/keys';

const DATA_MENU = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
  },
];

export interface MItem {
  id: string;
  title: string;
}

export interface IMenu {
  menuFocus: (value: boolean) => void;
}

interface MenuProps {
  focusKey?: string;
}


const Menu = ({ focusKey: focusKeyParam }: MenuProps) => {
  
  const {
    ref,
    focusSelf,
    hasFocusedChild,
    focusKey
    // setFocus, -- to set focus manually to some focusKey
    // navigateByDirection, -- to manually navigate by direction
    // pause, -- to pause all navigation events
    // resume, -- to resume all navigation events
    // updateAllLayouts -- to force update all layouts when needed
  } = useFocusable({
    focusable: true,
    saveLastFocusedChild: false,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    focusKey: focusKeyParam,
    onEnterPress: () => {},
    onEnterRelease: () => {},
    onArrowPress: () => true,
    onFocus: () => {},
    onBlur: () => {},
    extraProps: { foo: 'bar' }
  });

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  const renderItem: ListRenderItem<MItem> = ({item}) => (
    <MenuItem key={`menu_item_${item.id}`} id={`menu_item_${item.id}`} title={item.title} />
  );

  
  return (
      <View ref={ref} style={[styles.wrapper,hasFocusedChild ? styles.menuExpanded : styles.menuCollapsed]}>
        <View style={styles.circle} />
        <FlatList
          alwaysBounceVertical={true}
          data={DATA_MENU}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={[styles.vList]}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  menuCollapsed:{
    width:300
  },
  menuExpanded:{
    width:300,
  },
  vList:{
    flex:1,
    flexGrow:1
  },
  vListOpen:{
    width:300,
  },
  wrapper: {
    width:100,
    flexGrow:1,
    alignItems:'center'
  },
  wrapperFocused: {
    width: 300,
    flexGrow:1,
    flex:1,
    backgroundColor: 'black',
    alignItems:'center',
    height: '100%',
  },
  circle: {
    backgroundColor: '#808080',
    width: 50,
    height: 50,
    borderRadius: 30,
    marginTop: 24,
    marginBottom: 24,
  },
});

export default Menu;
