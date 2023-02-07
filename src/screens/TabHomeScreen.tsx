import {useLazyQuery} from '@apollo/client';
import {useEffect, useRef, useState} from 'react';
import {MPlayMenu} from '../apollo/generated/MPlayMenu';
import {GET_MENUS} from '../apollo/queries';
import MapperHelper from '../helpers/mapperHelper';
import {MenuItem} from '../models/app.models';
import {
  StatusBar,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import React from 'react';
import SlideMenuScreen from './SlideMenuScreen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types/index';
import AppConfig from '../configurations/appconfig';
import PageScreen from './PageScreen';


const isTV = Platform.isTV;

export type TabHomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'TabHomeScreen'
>;

const TabHomeScreen: React.FC<TabHomeScreenProps> = props => {
  const [menuItems, setMenuItems] = useState<Array<MenuItem>>([]);
  //const refTvEventHandler = useRef(new TVEventHandler());
  const [fetchMenu] = useLazyQuery<MPlayMenu>(GET_MENUS, {
    onError(error) {
      console.log('@@@ fetchMenu error');
      console.log(error);
    },
    onCompleted(data) {
      console.log('@@@ fetchMenu');
      console.log(data);
      const mItems = MapperHelper.mapMenu(data);
      setMenuItems(mItems);
      console.log('@@@ mItems');
      console.log(mItems);
    },
  });

  /*
  useEffect(()=> {
    _enableTVEventHandler();
    return () => {
      _disableTVEventHandler();
    }
  },[]);

  const _enableTVEventHandler = () => {
    refTvEventHandler.current?.enable(this, function(cmp, evt) {
      console.log(evt);
      if (evt && evt.eventType === 'right') {
      } else if(evt && evt.eventType === 'up') {
      } else if(evt && evt.eventType === 'left') {
      } else if(evt && evt.eventType === 'down') {
      } else if(evt && evt.eventType === 'playPause') {
      }
    });
  }

  const _disableTVEventHandler = () => {
    refTvEventHandler.current?.disable();
  }*/

  useEffect(() => {
    console.log(`AppConfig.navMain:[${AppConfig.navMain}]`);
    fetchMenu({
      variables: {
        id: AppConfig.navMain,
        first: 0,
      },
    });
  }, [fetchMenu, props.route.key]);

  const _rendererHomeScreen = () => {
    return (
      <>
        {isTV && <StatusBar barStyle="dark-content" />}
          <View style={styles.body}>
            <SlideMenuScreen menuItems={menuItems} />
            <View style={styles.sectionContainer}>
              <PageScreen id={AppConfig.homepage} />
            </View>
          </View>
      </>
    );
  };

  return _rendererHomeScreen();
};

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    flexGrow:1,
    backgroundColor: 'violet',
  },
  scrollView: {
    
  },
  splashContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  splashLogo: {
    width: 180,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  body: {
    backgroundColor: '#222',
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  menuContainer: {
    position: 'absolute',
    width: 100,
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 20,
    flex: 1,
    flexGrow: 1,
  },
  sectionContainer: {
    marginTop: 0,
    flexGrow: 1,
    padding: 0,
    backgroundColor:'red',
    height: '100%'
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: "black",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: "black",
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: "black",
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  button: {
    margin: 16,
    zIndex: 10,
  },
  buttonFocused: {
    backgroundColor: 'yellow',
    borderColor: 'rgb(232, 65, 175)',
    margin: 16,
    zIndex: 10,
  },
  header: {
    fontSize: 32,
    color: 'white',
  },
  container: {
    flex: 1,
    //flexDirection: 'row',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  containerMenu: {
    flex: 1,
    width: 100,
    alignItems: 'flex-start',
    flexGrow: 1,
  },
  containerMenuOpen: {
    width: 400,
  },
  containerItems: {
    flex: 3,
    height: '100%',
    padding: 10,
    backgroundColor: 'yellow',
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    color: 'white',
  },
  title: {
    fontSize: 32,
  },
});

export default TabHomeScreen;
