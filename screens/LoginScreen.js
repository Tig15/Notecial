import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import colors from '../misc/colors';
import withFirebase from '../HOC/withFirebase';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

function LoginScreen({navigation, fetchData}) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loggedIn, setloggedIn] = useState(false);

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Enter Your Email Once Again! Invalid')
      .required('Email is required'),
    password: yup
      .string()
      .min(6, ({min}) => `Password must be ${min} characters.`)
      .required('Password is required'),
  });

  const handleLogin = async values => {
    setLoading(true);
    setLoadingData(true);

    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(values.email, values.password);
      await fetchData();

      navigation.reset({
        index: 0,
        routes: [{name: 'NoteScreen'}],
      });
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }

    setLoadingData(false);
    setLoading(false);
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken} = await GoogleSignin.signIn();
      setloggedIn(true);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert(
          'Are you sure?',
          'You can log with google service to sync your data.',
          [
            {
              text: 'Ok',
            },
          ],
        );
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Signin in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('PLAY_SERVICES_NOT_AVAILABLE');
      } else {
        // some other error happened
      }
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'],
      webClientId:
        '987178408360-a29uk5tncqtnqge1jkp4q64e72fvo51e.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.DARK} />
      ) : (
        <>
          <Text style={styles.text}>Get Back To Your Note-Cial</Text>
          <Formik
            initialValues={{email: '', password: ''}}
            validationSchema={validationSchema}
            onSubmit={handleLogin}>
            {({
              values,
              handleChange,
              handleSubmit,
              errors,
              touched,
              isValid,
            }) => (
              <>
                <TextInput
                  placeholder="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  style={styles.input}
                />
                {touched.email && errors.email && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}

                <TextInput
                  placeholder="Password"
                  secureTextEntry
                  value={values.password}
                  onChangeText={handleChange('password')}
                  style={styles.input}
                />
                {touched.password && errors.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}

                <Button
                  title="Login"
                  onPress={handleSubmit}
                  disabled={!isValid || loading}
                />
                <TouchableOpacity
                  style={styles.acc}
                  onPress={() =>
                    navigation.reset({
                      index: 0,
                      routes: [{name: 'FirstScreen'}],
                    })
                  }>
                  <Text>Create User Account?</Text>
                </TouchableOpacity>

                <View>
                  <Text style={{textAlign: 'center', marginTop: 20}}>OR</Text>
                  <GoogleSigninButton
                    style={{width: 60, height: 40, borderRadius: 10}}
                    size={GoogleSigninButton.Size.Icon}
                    color={GoogleSigninButton.Color.Light}
                    onPress={signIn}
                  />
                </View>
              </>
            )}
          </Formik>
        </>
      )}
    </View>
  );
}

const width = Dimensions.get('window').width - 100;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.FRONT,
  },
  text: {
    alignSelf: 'center',
    paddingBottom: 20,
    opacity: 0.9,
    fontFamily: 'Merriweather-Regular',
    color: colors.DARK,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.HAZEL,
    width: width,
    height: 50,
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 16,
    color: colors.HAZEL,
    marginBottom: 16,
  },
  error: {
    color: colors.RUBY,
    fontSize: 12,
    marginBottom: 10,
    paddingBottom: 4,
    width: '100%',
    textAlign: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.DARK,
  },
  acc: {
    marginTop: 10,
  },
});

export default withFirebase(LoginScreen);
