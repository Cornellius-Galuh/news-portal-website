import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, AlertCircle, Lock, Mail } from 'lucide-react';
import useAuthStore from '../../../store/auth.store';
import { loginSchema } from '../validators/auth.validator';
import type { LoginFormData } from '../validators/auth.validator';
import Spinner from '../../../components/ui/spinner';

const LoginForm = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await login({ email: data.email, password: data.password });
      if (data.rememberMe) {
        localStorage.setItem('remembered_email', data.email);
      } else {
        localStorage.removeItem('remembered_email');
      }
      navigate('/');
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const message =
        errorObj.response?.data?.message || 'Invalid email or password. Please try again.';
      setServerError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Server Error Banner */}
      {serverError && (
        <div className="p-4 bg-red-50 border-2 border-red-500 rounded-lg flex items-start gap-3 text-red-700 animate-fadeIn">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{serverError}</div>
        </div>
      )}

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-bold text-[#353535] uppercase tracking-wide mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Mail className="w-5 h-5" />
          </div>
          <input
            id="email"
            type="email"
            placeholder="reader@example.com"
            disabled={isLoading}
            className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg font-sans text-[#353535] placeholder-gray-400 focus:outline-none transition-all ${
              errors.email
                ? 'border-red-500 bg-red-50/50'
                : 'border-[#353535] bg-white focus:border-[#D74108] focus:ring-2 focus:ring-[#D74108]/20'
            }`}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-bold text-[#353535] uppercase tracking-wide mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Lock className="w-5 h-5" />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            disabled={isLoading}
            className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg font-sans text-[#353535] placeholder-gray-400 focus:outline-none transition-all ${
              errors.password
                ? 'border-red-500 bg-red-50/50'
                : 'border-[#353535] bg-white focus:border-[#D74108] focus:ring-2 focus:ring-[#D74108]/20'
            }`}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#353535] transition-colors focus:outline-none"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer select-none text-[#353535] font-medium">
          <input
            type="checkbox"
            className="w-4 h-4 border-2 border-[#353535] rounded text-[#D74108] focus:ring-[#D74108] transition-colors cursor-pointer"
            {...register('rememberMe')}
          />
          <span>Remember authentication</span>
        </label>
        <span className="text-[#D74108] font-bold hover:underline cursor-pointer">
          Forgot password?
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-6 bg-[#D74108] hover:bg-[#b83606] active:bg-[#9c2e05] disabled:bg-gray-400 text-white font-bold tracking-wider uppercase rounded-lg border-2 border-[#353535] shadow-[4px_4px_0px_0px_rgba(53,53,53,1)] hover:shadow-[2px_2px_0px_0px_rgba(53,53,53,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Spinner size="sm" />
            <span>Verifying Credentials...</span>
          </>
        ) : (
          <span>Sign In to Portal</span>
        )}
      </button>

      {/* Switch to Register */}
      <div className="pt-4 border-t-2 border-dashed border-[#CBC8B9] text-center text-sm font-medium text-[#353535]">
        Don&apos;t have an account yet?{' '}
        <Link to="/register" className="text-[#D74108] font-bold hover:underline">
          Create an Editorial Account
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
