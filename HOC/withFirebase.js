import React, {useEffect, useState} from 'react';
import firebase from '@react-native-firebase/app';
import {createUserWithEmailAndPassword} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const withFirebase = WrappedComponent => {
  const EnhancedComponent = props => {
    const [userData, setUserData] = useState({});
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const currentUser = firebase.auth().currentUser;

        if (currentUser) {
          const userId = currentUser.uid;
          const userRef = firestore().collection('users').doc(userId);
          const userDoc = await userRef.get();

          if (userDoc.exists) {
            setUserData(userDoc.data());
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error Fetching User Data', error);
        setLoading(false);
      }
    };

    const findNotes = async () => {
      const currentUser = firebase.auth().currentUser;
      const userRef = firestore().collection('users').doc(currentUser.uid);

      try {
        setLoading(true);
        const noteSnap = await userRef.collection('notes').get();
        const notesData = noteSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(notesData);
        setLoading(false);
      } catch (error) {
        console.error('Error Fetching Notes', error);
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchUserData();
      findNotes();
    }, []);

    const deleteNote = async note => {
      try {
        const currentUser = firebase.auth().currentUser;
        const userRef = firestore().collection('users').doc(currentUser.uid);
        const noteId = note.id;
        const noteRef = userRef.collection('notes').doc(noteId);

        await noteRef.delete();

        const updatedNotes = notes.filter(note => note.id !== noteId);
        setNotes(updatedNotes);

        props.navigation.goBack();
      } catch (error) {
        console.error('Error deleting note', error);
      }
    };

    const updateNote = async (note, title, desc, time) => {
      try {
        const currentUser = firebase.auth().currentUser;
        const userRef = firestore().collection('users').doc(currentUser.uid);
        const noteId = note.id;
        const noteRef = userRef.collection('notes').doc(noteId);

        await noteRef.update({
          title,
          desc,
          time,
        });

        const updatedNotes = notes.map(note =>
          note.id === noteId ? {...note, title, desc, time} : note,
        );
        console.log(updatedNotes);

        setNotes(updatedNotes);
      } catch (error) {
        console.error('Error updating note', error);
      }
    };

    return (
      <WrappedComponent
        {...props}
        userData={userData}
        setUserData={setUserData}
        notes={notes}
        setNotes={setNotes}
        findNotes={findNotes}
        deleteNote={deleteNote}
        updateNote={updateNote}
        fetchData={fetchUserData}
      />
    );
  };

  return EnhancedComponent;
};

export default withFirebase;
