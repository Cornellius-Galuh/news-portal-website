import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, AlertCircle, Lock, Mail, User } from 'lucide-react';
import useAuthStore from '../../../store/auth.store';
import { registerSchema } from '../validators/auth.validator';
import type { RegisterFormData } from '../validators/auth.validator';
import Spinner from '../../../components/ui/spinner';

const RegisterForm = () => {
  const navigate = useNavigate();
  const registerAction = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      await registerAction({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      navigate('/');
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const message =
        errorObj.response?.data?.message ||
        'Failed to register account. Username or email may already exist.';
      setServerError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Server Error Banner */}
      {serverError && (
        <div className="p-4 bg-red-50 border-2 border-red-500 rounded-lg flex items-start gap-3 text-red-700 animate-fadeIn">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{serverError}</div>
        </div>
      )}

      {/* Username Field */}
      <div>
        <label htmlFor="username" className="block text-sm font-bold text-[#353535] uppercase tracking-wide mb-1.5">
          Username
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <User className="w-5 h-5" />
          </div>
          <input
            id="username"
            type="text"
            placeholder="johndoe"
            disabled={isLoading}
            className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-lg font-sans text-[#353535] placeholder-gray-400 focus:outline-none transition-all ${
              errors.username
                ? 'border-red-500 bg-red-50/50'
                : 'border-[#353535] bg-white focus:border-[#D74108] focus:ring-2 focus:ring-[#D74108]/20'
            }`}
            {...register('username')}
          />
        </div>
        {errors.username && (
          <p className="mt-1 text-xs font-semibold text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.username.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-bold text-[#353535] uppercase tracking-wide mb-1.5">
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
            className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-lg font-sans text-[#353535] placeholder-gray-400 focus:outline-none transition-all ${
              errors.email
                ? 'border-red-500 bg-red-50/50'
                : 'border-[#353535] bg-white focus:border-[#D74108] focus:ring-2 focus:ring-[#D74108]/20'
            }`}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs font-semibold text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-bold text-[#353535] uppercase tracking-wide mb-1.5">
          Password (Min 8 Chars)
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
            className={`w-full pl-10 pr-12 py-2.5 border-2 rounded-lg font-sans text-[#353535] placeholder-gray-400 focus:outline-none transition-all ${
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
          <p className="mt-1 text-xs font-semibold text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-bold text-[#353535] uppercase tracking-wide mb-1.5">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Lock className="w-5 h-5" />
          </div>
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            disabled={isLoading}
            className={`w-full pl-10 pr-12 py-2.5 border-2 rounded-lg font-sans text-[#353535] placeholder-gray-400 focus:outline-none transition-all ${
              errors.confirmPassword
                ? 'border-red-500 bg-red-50/50'
                : 'border-[#353535] bg-white focus:border-[#D74108] focus:ring-2 focus:ring-[#D74108]/20'
            }`}
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#353535] transition-colors focus:outline-none"
            title={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-xs font-semibold text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-6 bg-[#D74108] hover:bg-[#b83606] active:bg-[#9c2e05] disabled:bg-gray-400 text-white font-bold tracking-wider uppercase rounded-lg border-2 border-[#353535] shadow-[4px_4px_0px_0px_rgba(53,53,53,1)] hover:shadow-[2px_2px_0px_0px_rgba(53,53,53,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-2"
      >
        {isLoading ? (
          <>
            <Spinner size="sm" />
            <span>Creating Account...</span>
          </>
        ) : (
          <span>Register Editorial Account</span>
        )}
      </button>

      {/* Switch to Login */}
      <div className="pt-4 border-t-2 border-dashed border-[#CBC8B9] text-center text-sm font-medium text-[#353535]">
        Already have an editorial account?{' '}
        <Link to="/login" className="text-[#D74108] font-bold hover:underline">
          Sign In to Portal
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
