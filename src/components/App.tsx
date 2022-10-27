import React, { FC, ReactElement, useEffect } from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { Context } from '@graasp/sdk';

import i18n from '../config/i18n';
import { ANALYZER_VIEW_CYPRESS } from '../config/selectors';
import { DEFAULT_CONTEXT_LANGUAGE } from '../config/settings';
import { AppDataProvider } from './context/AppDataContext';
import { MembersProvider } from './context/MembersContext';
import { SettingsProvider } from './context/SettingsContext';
import BuilderView from './views/admin/BuilderView';
import PlayerView from './views/read/PlayerView';

const App: FC = () => {
  const context = useLocalContext();

  useEffect(() => {
    // handle a change of language
    const lang = context?.get('lang') ?? DEFAULT_CONTEXT_LANGUAGE;
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [context]);

  const renderContent = (): ReactElement => {
    switch (context.get('context')) {
      // eslint-disable-next-line default-case-last
      case Context.BUILDER:
        return <BuilderView />;

      case Context.ANALYTICS:
        return <div data-cy={ANALYZER_VIEW_CYPRESS}>Analyzer View</div>;

      case Context.PLAYER:
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
