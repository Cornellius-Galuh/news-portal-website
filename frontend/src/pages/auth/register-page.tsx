import RegisterForm from '../../features/auth/components/register-form';

const RegisterPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center border-b-2 border-[#353535] pb-5">
        <h1 className="text-3xl font-serif font-bold text-[#353535] tracking-tight uppercase">
          Become a Reader
        </h1>
        <p className="mt-1.5 text-sm font-medium text-gray-600 font-sans">
          Join thousands of daily readers across our global editorial network.
        </p>
      </div>

      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
