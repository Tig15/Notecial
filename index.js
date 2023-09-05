/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import {LogLevel, OneSignal} from 'react-native-onesignal';

const ONESIGNAL_APP_ID = 'fa39cd1b-3ef3-4b31-ae3a-4d3bc17d34eb';

// OneSignal Initialization
OneSignal.initialize('ONESIGNAL_APP_ID');

OneSignal.Debug.setLogLevel(LogLevel.Verbose);

// requestPermission will show the native iOS or Android notification permission prompt.
// We recommend removing the following code and instead using an In-App Message to prompt for notification permission
OneSignal.Notifications.requestPermission(true);

// Method for listening for notification clicks
OneSignal.Notifications.addEventListener('click', event => {
  console.log('OneSignal: notification clicked:', event);
});

AppRegistry.registerComponent(appName, () => App);
