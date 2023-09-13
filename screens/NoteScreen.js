import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from 'react-native';
import colors from '../misc/colors';
import RoundBtnArrow from '../components/RoundBtnArrow';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Note from '../components/Note';
import {useNotes} from '../context/NoteProvider';
import NotFound from '../components/NotFound';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import withFirebase from '../HOC/withFirebase';
import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import NoteInputModal from '../Modal/NoteInputModal';

const NoteScreen = ({userData, setUserData, fetchData}) => {
  const [greet, setGreet] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const {notes, setNotes, findNotes} = useNotes();
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const findGreet = () => {
    const time = new Date().getHours();
    if (time === 5 || time < 12) return setGreet('Pour Your Fresh Thoughts!');
    if (time === 1 || time < 17) return setGreet('Weary Day? Tell me.');
    if (time === 17 || time < 20)
      return setGreet('The sun sets. Yet you can come here!');
    setGreet('No slumber! So write, dreamerer.');
  };

  useEffect(() => {
    findGreet();
  }, []);

  useEffect(() => {
    fetchData();
    findNotes();
  }, []);

  const handleOnSubmit = async (title, desc) => {
    const currentUser = firebase.auth().currentUser;
    const userRef = firestore().collection('users').doc(currentUser.uid);
    try {
      const note = {title, desc, time: Date.now()};

      const noteRef = await userRef.collection('notes').add(note);
      const noteId = noteRef.id;
      console.log(noteRef);

      const updatedNotes = [...notes, {id: noteId, ...note}];
      setNotes(updatedNotes);
    } catch (error) {
      console.log('Error Handling Your Notes', error);
    }
  };

  const openNote = note => {
    navigation.navigate('NoteDetails', {note: {...note, id: note.id}});
  };

  const handleSearchInput = async text => {
    setSearchQuery(text);
    if (!text.trim()) {
      setSearchQuery('');
      setNotFound(false);
      return await findNotes();
    }
    const filteredNotes = notes.filter(note => {
      if (note.title.toLowerCase().includes(text.toLowerCase())) {
        return note;
      }
    });

    if (filteredNotes.length) {
      setNotes([...filteredNotes]);
    } else {
      setNotFound(true);
    }
  };

  const handleClear = async () => {
    setSearchQuery('');
    setNotFound(false);
    return await findNotes();
  };

  const logOut = () => {
    try {
      setUserData([]);
      setNotes([]);
      setLoading(true);

      firebase.auth().signOut();

      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      console.log('Error Logging Out.', error);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.mainContainer}>
          <View style={styles.container}>
            {userData.name ? (
              <Text style={styles.title}>{userData.name}</Text>
            ) : null}
            <Text style={styles.greet}>{`~ ${greet}`}</Text>
          </View>
          {notes.length ? (
            <View style={styles.btnContent}>
              <TextInput
                style={styles.searchBar}
                placeholder="Search Here..."
                placeholderTextColor="black"
                value={searchQuery}
                onChangeText={handleSearchInput}
              />
              {searchQuery.length ? (
                <AntDesign
                  style={styles.closed}
                  name="close"
                  size={20}
                  color={colors.DARK}
                  onPress={handleClear}
                />
              ) : null}
            </View>
          ) : null}
          {notFound ? (
            <NotFound />
          ) : (
            <FlatList
              style={styles.cardNotes}
              data={notes}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                marginBottom: 15,
              }}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <Note onPress={() => openNote(item)} item={item} />
              )}
            />
          )}
          {!notes.length ? (
            <View
              style={[styles.emptyContainer, StyleSheet.absoluteFillObject]}>
              <Text style={styles.emptyHeader}>Add Notes</Text>
            </View>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
      <RoundBtnArrow
        onPress={() => setModalVisible(true)}
        style={styles.addBtn}
        antIconName={'pluscircleo'}
        size={20}
      />
      <RoundBtnArrow
        onPress={logOut}
        style={styles.logBtn}
        antIconName={'logout'}
        size={18}
      />
      <NoteInputModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleOnSubmit}
        user={userData}
      />
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.PLATI,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 7,
  },
  greet: {
    fontSize: 14,
    marginTop: 18,
    marginRight: 10,
    fontFamily: 'CrimsonText-Regular',
    color: colors.DARK,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.DARK,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Merriweather-Regular',
    marginTop: 10,
    marginLeft: 20,
    color: colors.DARK,
    borderBottomWidth: 1,
    borderBottomColor: colors.DARK,
    padding: 2,
  },
  searchBar: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.HAZEL,
    borderRadius: 30,
    paddingLeft: 15,
    fontSize: 15,
    marginLeft: 20,
    marginTop: 10,
    width: '90%',
  },
  cardNotes: {
    marginTop: 20,
    paddingHorizontal: 30,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyHeader: {
    fontSize: 26,
    textTransform: 'uppercase',
    opacity: 0.6,
    fontFamily: 'Kanit-Regular',
  },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: colors.HAZEL,
    paddingLeft: 5.5,
    paddingTop: 5,
    elevation: 10,
    position: 'absolute',
    right: 20,
    bottom: 80,
  },
  logBtn: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: colors.RUBY,
    paddingLeft: 6,
    paddingTop: 6,
    elevation: 10,
    position: 'absolute',
    right: 20,
    bottom: 40,
  },
  btnContent: {
    justifyContent: 'center',
  },
  closed: {
    position: 'absolute',
    right: 40,
    bottom: 14,
  },
});

export default withFirebase(NoteScreen);
