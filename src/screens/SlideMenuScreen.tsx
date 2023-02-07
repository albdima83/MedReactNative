import React, {useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ListRenderItem,
  TouchableHighlight,
  findNodeHandle,
  Platform,
} from 'react-native';
import {scale} from '../helpers/scalingHelper';
import {MenuItem} from '../models/app.models';
import LinearGradient from 'react-native-linear-gradient';
import Image from '../components/medimage/MedImage';
import {useState} from 'react';

export interface ISlideMenuScreenProps {
  menuItems: Array<MenuItem>;
}

export interface ISlideMenuItemProps {
  item: MenuItem;
  index: number;
  isMenuFocus: boolean;
  focused?: boolean;
  onFocus?: (item: MenuItem) => void;
}

const SlideMenuItem = (props: ISlideMenuItemProps) => {
  return (
    <View style={[styles.item, props.focused ? styles.itemFocused : null]}>
      <Image
        source={{
          uri: 'https://static2.mediasetplay.mediaset.it/mam/2022/03/31/164102254-89cf5f76-be9c-4fad-9fc5-a357423efa72.png',
        }}
        style={{width: scale(60), height: scale(60)}}
        resizeMode={'contain'}
      />
      {props.isMenuFocus && (
        <Text style={{color: '#fff', marginLeft: 10}}>{props.item.title}</Text>
      )}
    </View>
  );
};

const MemoSliderMenuItem = React.memo(SlideMenuItem);

const SlideMenuScreen = (props: ISlideMenuScreenProps) => {
  const [hasFocusedChild, setHasFocusedChild] = useState(false);
  const ref = useRef(null);

  const _onFocusChild = (item: MenuItem) => {
    console.log(item);
    console.log(`hasFocusedChild: ${hasFocusedChild}`);
    setHasFocusedChild(hasFocusedChild);
  };

  const _renderItem: ListRenderItem<MenuItem> = ({item, index}) => (
    <MemoSliderMenuItem
      index={index}
      isMenuFocus={hasFocusedChild}
      key={`menu_item_${item.id}_${index}`}
      onFocus={_onFocusChild}
      item={item}
    />
  );

  const _onFocus = () => {
    setHasFocusedChild(true);
    
  };

  const _onBlur = () => {
    setHasFocusedChild(false);
  };

  console.log(`hasFocusedChild: [${hasFocusedChild}]`);

  const _buildSmartTVMenu = () => {
    return (<View style={styles.menuContainer}>
      <TouchableHighlight
        ref={ref}
        onFocus={_onFocus}
        onBlur={_onBlur}
        hasTVPreferredFocus={false}
        nextFocusLeft={findNodeHandle(ref.current)}
        nextFocusDown={findNodeHandle(ref.current)}
        nextFocusUp={findNodeHandle(ref.current)}
        style={[
          styles.menuList,
          StyleSheet.absoluteFillObject,
          hasFocusedChild ? styles.menuListFocused : null,
        ]}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          locations={[0, 0.5, 0.9, 1]}
          colors={[
            'rgba(10, 10, 10, 1)',
            'rgba(10, 10, 10, 0.6)',
            'rgba(10, 10, 10, 0.2)',
            'rgba(10, 10, 10, 0)',
          ]}
          style={[
            styles.menuList,
            StyleSheet.absoluteFillObject,
            hasFocusedChild ? styles.menuListFocused : null,
          ]}>
          <FlatList
            alwaysBounceVertical={true}
            data={props.menuItems}
            renderItem={_renderItem}
            keyExtractor={item => `menu_${item.id}`}
            contentContainerStyle={{}}
          />
        </LinearGradient>
      </TouchableHighlight>
    </View>)
  }

  const _buildiOSMenu = () => {
    return(<View style={styles.menuContaineriOS}>
      <TouchableHighlight
        ref={ref}
        onFocus={_onFocus}
        onBlur={_onBlur}
        hasTVPreferredFocus={false}
        nextFocusLeft={findNodeHandle(ref.current)}
        nextFocusDown={findNodeHandle(ref.current)}
        nextFocusUp={findNodeHandle(ref.current)}
        style={[
          styles.menuListiOS ,
          StyleSheet.absoluteFillObject,
          hasFocusedChild ? styles.menuListFocused : null,
        ]}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          locations={[0, 0.5, 0.9, 1]}
          colors={[
            'rgba(10, 10, 10, 1)',
            'rgba(10, 10, 10, 0.6)',
            'rgba(10, 10, 10, 0.2)',
            'rgba(10, 10, 10, 0)',
          ]}
          style={[
            styles.menuListiOS,
            StyleSheet.absoluteFillObject,
            hasFocusedChild ? styles.menuListFocused : null,
          ]}>
          <FlatList
            horizontal={true}
            data={props.menuItems}
            renderItem={_renderItem}
            keyExtractor={item => `menu_${item.id}`}
            contentContainerStyle={{}}
          />
        </LinearGradient>
      </TouchableHighlight>
    </View>)
  }
  

  return (
    _buildSmartTVMenu()
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    width: scale(120),
    top: 0,
    left: 0,
    bottom: 0,
    overflow: 'visible',
    zIndex: 10,
    height: '100%',
    position:'absolute'
  },
  menuList: {
    width: scale(120),
    padding: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContaineriOS:{
    height: scale(80),
    top: scale(24),
    left: 0,
    right: 0,
    zIndex: 40,
    overflow:'hidden',
    position:'absolute',
    flex:1,
    flexGrow:1
  },
  menuListiOS:{
    borderRadius:scale(24),
    zIndex: 10,
    height: scale(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuListFocused: {
    width: scale(320),
    zIndex: 20,
  },
  vList: {
    
  },
  item: {
    height: scale(60),
    width: '100%',
    marginBottom: 16,
    color: '#ffffff',
    flexDirection: 'row',
    textAlign: 'left',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  itemFocused: {
    backgroundColor: 'yellow',
  },
});

export default SlideMenuScreen;
