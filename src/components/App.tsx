import React, { FC, ReactElement } from 'react';
import '../App.css';
import { Header } from '@graasp/ui';
import { useContextContext } from './context/ContextContext';
import { TokenProvider } from './context/TokenContext';
import { CONTEXTS } from '../config/settings';
import Builder from './views/Builder';

const App: FC = () => {
  const { context } = useContextContext();

  const renderContent = (): ReactElement => {
    switch (context) {
      // eslint-disable-next-line default-case-last
      default:
      case CONTEXTS.BUILDER:
        return (
          <>
            <Header hasSidebar={false} />
            <Builder />
          </>
        );
    }
  };

  return <TokenProvider>{renderContent()}</TokenProvider>;
};

export default App;
