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
import withFirebase from '../HOC/withFirebase';
import {useTranslation} from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// fa39cd1b-3ef3-4b31-ae3a-4d3bc17d34eb  -- APP ID [OneSignal]

const Intro = ({userData, setUserData}) => {
  const {name} = userData;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('en');
  const [items, setItems] = useState([
    {label: 'English', value: 'en'},
    {label: 'Spanish', value: 'sp'},
  ]);

  const {t, i18n} = useTranslation();

  useEffect(() => {
    AsyncStorage.getItem('selectedValue')
      .then(selectedValue => {
        if (selectedValue) {
          setValue(selectedValue);
          i18n.changeLanguage(selectedValue);
        }
      })
      .catch(error => {
        console.log('Error Fetching Your Language', error);
      });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('selectedValue', value)
      .then(() => {
        i18n.changeLanguage(value);
      })
      .catch(error => {
        console.log('Error Saving Your Language', error);
      });
  }, [value]);

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

      setUserData({...values, userID: userID});

      navigation.reset({
        index: 0,
        routes: [{name: 'NoteScreen'}],
      });

      setLoading(false);
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
        <DropDownPicker
          style={{
            minHeight: 20,
          }}
          containerStyle={{
            width: '30%',
            minHeight: 20,
            position: 'absolute',
            bottom: 50,
            left: 30,
          }}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />
        <View style={styles.container}>
          <Text style={styles.text}>{t('headerTitle')}</Text>
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
                  placeholder={t('name')}
                />
                {errors.name && touched.name && (
                  <Text style={styles.error}>{errors.name}</Text>
                )}
                <TextInput
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  style={styles.textInput}
                  placeholder={t('email')}
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
                  placeholder={t('password')}
                  secureTextEntry
                />
                {errors.password && touched.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={!isValid}
                  style={styles.subBtn}>
                  <Text style={styles.getIn}>{t('button')}</Text>
                </TouchableOpacity>
                <View style={styles.timtim}>
                  <Text>{t('account')}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.reset({
                        index: 0,
                        routes: [{name: 'Login'}],
                      })
                    }>
                    <Text style={styles.getInt}>{t('login')}</Text>
                  </TouchableOpacity>
                </View>
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
    .matches(
      /^(?=.*[a-z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
      'Must contain 6 characters, one uppercase, one lowercase, one number and one special case character',
    )
    .required('Password is required for further purpose.'),
});

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
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
    width: '30%',
    borderWidth: 2,
    borderColor: colors.VERDA,
    borderRadius: 3,
    backgroundColor: colors.VERDA,
    marginTop: 15,
    elevation: 10,
  },
  getIn: {
    fontSize: 14,
    padding: 4,
    color: colors.FRONT,
    textAlign: 'center',
    fontFamily: 'Merriweather-Regular',
    textTransform: 'uppercase',
  },
  getInt: {
    fontSize: 14,
    padding: 4,
    textAlign: 'center',
  },
  timtim: {
    marginTop: 10,
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
