import React from 'react';
import {StatusBar, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {ApolloProvider} from '@apollo/client';
import {client} from './src/apollo/index';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabHomeScreen from './src/screens/TabHomeScreen';
import SplashScreen from './src/screens/Splashscreen';
import {RootStackParamList} from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
console.log(Platform);
const isTV = Platform.isTV;
console.log(`isTV: [${isTV}]`);

export interface ICustomButton {
  title: string;
}

export interface CarouselItem {
  id: string;
  title: string;
}

const App = () => {
  return (
    <>
      {isTV && <StatusBar barStyle="dark-content" />}
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{
              title: 'Home',
              headerShown: false, //!isTV,
            }}
          />
          <Stack.Screen
            name="TabHomeScreen"
            component={TabHomeScreen}
            options={{
              title: 'Home',
              headerShown: false, //!isTV,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const AppWrapper = () => {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
};

export default AppWrapper;
