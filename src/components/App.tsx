import React, { FC, ReactElement } from 'react';
import { useContextContext } from './context/ContextContext';
import { TokenProvider } from './context/TokenContext';
import { CONTEXTS } from '../config/settings';
import BuilderView from './views/admin/BuilderView';
import PlayerView from './views/read/PlayerView';

const App: FC = () => {
  const { context } = useContextContext();

  const renderContent = (): ReactElement => {
    switch (context) {
      // eslint-disable-next-line default-case-last
      case CONTEXTS.BUILDER:
        return <BuilderView />;

      case CONTEXTS.ANALYZER:
        return <div>Analyzer view is a work in progress</div>;

      case CONTEXTS.PLAYER:
      default:
        return <PlayerView />;
    }
  };

  return <TokenProvider>{renderContent()}</TokenProvider>;
};

export default App;
