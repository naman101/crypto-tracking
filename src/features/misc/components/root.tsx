import { Outlet } from 'react-router-dom';

export function Root() {
  return (
    <>
      <nav className="bg-white shadow tw-flex sticky top-0">
        <h1 className="text-blue-500 text-b px-2 py-4 md:px-3 md:py-6 lg:px-6 lg:py-8 lg:text-2xl">
          CryptoTracker
        </h1>
      </nav>
      <div className="p-2 md:p-4 lg:p-6 xl:p-8 space-y-3 font-sans min-h-screen">
        <Outlet />
      </div>
    </>
  );
}
