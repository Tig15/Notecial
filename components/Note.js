import {Text, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import colors from '../misc/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Note = ({item, onPress}) => {
  const {title, desc} = item;
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{desc}</Text>
    </TouchableOpacity>
  );
};

const width = Dimensions.get('window').width - 45;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.GOLVER,
    width: width / 2 - 15,
    padding: 8,
    borderRadius: 10,
  },
  title: {
    fontFamily: 'Kanit-Regular',
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    fontSize: 18,
    color: colors.DARK,
  },
  desc: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginTop: 6,
    marginLeft: 2,
  },
});

export default Note;
