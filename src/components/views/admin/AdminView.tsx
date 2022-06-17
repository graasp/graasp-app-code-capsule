import React, { FC, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Code, TableChart } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab } from '@mui/material';

import { CodeContexts } from '../../../config/codeVersions';
import {
  PRESET_VIEW_PANE_CYPRESS,
  TABLE_VIEW_PANE_CYPRESS,
  TAB_PRESET_VIEW_CYPRESS,
  TAB_TABLE_VIEW_CYPRESS,
} from '../../../config/selectors';
import PresetView from '../../common/CodeReviewWrapper';
import { CodeEditingProvider } from '../../context/CodeEditingContext';
import { CodeVersionProvider } from '../../context/CodeVersionContext';
import SettingsFab from './SettingsFab';
import TableView from './TableView';

enum TABS {
  TABLE_VIEW = 'TABLE_VIEW',
  PRESET_VIEW = 'PRESET_VIEW',
}

const AdminView: FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(TABS.TABLE_VIEW);

  const renderTable = (): ReactElement => (
    <TabContext value={activeTab}>
      <TabList
        textColor="secondary"
        indicatorColor="secondary"
        onChange={(_, newTab: TABS) => setActiveTab(newTab)}
        centered
      >
        <Tab
          data-cy={TAB_TABLE_VIEW_CYPRESS}
          value={TABS.TABLE_VIEW}
          label={t('Table View')}
          icon={<TableChart />}
          iconPosition="start"
        />
        <Tab
          data-cy={TAB_PRESET_VIEW_CYPRESS}
          value={TABS.PRESET_VIEW}
          label={t('Preset View')}
          icon={<Code />}
          iconPosition="start"
        />
      </TabList>
      <TabPanel value={TABS.TABLE_VIEW} data-cy={TABLE_VIEW_PANE_CYPRESS}>
        <TableView />
      </TabPanel>
      <TabPanel value={TABS.PRESET_VIEW} data-cy={PRESET_VIEW_PANE_CYPRESS}>
        <PresetView />
      </TabPanel>
    </TabContext>
  );

  return (
    <CodeVersionProvider>
      <CodeEditingProvider context={CodeContexts.Instructor}>
        {renderTable()}
        <SettingsFab />
      </CodeEditingProvider>
    </CodeVersionProvider>
  );
};

export default AdminView;
