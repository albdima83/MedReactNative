/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

 import React, {forwardRef, useEffect} from 'react';
 import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  FlatList,
  ListRenderItem,
  TouchableHighlight,
  SectionList,
  Platform,
  TouchableOpacity,
  findNodeHandle,
  AccessibilityInfo,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
} from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider, BaseDataProvider } from "recyclerlistview";
import {useCallback, useState, useRef} from 'react';
import Menu from './src/components/Menu';
import Gallery from './src/components/Gallery';
import { FocusContext, init, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import Content from './src/components/Content';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';



 init({
    debug:true,
    visualDebug:true
  });
 
  export interface ICustomButton {
    title: string;
  }
  
  export interface CarouselItem {
    id: string;
    title: string;
  }
  
  const DATA_MENU: Array<CarouselItem> = [
    {
      id: 'eee-c1b1-2222-aed5-3ad53abb28ba',
      title: 'Menu 1',
    },
    {
      id: 'ee-c605-2222-a4f8-fbd91aa97f63',
      title: 'Menu 2',
    },
    {
      id: 'eee-3da1-2222-bd96-145571e29d72',
      title: 'Menu 3',
    },
  ];
  
 
 
 //  const SECTIONS_DATA = [
 //   {
 //     title: 'Title 1',
 //     data: ['c01'],
 //   },
 //   {
 //    title: 'Title 2',
 //    data: ['c2'],
 //   },
 //   {
 //    title: 'Title 3',
 //    data: ['c3'],
 //   },
 //   {
 //    title: 'Title 4',
 //    data: ['c4'],
 //   },
 //   {
 //    title: 'Title 5',
 //    data: ['c5'],
 //   },
 //   {
 //    title: 'Title 6',
 //    data: ['c6'],
 //   },
 //   {
 //    title: 'Title 7',
 //    data: ['c7'],
 //   },
 //   {
 //    title: 'Title 8',
 //    data: ['c8'],
 //   },
 //   {
 //    title: 'Title 9',
 //    data: ['c9'],
 //   },
 //   {
 //    title: 'Title 10',
 //    data: ['c10'],
 //   },
 // ];
 
  const LISTS = Array.from(Array(10).keys());
  const SECTIONS_DATA = LISTS.map((index)=> {
     return {id:`carousel_${index}`,index,title:`Title ${index}`,data:[`Title ${index}`]};
   });
 
   const ViewTypes = {
     FULL: 0,
     HALF_LEFT: 1,
     HALF_RIGHT: 2
   };

 
  /*
  const Section: React.FC<
    PropsWithChildren<{
      title: string;
    }>
  > = ({children, title}) => {
    const isDarkMode = useColorScheme() === 'dark';
    return (
      <View style={styles.sectionContainer}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: isDarkMode ? Colors.white : Colors.black,
            },
          ]}>
          {title}
        </Text>
        <Text
          style={[
            styles.sectionDescription,
            {
              color: isDarkMode ? Colors.light : Colors.dark,
            },
          ]}>
          {children}
        </Text>
      </View>
    );
  };*/
  
  
  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
 
 
  const App = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const refSectionList = useRef<FlatList>(null);
    const [openMenu, setOpenMenu] = useState(false);
 
    const {width,height} = Dimensions.get('window');
    const y = new Animated.Value(0);
    const onScroll = Animated.event([{nativeEvent:{contentOffset:{y}}}],{useNativeDriver: true});
    const { ref, focusKey } = useFocusable();

    const backgroundStyle = {
      backgroundColor: isDarkMode ? 'black' : 'white',
      flex: 1,
    };
   
    

    /*
    const rendererList = (value: string) => (
      <FlatList
        data={DATA}
        nestedScrollEnabled={true}
        horizontal={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        hasTVPreferredFocus={true}
        disableIntervalMomentum
        renderItem={renderItem}
        keyExtractor={item => {
          console.log(`keyExtractor rendererList:[${value}-${item.id}]`);
          return `${value}-${item.id}`;
        }}
      />
    );
    */
  
    
    /*const rendererLists = () => {
      return LISTS.map(value => {
        console.log(value);
        return rendererList(`list-${value}`);
      });
    };*/
    /*
    return (
      <SafeAreaView style={backgroundStyle}>
        {isTV && (
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        )}
        <View style={styles.container}>
          <View style={styles.containerMenu}>
            <FlatList
              data={DATA_MENU}
              horizontal={false}
              removeClippedSubviews={false}
              numColumns={1}
              renderItem={renderItem}
              keyExtractor={item => `menu-${item.id}`}
            />
          </View>
          <View style={styles.containerItems}>
            <SectionList
              sections={SECTIONS_DATA}
              keyExtractor={(item, index) => item + index}
              renderItem={({item}) => rendererList(item)}
              renderSectionHeader={({section: {title}}) => (
                <Text style={styles.header}>{title}</Text>
              )}
            />
          </View>
        </View>
      </SafeAreaView>
    );*/
 
    const scrollToSection = (sectionIndex:number,itemIndex:number = 1 ) => {
     console.log(`@@ scrollToSection [${sectionIndex}] [${itemIndex}]`);
     /*
     refSectionList.current?.scrollToLocation({
       animated: true,
       sectionIndex,
       itemIndex,
     });*/
    }
 
    /*renderSectionHeader={({section: {title}}) => (
                     <Text style={styles.header}>{title}</Text>
                   )}
                   */
 
   //const renderItem = ({item,index}:any)  => {
   const _rowRender = (type: string | number, data: any, index: number)  => {
     console.log(`@@@@@ renderItem SECTION [${index}]`);
     const id = data.id;
     const title = data.title;
     return(<Gallery galleryId={id} title={title} rowNumber={index} />);
   }
   
   const getItemLayout = (data: any | null | undefined,index: number) => {
     return { length: 240 + 120, offset: (240 + 120) * index, index: index };
   }
  
   /*
   const handleScroll=(event)=>{
     let yOffset=event.nativeEvent.contentOffset.y / 240;
     console.log(`yOffset:[${yOffset}]`);
   }*/
 
   const _layoutProvider = new LayoutProvider(
     index => {
       return ViewTypes.FULL;
     },
     (type, dim) => {
         switch (type) {
             case ViewTypes.HALF_LEFT:
                 dim.width = width / 2;
                 dim.height = 160;
                 break;
             case ViewTypes.HALF_RIGHT:
                 dim.width = width / 2;
                 dim.height = 160;
                 break;
             case ViewTypes.FULL:
                 dim.width = width;
                 dim.height = 240;
                 break;
             default:
                 dim.width = 0;
                 dim.height = 0;
         }
     }
   );
 
   const _handleListEnd = () => {
     console.log("@@@@ _handleListEnd");
   }
 
   const dataProvider = new DataProvider((r1, r2) => {
     return r1 !== r2;
   });
 
   const _dataProvider  = dataProvider.cloneWithRows(SECTIONS_DATA);
   
    return (
      <>
        <SafeAreaView style={styles.safearea}>
            <View style={styles.body}>
              <FocusContext.Provider value={focusKey}>
                <View style={styles.menuContainer}>
                  <Menu focusKey="MENU" />
                </View> 
                <View style={styles.sectionContainer}>
                    <Content sections={SECTIONS_DATA}/>
                </View>
              </FocusContext.Provider>  
            </View>
        </SafeAreaView>
      </>
    );
  };
  /*
 
                   <FlatList
                   ref={refSectionList}
                   data={SECTIONS_DATA}
                   scrollEventThrottle={16}
                   onScroll={(event)=>handleScroll(event)}
                   onEndReachedThreshold={0.5}
                   legacyImplementation={false}
                   keyboardShouldPersistTaps='always'
                   keyExtractor={(item:any, index) => {
                     const key = `section_${item.id}`;
                     console.log(`keyExtractor section:[${key}}]`);
                     return key;
                   }}
                   renderItem={renderItem}
                 /> 
                 */
  const styles = StyleSheet.create({
   safearea:{
     flex: 1,
     marginTop: StatusBar.currentHeight || 0,
   },
    scrollView: {
      backgroundColor: 'black',
    },
    engine: {
      position: 'absolute',
      right: 0,
    },
    body: {
      backgroundColor: 'purple',
      flexDirection: 'row',
      flexWrap: 'wrap',
      flex:1,
      alignItems: 'flex-start'
    },
    menuContainer:{
     flex:0.5,
     alignItems: 'center',
     justifyContent: 'center',
     backgroundColor:'black',
     height:'100%',
     zIndex:10
    },
    sectionContainer: {
      marginTop: 0,
      flex: 4,
      padding:16,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: 'black',
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
      color: 'black',
    },
    highlight: {
      fontWeight: '700',
    },
    footer: {
      color: 'black',
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
      backgroundColor: 'blue',
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    containerMenu: {
      flex: 1,
      width: 100,
      backgroundColor: 'purple',
      alignItems: 'flex-start',
    },
    containerMenuOpen:{
      width:400,
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
  
  export default App;
 