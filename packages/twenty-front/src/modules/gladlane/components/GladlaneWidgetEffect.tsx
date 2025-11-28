import { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';

import { currentUserState } from '@/auth/states/currentUserState';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useIsLogged } from '@/auth/hooks/useIsLogged';

declare global {
  interface Window {
    GladlaneWidget?: {
      init: (config: {
        workspaceId: string;
        trackApiCalls?: boolean;
        user: {
          id: string;
          email: string;
          name: string;
        };
        company: {
          id: string;
          name: string;
        };
      }) => void;
    };
  }
}

export const GladlaneWidgetEffect = () => {
  const isLoggedIn = useIsLogged();
  const currentUser = useRecoilValue(currentUserState);
  const currentWorkspace = useRecoilValue(currentWorkspaceState);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (
      !isLoggedIn ||
      !currentUser ||
      !currentWorkspace ||
      hasInitialized.current
    ) {
      return;
    }

    if (!window.GladlaneWidget) {
      return;
    }

    const userName = [currentUser.firstName, currentUser.lastName]
      .filter(Boolean)
      .join(' ');

    window.GladlaneWidget.init({
      workspaceId: '17',
      trackApiCalls: true,
      user: {
        id: currentUser.id,
        email: currentUser.email,
        name: userName,
      },
      company: {
        id: currentWorkspace.id,
        name: currentWorkspace.displayName ?? '',
      },
    });

    hasInitialized.current = true;
  }, [isLoggedIn, currentUser, currentWorkspace]);

  return null;
};

