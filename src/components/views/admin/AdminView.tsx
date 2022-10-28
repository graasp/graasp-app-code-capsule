import React, { FC, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Code, Settings, TableChart } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab } from '@mui/material';

import {
  PRESET_VIEW_PANE_CYPRESS,
  SETTINGS_VIEW_PANE_CYPRESS,
  TABLE_VIEW_PANE_CYPRESS,
  TAB_PRESET_VIEW_CYPRESS,
  TAB_SETTINGS_VIEW_CYPRESS,
  TAB_TABLE_VIEW_CYPRESS,
} from '../../../config/selectors';
import { AppModeProvider } from '../../context/AppModeContext';
import { CodeVersionProvider } from '../../context/CodeVersionContext';
import PresetView from './PresetView';
import SettingsFab from './SettingsFab';
import TableView from './TableView';
import SettingsView from './settings/SettingsView';

enum Tabs {
  TABLE_VIEW = 'TABLE_VIEW',
  SETTINGS_VIEW = 'SETTINGS_VIEW',
  PRESET_VIEW = 'PRESET_VIEW',
}

const AdminView: FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(Tabs.TABLE_VIEW);

  const renderTable = (): ReactElement => (
    <TabContext value={activeTab}>
      <TabList
        textColor="secondary"
        indicatorColor="secondary"
        onChange={(_, newTab: Tabs) => setActiveTab(newTab)}
        centered
      >
        <Tab
          data-cy={TAB_TABLE_VIEW_CYPRESS}
          value={Tabs.TABLE_VIEW}
          label={t('Table View')}
          icon={<TableChart />}
          iconPosition="start"
        />
        <Tab
          data-cy={TAB_SETTINGS_VIEW_CYPRESS}
          value={Tabs.SETTINGS_VIEW}
          label={t('Settings View')}
          icon={<Settings />}
          iconPosition="start"
        />
        <Tab
          data-cy={TAB_PRESET_VIEW_CYPRESS}
          value={Tabs.PRESET_VIEW}
          label={t('Preset View')}
          icon={<Code />}
          iconPosition="start"
        />
      </TabList>
      <TabPanel value={Tabs.TABLE_VIEW} data-cy={TABLE_VIEW_PANE_CYPRESS}>
        <TableView />
      </TabPanel>
      <TabPanel value={Tabs.SETTINGS_VIEW} data-cy={SETTINGS_VIEW_PANE_CYPRESS}>
        <AppModeProvider>
          <SettingsView />
        </AppModeProvider>
      </TabPanel>
      <TabPanel value={Tabs.PRESET_VIEW} data-cy={PRESET_VIEW_PANE_CYPRESS}>
        <PresetView />
      </TabPanel>
    </TabContext>
  );

  return (
    <CodeVersionProvider>
      {renderTable()}
      <SettingsFab />
    </CodeVersionProvider>
  );
};

export default AdminView;
