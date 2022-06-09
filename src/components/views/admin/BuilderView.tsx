import React, { FC } from 'react';
import { useContextContext } from '../../context/ContextContext';
import AdminView from './AdminView';
import PlayerView from '../read/PlayerView';
import { PERMISSIONS } from '../../../config/settings';
import Loader from '../../common/Loader';
import { hooks } from '../../../config/queryClient';

const BuilderView: FC = () => {
  const { permission } = useContextContext();
  const generalAppSettings = hooks.useAppSettings();

  if (!generalAppSettings) {
    return <Loader />;
  }

  switch (permission) {
    // show "teacher view"
    case PERMISSIONS.ADMIN:
      return <AdminView />;
    case PERMISSIONS.READ:
    default:
      return <PlayerView />;
  }
};

export default BuilderView;
