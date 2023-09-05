import React, {createContext, useContext} from 'react';
import withFirebase from '../HOC/withFirebase';

const NoteContext = createContext();

const NoteProvider = ({children, notes, setNotes, findNotes}) => {
  return (
    <NoteContext.Provider value={{notes, setNotes, findNotes}}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => useContext(NoteContext);

export default withFirebase(NoteProvider);
