import React, { FC } from 'react';
import './App.css';
import { LEARN_REACT_LINK_CYPRESS } from './config/selectors';

const App: FC = () => (
  <div className="App">
    <header className="App-header">
      <p>
        Here <code>src/App.tsx</code> and save to reload.
      </p>
      <p>Hello world</p>
      <a
        className="App-link"
        data-cy={LEARN_REACT_LINK_CYPRESS}
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  </div>
);

export default App;
