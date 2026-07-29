import { createRootRoute, Outlet } from '@tanstack/react-router';
import LoadingScreen from '../components/LoadingScreen';

export const Route = createRootRoute({
  component: () => {
    return (
      <div className="min-h-screen">
        <LoadingScreen />
        <Outlet />
      </div>
    );
  },
});
