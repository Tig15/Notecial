import {
  View,
  Text,
  Modal,
  StatusBar,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../misc/colors';
import RoundBtnArrow from '../components/RoundBtnArrow';
import {useNavigation} from '@react-navigation/native';

const NoteInputModal = ({visible, onClose, onSubmit, isEdit, note, user}) => {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const navigation = useNavigation();

  const findDate = () => {
    const result = new Date();

    const day = result.getDate();
    const month = result.getMonth();
    const year = result.getFullYear();

    const currentDate = `${day}-${month}-${year}`;
    setDate(currentDate);
  };

  const handleModalClose = () => {
    Keyboard.dismiss();
  };

  const handleOnChangeText = (text, valueFor) => {
    if (valueFor === 'title') setTitle(text);
    if (valueFor === 'desc') setDesc(text);
  };

  const handleSubmit = () => {
    if (!title.trim() || !desc.trim()) {
      Alert.alert(
        'Empty Fields!',
        'Remember! Your Note can be updated later.',
        [
          {
            text: 'Ok',
            onPress: onClose(),
          },
          {
            text: 'Cancel',
            onPress: clearHalfNote(), // We can make function which deletes half-made card [which either contains title or desc. If a person doesn't want to keep so many cards.
          },
        ],
        {
          cancelable: true,
        },
      );
    }

    if (isEdit) {
      // For Edit
    } else {
      onSubmit(title, desc);
      setTitle('');
      setDesc('');
    }
    onClose();
  };

  const closeModal = () => {
    setTitle('');
    setDesc('');
    onClose();
  };

  const clearHalfNote = () => {
    setTitle('');
    setDesc('');
  };

  useEffect(() => {
    findDate();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.DA} />
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={() => onClose()}>
        <View style={styles.modalHead}>
          <Text
            style={
              styles.greet
            }>{`Write Your Today's Note - ${user.name}`}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <View style={styles.textContent}>
          <TextInput
            value={title}
            style={styles.title}
            placeholder="Set Your Title"
            placeholderTextColor="black"
            onChangeText={text => handleOnChangeText(text, 'title')}
          />
          <TextInput
            value={desc}
            multiline
            style={styles.desc}
            placeholder="Write Here"
            placeholderTextColor="black"
            onChangeText={text => handleOnChangeText(text, 'desc')}
          />
          {title.trim() || desc.trim() ? (
            <View style={styles.btnContainer}>
              <RoundBtnArrow
                style={styles.twoBtn}
                size={20}
                antIconName={'check'}
                onPress={handleSubmit}
              />
              <RoundBtnArrow
                style={styles.twoBtn}
                size={20}
                antIconName={'close'}
                onPress={closeModal}
              />
            </View>
          ) : null}
        </View>
        <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={[styles.modalBg, StyleSheet.absoluteFillObject]} />
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalHead: {
    paddingTop: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: colors.DARK,
    paddingBottom: 5,
  },
  greet: {
    fontSize: 18,
    fontFamily: 'CrimsonText-Italic',
    color: colors.DARK,
  },
  textContent: {
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  date: {
    fontSize: 10,
    marginTop: 7,
    marginRight: -10,
    color: colors.DARK,
    fontFamily: 'Kanit-Regular',
  },
  title: {
    borderBottomWidth: 1.5,
    borderBottomColor: colors.VERDA,
    color: colors.DARK,
    fontSize: 15,
    fontFamily: 'Kanit-Regular',
  },
  desc: {
    borderBottomWidth: 1.5,
    borderBottomColor: colors.VERDA,
    marginTop: 30,
    color: colors.DARK,
    height: 100,
    fontFamily: 'Kanit-Regular',
  },
  modalBg: {
    flex: 1,
    zIndex: -1,
    backgroundColor: colors.LIGHT,
  },
  btnContainer: {
    paddingHorizontal: 120,
    marginTop: 30,
    flexDirection: 'row',
    gap: 23,
  },
  twoBtn: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: colors.VERDA,
    paddingLeft: 7,
    paddingTop: 7,
    elevation: 10,
  },
});

export default NoteInputModal;
