import { useEffect, useRef, useState } from 'react';
import { Editor, EditorState, Modifier, RichUtils } from 'draft-js';
import '../styles/text-editor.css';

export default function TextEditor() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const editor = useRef(null);

  useEffect(() => {
    editor.current.focus();
  }, []);

  const onChange = (currentEditorState) => {
    const currentSelection = currentEditorState.getSelection();
    const blockKey = currentSelection.getStartKey();
    const currentBlock = currentEditorState
      .getCurrentContent()
      .getBlockForKey(blockKey);
    const blockText = currentBlock.getText();

    if (blockText === '') {
      const contentState = currentEditorState.getCurrentContent();
      const newContentState = Modifier.setBlockType(
        contentState,
        currentSelection,
        'unstyled'
      );
      const newEditorState = EditorState.push(
        currentEditorState,
        newContentState,
        'replace-block'
      );
      setEditorState(newEditorState);
      return;
    } else if (blockText === '# ') {
      const contentState = currentEditorState.getCurrentContent();
      const newContentStateWithType = Modifier.setBlockType(
        contentState,
        currentSelection,
        'header-one'
      );
      const newContentState = Modifier.replaceText(
        newContentStateWithType,
        currentSelection.merge({
          anchorOffset: 0,
          focusOffset: contentState.getBlockForKey(blockKey).getText().length,
        }),
        ''
      );

      const newEditorState = EditorState.push(
        currentEditorState,
        newContentState,
        'replace-block'
      );
      setEditorState(newEditorState);
      return;
    }
    setEditorState(currentEditorState);
  };

  return (
    <div className='editor-container'>
      <div
        className='editor-container__wrapper'
        onClick={() => {
          editor.current.focus();
        }}
      >
        <Editor ref={editor} editorState={editorState} onChange={onChange} />
      </div>
    </div>
  );
}
