import { useContext, useEffect, useRef } from 'react';
import { Editor, EditorState, Modifier, RichUtils } from 'draft-js';
1;
import '../styles/text-editor.css';
import { EditorStateContext } from '../contexts/EditorStateProvider';

const styleMap = {
  RED: {
    color: 'red',
  },
};

export default function TextEditor() {
  const { editorState, setEditorState } = useContext(EditorStateContext);
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

      let newEditorStateWithoutStyle;
      if (currentStyle.has('BOLD')) {
        newEditorStateWithoutStyle = RichUtils.toggleInlineStyle(
          newEditorState,
          'BOLD'
        );
      } else if (currentStyle.has('RED')) {
        newEditorStateWithoutStyle = RichUtils.toggleInlineStyle(
          newEditorState,
          'RED'
        );
      } else if (currentStyle.has('UNDERLINE')) {
        newEditorStateWithoutStyle = RichUtils.toggleInlineStyle(
          newEditorState,
          'UNDERLINE'
        );
      }
      setEditorState(newEditorStateWithoutStyle ?? newEditorState);
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
    } else if (blockText === '** ') {
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
        'RED'
      );
      setEditorState(newEditorStateWithStyle);
      return;
    } else if (blockText === '*** ') {
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
        'UNDERLINE'
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
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={onChange}
          customStyleMap={styleMap}
        />
      </div>
    </div>
  );
}
