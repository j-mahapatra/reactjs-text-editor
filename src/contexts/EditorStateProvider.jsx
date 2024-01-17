import { createContext, useState } from 'react';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';

export const EditorStateContext = createContext();

export default function EditorStateProvider({ children }) {
  const loadFromLocalStorage = () => {
    const savedContent = localStorage.getItem('editorState');
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  };
  const [editorState, setEditorState] = useState(() => loadFromLocalStorage());

  const saveToLocalStorage = () => {
    const contentState = editorState.getCurrentContent();
    const contentStateJson = JSON.stringify(convertToRaw(contentState));
    localStorage.setItem('editorState', contentStateJson);
    alert('Editor content saved!');
  };

  return (
    <EditorStateContext.Provider
      value={{ editorState, setEditorState, saveToLocalStorage }}
    >
      {children}
    </EditorStateContext.Provider>
  );
}
