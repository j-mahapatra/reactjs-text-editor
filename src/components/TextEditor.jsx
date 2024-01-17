import { useEffect, useRef, useState } from 'react';
import { Editor, EditorState, Modifier, RichUtils } from 'draft-js';
import '../styles/text-editor.css';
import 'draft-js/dist/Draft.css';

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

      const currentStyle = newEditorState.getCurrentInlineStyle();

      let newEditorStateWithoutBold;

      if (currentStyle.has('BOLD')) {
        newEditorStateWithoutBold = RichUtils.toggleInlineStyle(
          newEditorState,
          'BOLD'
        );
      }

      setEditorState(newEditorStateWithoutBold ?? newEditorState);
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
    } else if (blockText === '* ') {
      const contentState = currentEditorState.getCurrentContent();

      const newContentState = Modifier.replaceText(
        contentState,
        currentEditorState.getSelection().merge({
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

      const newEditorStateWithStyle = RichUtils.toggleInlineStyle(
        newEditorState,
        'BOLD'
      );
      setEditorState(newEditorStateWithStyle);
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
