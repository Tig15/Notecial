import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import colors from '../misc/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';

const InitialScreen = ({navigation}) => {
  return (
    <>
      <Image source={require('../img/NoteCial.png')} style={styles.img} />
      <View style={styles.container}>
        <View style={styles.regis}>
          <Text style={styles.text}>New?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('FirstScreen')}>
            <Text style={styles.text}>Get Your Account!</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.log}>
          <Text style={styles.text}>Have you been here?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.text}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  img: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.DARK,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  text: {
    color: colors.PLATI,
    fontSize: 12,
    width: '90%',
    opacity: 0.8,
  },
  regis: {
    position: 'absolute',
    left: 50,
    bottom: 60,
  },
  log: {
    position: 'absolute',
    left: 280,
    bottom: 60,
  },
});

export default InitialScreen;
