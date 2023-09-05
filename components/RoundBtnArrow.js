import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../misc/colors';
import {StyleSheet, TouchableOpacity} from 'react-native';

const RoundBtnArrow = ({antIconName, onPress, style, size}) => {
  return (
    <TouchableOpacity>
      <AntDesign
        name={antIconName}
        color={colors.PLATI}
        size={size}
        style={style}
        onPress={onPress}
      />
    </TouchableOpacity>
  );
};

export default RoundBtnArrow;
