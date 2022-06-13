import React, { FC, ReactElement, useContext } from 'react';
import { HOC } from '@graasp/apps-query-client';
import { CONTEXTS } from '../config/settings';
import BuilderView from './views/admin/BuilderView';
import PlayerView from './views/read/PlayerView';
import { MembersProvider } from './context/MembersContext';

const App: FC = () => {
  const context = useContext(HOC.Context);
  const renderContent = (): ReactElement => {
    switch (context.get('context')) {
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

  return <MembersProvider>{renderContent()}</MembersProvider>;
};

export default App;
