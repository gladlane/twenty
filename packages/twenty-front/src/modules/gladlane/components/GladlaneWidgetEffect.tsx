import { useIsLogged } from '@/auth/hooks/useIsLogged';
import { currentUserState } from '@/auth/states/currentUserState';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useRecoilValueV2 } from '@/ui/utilities/state/jotai/hooks/useRecoilValueV2';
import { useEffect, useState } from 'react';

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
  const currentUser = useRecoilValueV2(currentUserState);
  const currentWorkspace = useRecoilValueV2(currentWorkspaceState);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !currentUser || !currentWorkspace || hasInitialized) {
      return;
    }

    if (!window.GladlaneWidget) {
      return;
    }

    const userName = [currentUser.firstName, currentUser.lastName]
      .filter(Boolean)
      .join(' ');

    window.GladlaneWidget.init({
      workspaceId: '20',
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

    setHasInitialized(true);
  }, [isLoggedIn, currentUser, currentWorkspace, hasInitialized]);

  return null;
};
