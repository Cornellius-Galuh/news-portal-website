import { Outlet } from 'react-router';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-indigo-600">
            NewsPortal
          </a>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
