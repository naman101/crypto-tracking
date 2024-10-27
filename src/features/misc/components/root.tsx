import { Link, Outlet } from 'react-router-dom';

export function Root() {
  return (
    <>
      <nav className="bg-white shadow sticky top-0">
        <Link to="/">
          <h1 className="text-blue-500 text-b px-2 py-4 md:px-3 md:py-6 lg:px-5 lg:py-7 lg:text-2xl">
            CryptoTracker
          </h1>
        </Link>
      </nav>
      <div className="p-2 md:p-4 lg:p-6 xl:p-8 space-y-3 font-sans min-h-screen">
        <Outlet />
      </div>
    </>
  );
}
