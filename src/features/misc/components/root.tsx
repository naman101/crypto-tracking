import { Outlet } from 'react-router-dom';

export function Root() {
  return (
    <div className="p-2 md:p-4 lg:p-6 xl:p-8 space-y-3 font-sans min-h-screen">
      <Outlet />
    </div>
  );
}
