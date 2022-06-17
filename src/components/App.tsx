import React, { FC, ReactElement, useContext } from 'react';

import { Context } from '@graasp/apps-query-client';

import { ANALYZER_VIEW_CYPRESS } from '../config/selectors';
import { CONTEXTS } from '../config/settings';
import { AppDataProvider } from './context/AppDataContext';
import { MembersProvider } from './context/MembersContext';
import { SettingsProvider } from './context/SettingsContext';
import BuilderView from './views/admin/BuilderView';
import PlayerView from './views/read/PlayerView';

const App: FC = () => {
  const context = useContext(Context);
  const renderContent = (): ReactElement => {
    switch (context.get('context')) {
      // eslint-disable-next-line default-case-last
      case CONTEXTS.BUILDER:
        return <BuilderView />;

      case CONTEXTS.ANALYZER:
        return <div data-cy={ANALYZER_VIEW_CYPRESS}>Analyzer View</div>;

      case CONTEXTS.PLAYER:
      default:
        return <PlayerView />;
    }
  };

  return (
    <MembersProvider>
      <SettingsProvider>
        <AppDataProvider>{renderContent()}</AppDataProvider>
      </SettingsProvider>
    </MembersProvider>
  );
};

export default App;
