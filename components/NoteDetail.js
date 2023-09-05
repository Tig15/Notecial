import React, {useState} from 'react';
import {Text, StyleSheet, ScrollView, View, Alert} from 'react-native';
import colors from '../misc/colors';
import RoundBtnArrow from './RoundBtnArrow';
import NoteUpdateModal from './NoteUpdateModal';
import withFirebase from '../HOC/withFirebase';

const formatDate = ms => {
  const result = new Date(ms);
  const day = result.getDate();
  const mon = result.getMonth();
  const year = result.getFullYear();
  const hrs = result.getHours();
  const min = result.getMinutes();
  const sec = result.getSeconds();

  return `${day}/${mon}/${year} - ${hrs}:${min}:${sec}`;
};

const NoteDetail = ({route, navigation, userData, deleteNote, updateNote}) => {
  const {note} = route.params;
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const displayDeleteAlert = () => {
    Alert.alert(
      'Are You Sure?',
      'This Action will delete your note permanently!',
      [
        {
          text: 'Delete',
          onPress: () => deleteNote(note),
        },
        {
          text: 'No Thanks',
          onPress: () => console.log('No Thanks'),
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  const handleUpdate = (title, desc, time) => {
    updateNote(note, title, desc, time);
  };

  const handleOnClose = () => setShowModal(false);

  const openEditModal = () => {
    setIsEdit(true);
    setShowModal(true);
  };

  return (
    <>
      <ScrollView style={[styles.container, {paddingTop: 75, paddingLeft: 30}]}>
        <Text style={styles.shown}>
          {note.isUpdated
            ? `Updated At ${formatDate(note.time)}`
            : `Created At ${formatDate(note.time)}`}
        </Text>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.desc}>{note.desc}</Text>
      </ScrollView>
      <View style={styles.container}>
        <RoundBtnArrow
          antIconName={'delete'}
          size={22}
          style={[
            styles.detailBtn,
            {backgroundColor: colors.DARK, right: 45, top: 200},
          ]}
          onPress={displayDeleteAlert}
        />
        <RoundBtnArrow
          antIconName={'edit'}
          size={22}
          style={[
            styles.detailBtn,
            {backgroundColor: colors.RUBY, right: 45, top: 250},
          ]}
          onPress={openEditModal}
        />
      </View>
      <NoteUpdateModal
        onClose={handleOnClose}
        onSubmit={handleUpdate}
        visible={showModal}
        isEdit={isEdit}
        note={note}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.AMBER,
    flex: 1,
  },
  title: {
    fontFamily: 'Poppins-Regular',
    fontSize: 22,
    color: colors.DARK,
    borderBottomWidth: 1.5,
    width: '90%',
    paddingLeft: 4,
  },
  desc: {
    paddingTop: 10,
    paddingLeft: 4,
    width: '90%',
  },
  detailBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    paddingLeft: 9,
    paddingTop: 8,
    elevation: 10,
    position: 'absolute',
  },
  shown: {
    position: 'absolute',
    right: 40,
    top: 15,
    fontSize: 8,
    fontWeight: 'bold',
  },
});

export default withFirebase(NoteDetail);
