import React, { FC, ReactElement, useState } from 'react';
import { Tab, Button } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { Code, TableChart } from '@mui/icons-material';
import { AppData } from '@graasp/apps-query-client/dist/src/types';
import TableView from './TableView';
import { MUTATION_KEYS, useMutation } from '../../../config/queryClient';
import { APP_DATA_TYPES } from '../../../config/appDataTypes';
import {
  PRESET_VIEW_PANE_CYPRESS,
  TAB_PRESET_VIEW_CYPRESS,
  TAB_TABLE_VIEW_CYPRESS,
  TABLE_VIEW_PANE_CYPRESS,
} from '../../../config/selectors';
import SettingsFab from './SettingsFab';
import { SettingsProvider } from '../../context/SettingsContext';

enum TABS {
  TABLE_VIEW = 'TABLE_VIEW',
  PRESET_VIEW = 'PRESET_VIEW',
}

const AdminView: FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(TABS.TABLE_VIEW);

  const { mutate: postAppData } = useMutation<
    unknown,
    unknown,
    Partial<AppData>
  >(MUTATION_KEYS.POST_APP_DATA);

  const renderTable = (): ReactElement => (
    <TabContext value={activeTab}>
      <TabList
        textColor="secondary"
        indicatorColor="secondary"
        onChange={(_, newTab) => setActiveTab(newTab)}
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
        <Button
          onClick={() =>
            postAppData({
              data: { content: 'message' },
              type: APP_DATA_TYPES.COMMENT,
            })
          }
        >
          Add app data
        </Button>
      </TabPanel>
    </TabContext>
  );

  return (
    <SettingsProvider>
      {renderTable()}
      <SettingsFab />
    </SettingsProvider>
  );
};

export default AdminView;
