import LoginForm from '../../features/auth/components/login-form';

const LoginPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center border-b-2 border-[#353535] pb-5">
        <h1 className="text-3xl font-serif font-bold text-[#353535] tracking-tight uppercase">
          Portal Sign In
        </h1>
        <p className="mt-1.5 text-sm font-medium text-gray-600 font-sans">
          Access your digital newsstand and author privileges.
        </p>
      </div>

      <LoginForm />
    </div>
  );
};

export default LoginPage;
