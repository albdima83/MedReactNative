import React from 'react';
import {useState, useEffect} from 'react';
import {StyleSheet, Animated, Image, ActivityIndicator, Platform} from 'react-native';
//import {Colors} from 'react-native/Libraries/NewAppScreen';
import AppConfig from '../configurations/appconfig';
import {RemoteConfigMockup} from '../mockup';
import APIService from '../services/apiservice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';

const Logo = require('../images/logo-mplay-infinity-new.png');

type SplashScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SplashScreen'
>;

const SplashScreen: React.FC<SplashScreenProps> = props => {
  const [isHomeLoaded, setIsHomeLoaded] = useState(false);
  const fadeOutSplashscren = React.useRef(new Animated.Value(1)).current;

  const _loadApplication = async () => {
    AppConfig.remoteConfig = RemoteConfigMockup;
    console.log(`AppConfig.navMain: [${AppConfig.navMain}]`);
    console.log(`AppConfig.homepage: [${AppConfig.homepage}]`);
    const data = await APIService.anonymousLogin();
    console.log(data);
    console.log(data?.response);
    if (data) {
      try {
        await AsyncStorage.setItem(
          'it.mediaset.authorization',
          data?.response?.beToken ?? '',
        );
        await AsyncStorage.setItem(
          'it.mediaset.sid',
          data?.response?.sid ?? '',
        );
      } catch (ex) {
        console.log(ex);
      }
    }
    console.log('@@@ change root');
    setIsHomeLoaded(true);
    props.navigation.push('TabHomeScreen');
  };

  useEffect(() => {
    _loadApplication();
  }, []);

  useEffect(() => {
    if (isHomeLoaded) {
      Animated.timing(fadeOutSplashscren, {
        toValue: 0,
        duration: 500,
        useNativeDriver: Platform.OS !== "web",
      }).start();
    }
  }, [isHomeLoaded]);

  const _rendererSplashScreen = () => {
    return (
      <Animated.View
        style={[
          styles.splashContainer,
          {
            opacity: fadeOutSplashscren, // Bind opacity to animated value
          },
        ]}>
        <Image style={styles.splashLogo} source={Logo} />
        <ActivityIndicator size="large" color="#fff" />
      </Animated.View>
    );
  };

  return _rendererSplashScreen();
};

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    
  },
  scrollView: {
    
  },
  splashContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0a0a0a',
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
    backgroundColor: 'purple',
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
    flex: 1,
    flexGrow: 1,
    padding: 16,
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

export default SplashScreen;
