import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from 'react-native-lottie-splash-screen';
import firebase from '@react-native-firebase/app';
import androidConfig from './firebaseConfig';
import withFirebase from './HOC/withFirebase';
import Intro from './screens/Intro';
import NoteScreen from './screens/NoteScreen';
import NoteDetail from './components/NoteDetail';
import NoteProvider from './context/NoteProvider';
import NoteInputModal from './components/NoteInputModal';

const Stack = createStackNavigator();

if (!firebase.apps.length) {
  firebase.initializeApp(androidConfig);
} else {
  firebase.app(); // if already initialized, use this one
}

function App({userData}) {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  return (
    <NavigationContainer>
      <NoteProvider>
        <Stack.Navigator
          screenOptions={{
            headerTitle: '',
            headerTransparent: true,
          }}>
          <Stack.Screen component={Intro} name="FirstScreen" />
          <Stack.Screen options={{headerShown: false}} name="NoteScreen">
            {({route}) => (
              <NoteScreen
                userData={route.params ? route.params.userData : {}}
              />
            )}
          </Stack.Screen>
          <Stack.Screen component={NoteDetail} name="NoteDetails" />
        </Stack.Navigator>
      </NoteProvider>
    </NavigationContainer>
  );
}

// Line 39 - GPT

export default withFirebase(App);
