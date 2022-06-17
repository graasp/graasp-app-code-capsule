import React, { FC, useContext } from 'react';

import { Context } from '@graasp/apps-query-client';

import { hooks } from '../../../config/queryClient';
import { PERMISSIONS } from '../../../config/settings';
import Loader from '../../common/Loader';
import PlayerView from '../read/PlayerView';
import AdminView from './AdminView';

const BuilderView: FC = () => {
  const context = useContext(Context);
  const generalAppSettings = hooks.useAppSettings();

  if (!generalAppSettings) {
    return <Loader />;
  }

  switch (context?.get('permission')) {
    // show "teacher view"
    case PERMISSIONS.ADMIN:
      return <AdminView />;
    case PERMISSIONS.READ:
    default:
      return <PlayerView />;
  }
};

export default BuilderView;
