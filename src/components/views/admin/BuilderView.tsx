import React, { FC, useContext } from 'react';
import { HOC } from '@graasp/apps-query-client';
import AdminView from './AdminView';
import PlayerView from '../read/PlayerView';
import { PERMISSIONS } from '../../../config/settings';
import Loader from '../../common/Loader';
import { hooks } from '../../../config/queryClient';

const BuilderView: FC = () => {
  const context = useContext(HOC.Context);
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
