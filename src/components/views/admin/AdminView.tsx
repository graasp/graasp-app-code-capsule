import React, { FC, ReactElement, useState } from 'react';
import { Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { Code, TableChart } from '@mui/icons-material';
import TableView from './TableView';
import {
  PRESET_VIEW_PANE_CYPRESS,
  TAB_PRESET_VIEW_CYPRESS,
  TAB_TABLE_VIEW_CYPRESS,
  TABLE_VIEW_PANE_CYPRESS,
} from '../../../config/selectors';
import SettingsFab from './SettingsFab';
import PresetView from '../../common/CodeReviewWrapper';

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
    <>
      {renderTable()}
      <SettingsFab />
    </>
  );
};

export default AdminView;
