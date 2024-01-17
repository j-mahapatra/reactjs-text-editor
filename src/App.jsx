import './App.css';

import Header from './components/Header';
import TextEditor from './components/TextEditor';
import EditorStateProvider from './contexts/EditorStateProvider';

function App() {
  return (
    <EditorStateProvider>
      <div className='container'>
        <Header />
        <TextEditor />
      </div>
    </EditorStateProvider>
  );
}

export default App;
