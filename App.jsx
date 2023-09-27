import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import firebase from '@react-native-firebase/app';
import androidConfig from './firebaseConfig';
import withFirebase from './HOC/withFirebase';
import Intro from './screens/Intro';
import SplashScreen from 'react-native-lottie-splash-screen';
import NoteScreen from './screens/NoteScreen';
import NoteDetail from './components/NoteDetail';
import NoteProvider from './context/NoteProvider';
import LoginScreen from './screens/LoginScreen';
import InitialScreen from './screens/InitialScreen';

const Stack = createStackNavigator();

if (!firebase.apps.length) {
  firebase.initializeApp(androidConfig);
} else {
  firebase.app(); // if already initialized, use this one
}

function App({route}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(authenticatedUser => {
        setUser(authenticatedUser);
      });

    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NavigationContainer>
      <NoteProvider>
        <Stack.Navigator
          screenOptions={{
            headerTitle: '',
            headerTransparent: true,
          }}>
          {user ? (
            <Stack.Screen options={{headerShown: false}} name="NoteScreen">
              {() => (
                <NoteScreen
                  userName={user.displayName || ''}
                  userAuthenticated={true}
                />
              )}
            </Stack.Screen>
          ) : (
            <Stack.Screen
              options={{headerShown: false}}
              component={InitialScreen}
              name="Init"
            />
          )}
          <Stack.Screen
            options={{headerShown: false}}
            component={Intro}
            name="FirstScreen"
          />
          <Stack.Screen
            options={{headerShown: false}}
            component={LoginScreen}
            name="Login"
          />
          <Stack.Screen component={NoteDetail} name="NoteDetails" />
        </Stack.Navigator>
      </NoteProvider>
    </NavigationContainer>
  );
}

export default withFirebase(App);
