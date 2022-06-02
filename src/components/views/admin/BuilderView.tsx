import React, { FC } from 'react';
import { useContextContext } from '../../context/ContextContext';
import AdminView from './AdminView';
import PlayerView from '../read/PlayerView';
import { PERMISSIONS } from '../../../config/settings';
import { useAppSettings } from '../../context/hooks';
import Loader from '../../common/Loader';

const BuilderView: FC = () => {
  const { permission } = useContextContext();
  const generalAppSettings = useAppSettings();

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