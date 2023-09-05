import {
  View,
  Text,
  Modal,
  StatusBar,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../misc/colors';
import RoundBtnArrow from './RoundBtnArrow';

const NoteUpdateModal = ({visible, onClose, onSubmit, isEdit, note}) => {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (isEdit) {
      setTitle(note.title);
      setDesc(note.desc);
    }
  }, [isEdit]);

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
    if (!title.trim() && !desc.trim()) return onClose();

    if (isEdit) {
      onSubmit(title, desc, Date.now());
    } else {
      onSubmit(title, desc);
      setTitle('');
      setDesc('');
    }
    onClose();
  };

  const closeModal = () => {
    if (isEdit) {
      // For Edit
    } else {
      setTitle('');
      setDesc('');
    }
    onClose();
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
          <Text style={styles.greet}>Fill up or Shorten Here </Text>
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
          <View style={styles.btnContainer}>
            <RoundBtnArrow
              style={styles.twoBtn}
              size={20}
              antIconName={'check'}
              onPress={handleSubmit}
            />
            {title.trim() || desc.trim() ? (
              <RoundBtnArrow
                style={styles.twoBtn}
                size={20}
                antIconName={'close'}
                onPress={closeModal}
              />
            ) : null}
          </View>
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
    borderBottomColor: colors.RUBY,
    color: colors.DARK,
    fontSize: 15,
    fontFamily: 'Kanit-Regular',
  },
  desc: {
    borderBottomWidth: 1.5,
    borderBottomColor: colors.RUBY,
    marginTop: 30,
    color: colors.DARK,
    height: 100,
    fontFamily: 'Kanit-Regular',
  },
  modalBg: {
    flex: 1,
    zIndex: -1,
    backgroundColor: colors.PEARL,
  },
  btnContainer: {
    paddingHorizontal: 120,
    marginTop: 30,
    flexDirection: 'row',
    gap: 15,
  },
  twoBtn: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: colors.RUBY,
    paddingLeft: 7,
    paddingTop: 7,
    elevation: 10,
  },
});

export default NoteUpdateModal;
