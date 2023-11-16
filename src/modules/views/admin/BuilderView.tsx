import React, { FC } from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel } from '@graasp/sdk';

import { hooks } from '../../../config/queryClient';
import Loader from '../../common/Loader';
import PlayerView from '../read/PlayerView';
import AdminView from './AdminView';

const BuilderView: FC = () => {
  const context = useLocalContext();
  const generalAppSettings = hooks.useAppSettings();

  if (!generalAppSettings) {
    return <Loader />;
  }

  switch (context?.permission) {
    // show "teacher view"
    case PermissionLevel.Admin:
      return <AdminView />;
    case PermissionLevel.Read:
    default:
      return <PlayerView />;
  }
};

export default BuilderView;
