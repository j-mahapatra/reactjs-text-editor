import { useContext } from 'react';
import '../styles/header.css';

import { EditorStateContext } from '../contexts/EditorStateProvider';

export default function Header() {
  const { saveToLocalStorage } = useContext(EditorStateContext);

  return (
    <div className='header'>
      <h1 className='header__title'>Demo Editor by Jagannath Mahapatra</h1>
      <button className='header__button' onClick={saveToLocalStorage}>
        Save
      </button>
    </div>
  );
}
