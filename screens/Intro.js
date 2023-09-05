import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import colors from '../misc/colors';
import {Formik} from 'formik';
import * as yup from 'yup';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import androidConfig from '../firebaseConfig';
import withFirebase from '../HOC/withFirebase';

// fa39cd1b-3ef3-4b31-ae3a-4d3bc17d34eb  -- APP ID
if (!firebase.apps.length) {
  firebase.initializeApp(androidConfig);
} else {
  firebase.app(); // if already initialized, use this one
}

const Intro = ({userData, setUserData}) => {
  const {name} = userData;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (name) {
      navigation.navigate('NoteScreen', {userName: name});
    }
  }, [name, navigation]); // GPT

  const handleRegistration = async values => {
    try {
      setLoading(true);
      const userCredentials = firebase
        .auth()
        .createUserWithEmailAndPassword(values.email, values.password);
      const userID = (await userCredentials).user.uid;
      const userRef = firestore().collection('users').doc(userID);
      await userRef.set({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      setUserData(values);

      setLoading(false);
      navigation.navigate('NoteScreen');
    } catch (error) {
      Alert.alert('Error Creating Your Account', error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.DARK} />
      <View style={{backgroundColor: colors.FRONT, flex: 1}}>
        <Text style={styles.header}>Note-Cial</Text>
        <View style={styles.container}>
          <Text style={styles.text}>Get YourSelf Started Here!!!</Text>
          <Formik
            validationSchema={getInValidation}
            initialValues={{
              name: '',
              email: '',
              password: '',
            }}
            onSubmit={handleRegistration}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              touched,
              errors,
              isValid,
            }) => (
              <>
                <TextInput
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  style={styles.textInput}
                  placeholder="Enter Your Name"
                />
                {errors.name && touched.name && (
                  <Text style={styles.error}>{errors.name}</Text>
                )}
                <TextInput
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  style={styles.textInput}
                  placeholder="Enter Your Email"
                  keyboardType="email-address"
                />
                {errors.email && touched.email && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}
                <TextInput
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  style={styles.textInput}
                  placeholder="Enter Your Password"
                  secureTextEntry
                />
                {errors.password && touched.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={!isValid}
                  style={styles.subBtn}>
                  <Text style={styles.getIn}>Get In</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </View>
    </>
  );
};

const width = Dimensions.get('window').width - 100;

const getInValidation = yup.object().shape({
  name: yup.string().required('Name is required for further purpose.'),
  email: yup
    .string()
    .email('Please Enter Your Correct Email')
    .required('Email is required for further purpose.'),
  password: yup
    .string()
    .min(6, ({min}) => `Password must be ${min} characters.`)
    .required('Password is required for further purpose.'),
});

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 20,
    left: 100,
    fontSize: 40,
    fontFamily: 'BricolageGrotesque-Regular',
    color: colors.DARK,
    borderBottomWidth: 0.8,
    borderBottomColor: colors.DARK,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    alignSelf: 'center',
    paddingBottom: 20,
    opacity: 0.9,
    fontFamily: 'Merriweather-Regular',
  },
  textInput: {
    borderWidth: 2,
    borderColor: colors.HAZEL,
    width,
    height: 50,
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 16,
    color: colors.HAZEL,
    marginBottom: 16,
  },
  subBtn: {
    borderWidth: 2,
    borderColor: colors.VERDA,
    borderRadius: 8,
    backgroundColor: colors.LIGHT,
    marginTop: 10,
  },
  getIn: {
    padding: 4,
    color: colors.DARK,
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
});

export default withFirebase(Intro);
