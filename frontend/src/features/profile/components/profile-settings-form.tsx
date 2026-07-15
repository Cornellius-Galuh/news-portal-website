import { useState, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Upload,
  AlertCircle,
  CheckCircle,
  Lock,
  User as UserIcon,
  Globe,
  AtSign,
  Code,
  Share2,
} from 'lucide-react';
import useAuthStore from '../../../store/auth.store';
import profileService from '../services/profile.service';
import { profileUpdateSchema, type ProfileUpdateFormData } from '../validators/profile.validator';
import Spinner from '../../../components/ui/spinner';
import type { User, ISocialLink } from '../../../types/auth.types';

interface ProfileSettingsFormProps {
  user: User;
}

const getAvatarUrl = (avatarPath?: string | null) => {
  if (!avatarPath) return null;
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://') || avatarPath.startsWith('data:')) {
    return avatarPath;
  }
  const baseUrl = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/v1\/?$/, '')
    : 'http://localhost:5000';
  return `${baseUrl}${avatarPath.startsWith('/') ? '' : '/'}${avatarPath}`;
};

const findSocialUrl = (links: ISocialLink[] | undefined, platformName: string) => {
  return links?.find((s) => s.platform.toLowerCase() === platformName.toLowerCase())?.url || '';
};

const ProfileSettingsForm = ({ user }: ProfileSettingsFormProps) => {
  const updateUser = useAuthStore((state) => state.updateUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avatar states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(getAvatarUrl(user.avatar));
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarSuccess, setAvatarSuccess] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // Profile Form states
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      username: user.username || '',
      bio: user.bio || '',
      twitter: findSocialUrl(user.socialLinks, 'twitter') || findSocialUrl(user.socialLinks, 'x'),
      github: findSocialUrl(user.socialLinks, 'github'),
      linkedin: findSocialUrl(user.socialLinks, 'linkedin'),
      website: findSocialUrl(user.socialLinks, 'website'),
    },
  });

  const bioContent = useWatch({ control, name: 'bio', defaultValue: user.bio || '' }) || '';

  // Avatar File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError(null);
    setAvatarSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Image file size cannot exceed 5MB.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Upload Avatar Action
  const handleUploadAvatar = async () => {
    if (!selectedFile) return;
    setIsUploadingAvatar(true);
    setAvatarError(null);
    setAvatarSuccess(null);

    try {
      const updatedUser = await profileService.uploadAvatar(selectedFile);
      updateUser(updatedUser);
      setAvatarSuccess('Avatar image uploaded and synchronized successfully!');
      setSelectedFile(null);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setAvatarError(errorObj.response?.data?.message || 'Failed to upload avatar image.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Submit Profile Information
  const onSubmitProfile = async (data: ProfileUpdateFormData) => {
    setIsSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);

    const socialLinksPayload: ISocialLink[] = [];
    if (data.twitter?.trim()) socialLinksPayload.push({ platform: 'Twitter', url: data.twitter.trim() });
    if (data.github?.trim()) socialLinksPayload.push({ platform: 'GitHub', url: data.github.trim() });
    if (data.linkedin?.trim()) socialLinksPayload.push({ platform: 'LinkedIn', url: data.linkedin.trim() });
    if (data.website?.trim()) socialLinksPayload.push({ platform: 'Website', url: data.website.trim() });

    try {
      const updatedUser = await profileService.updateProfile({
        username: data.username,
        bio: data.bio || '',
        socialLinks: socialLinksPayload,
      });
      updateUser(updatedUser);
      setProfileSuccess('Dossier details updated across the portal successfully!');
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setProfileError(
        errorObj.response?.data?.message || 'Failed to update profile details. Username may be taken.',
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="space-y-8 font-sans text-[#353535]">
      {/* SECTION 1: Avatar Upload Block */}
      <div className="p-6 sm:p-8 bg-[#F9F8F6] border-2 border-[#353535] rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)] space-y-5">
        <h3 className="text-base font-bold uppercase tracking-wider font-mono text-[#D74108] border-b-2 border-[#353535] pb-2">
          1. Editorial Avatar & Portrait
        </h3>

        {avatarSuccess && (
          <div className="p-4 bg-green-50 border-2 border-green-600 rounded-lg flex items-center gap-3 text-green-800 text-sm font-semibold animate-fadeIn">
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-600" />
            <span>{avatarSuccess}</span>
          </div>
        )}

        {avatarError && (
          <div className="p-4 bg-red-50 border-2 border-red-600 rounded-lg flex items-center gap-3 text-red-800 text-sm font-semibold animate-fadeIn">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span>{avatarError}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
          {/* Avatar Preview Ring */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-[#353535] shadow-[4px_4px_0px_0px_rgba(53,53,53,1)] bg-white overflow-hidden flex items-center justify-center">
              {previewUrl ? (
                <img src={previewUrl} alt="Avatar preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-serif font-black text-[#D74108] uppercase">
                  {user.username.slice(0, 2)}
                </span>
              )}
            </div>
            {selectedFile && (
              <span className="absolute -top-1 -right-1 bg-[#D74108] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-[#353535] uppercase shadow-sm">
                Preview
              </span>
            )}
          </div>

          {/* Upload Controls */}
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <p className="text-xs font-medium text-gray-600 font-sans">
              Select a professional JPEG, PNG, or WebP image under 5MB. Preview your portrait before publishing to the portal.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="px-4 py-2.5 bg-white hover:bg-gray-100 text-[#353535] font-bold text-xs uppercase tracking-wider rounded-lg border-2 border-[#353535] shadow-[3px_3px_0px_0px_rgba(53,53,53,1)] hover:shadow-[1px_1px_0px_0px_rgba(53,53,53,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Choose Image File</span>
              </button>

              {selectedFile && (
                <button
                  type="button"
                  onClick={handleUploadAvatar}
                  disabled={isUploadingAvatar}
                  className="px-5 py-2.5 bg-[#D74108] hover:bg-[#b83606] text-white font-bold text-xs uppercase tracking-wider rounded-lg border-2 border-[#353535] shadow-[3px_3px_0px_0px_rgba(53,53,53,1)] hover:shadow-[1px_1px_0px_0px_rgba(53,53,53,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
                >
                  {isUploadingAvatar ? (
                    <>
                      <Spinner size="sm" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Confirm & Upload Avatar</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Profile & Social Dossier Form */}
      <form
        onSubmit={handleSubmit(onSubmitProfile)}
        className="p-6 sm:p-8 bg-[#F9F8F6] border-2 border-[#353535] rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)] space-y-6"
        noValidate
      >
        <h3 className="text-base font-bold uppercase tracking-wider font-mono text-[#D74108] border-b-2 border-[#353535] pb-2">
          2. Personal Information & Bio
        </h3>

        {profileSuccess && (
          <div className="p-4 bg-green-50 border-2 border-green-600 rounded-lg flex items-center gap-3 text-green-800 text-sm font-semibold animate-fadeIn">
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-600" />
            <span>{profileSuccess}</span>
          </div>
        )}

        {profileError && (
          <div className="p-4 bg-red-50 border-2 border-red-600 rounded-lg flex items-center gap-3 text-red-800 text-sm font-semibold animate-fadeIn">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span>{profileError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-[#353535] uppercase tracking-wide mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <UserIcon className="w-5 h-5" />
              </div>
              <input
                id="username"
                type="text"
                disabled={isSavingProfile}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg font-sans text-[#353535] focus:outline-none transition-all ${
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

          {/* Locked Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-[#353535] uppercase tracking-wide mb-2">
              Email Address (Read-Only)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="email"
                type="email"
                value={user.email}
                disabled
                readOnly
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 bg-gray-200 text-gray-600 rounded-lg font-sans cursor-not-allowed select-none"
              />
            </div>
            <p className="mt-1 text-[11px] font-semibold text-gray-500">
              * Email address cannot be modified per system security rules.
            </p>
          </div>
        </div>

        {/* Bio Textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="bio" className="block text-sm font-bold text-[#353535] uppercase tracking-wide">
              Documented Biography
            </label>
            <span
              className={`text-xs font-mono font-bold ${
                bioContent.length > 300 ? 'text-red-600' : 'text-gray-500'
              }`}
            >
              {bioContent.length} / 300
            </span>
          </div>
          <textarea
            id="bio"
            rows={4}
            placeholder="Tell our readers about your background, editorial beat, and expertise..."
            disabled={isSavingProfile}
            className={`w-full p-4 border-2 rounded-lg font-serif text-base text-[#353535] focus:outline-none transition-all ${
              errors.bio
                ? 'border-red-500 bg-red-50/50'
                : 'border-[#353535] bg-white focus:border-[#D74108] focus:ring-2 focus:ring-[#D74108]/20'
            }`}
            {...register('bio')}
          />
          {errors.bio && (
            <p className="mt-1 text-xs font-semibold text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.bio.message}
            </p>
          )}
        </div>

        {/* SECTION 3: Social Links Block */}
        <div className="space-y-4 pt-4 border-t-2 border-[#CBC8B9]">
          <h4 className="text-base font-bold uppercase tracking-wider font-mono text-[#D74108]">
            3. Connected Social Networks (Optional URLs)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Twitter / X */}
            <div>
              <label htmlFor="twitter" className="block text-xs font-bold uppercase tracking-wide text-[#353535] mb-1">
                Twitter / X URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <AtSign className="w-4 h-4" />
                </div>
                <input
                  id="twitter"
                  type="url"
                  placeholder="https://x.com/username"
                  disabled={isSavingProfile}
                  className="w-full pl-9 pr-3 py-2 border-2 border-[#353535] rounded-md font-sans text-sm focus:border-[#D74108] focus:outline-none"
                  {...register('twitter')}
                />
              </div>
              {errors.twitter && <p className="text-xs text-red-600 mt-1">{errors.twitter.message}</p>}
            </div>

            {/* GitHub */}
            <div>
              <label htmlFor="github" className="block text-xs font-bold uppercase tracking-wide text-[#353535] mb-1">
                GitHub Profile URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Code className="w-4 h-4" />
                </div>
                <input
                  id="github"
                  type="url"
                  placeholder="https://github.com/username"
                  disabled={isSavingProfile}
                  className="w-full pl-9 pr-3 py-2 border-2 border-[#353535] rounded-md font-sans text-sm focus:border-[#D74108] focus:outline-none"
                  {...register('github')}
                />
              </div>
              {errors.github && <p className="text-xs text-red-600 mt-1">{errors.github.message}</p>}
            </div>

            {/* LinkedIn */}
            <div>
              <label htmlFor="linkedin" className="block text-xs font-bold uppercase tracking-wide text-[#353535] mb-1">
                LinkedIn Profile URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Share2 className="w-4 h-4" />
                </div>
                <input
                  id="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  disabled={isSavingProfile}
                  className="w-full pl-9 pr-3 py-2 border-2 border-[#353535] rounded-md font-sans text-sm focus:border-[#D74108] focus:outline-none"
                  {...register('linkedin')}
                />
              </div>
              {errors.linkedin && <p className="text-xs text-red-600 mt-1">{errors.linkedin.message}</p>}
            </div>

            {/* Personal Website */}
            <div>
              <label htmlFor="website" className="block text-xs font-bold uppercase tracking-wide text-[#353535] mb-1">
                Personal Website URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  id="website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  disabled={isSavingProfile}
                  className="w-full pl-9 pr-3 py-2 border-2 border-[#353535] rounded-md font-sans text-sm focus:border-[#D74108] focus:outline-none"
                  {...register('website')}
                />
              </div>
              {errors.website && <p className="text-xs text-red-600 mt-1">{errors.website.message}</p>}
            </div>
          </div>
        </div>

        {/* Submit Profile Changes */}
        <div className="pt-4 border-t-2 border-[#353535] flex justify-end">
          <button
            type="submit"
            disabled={isSavingProfile}
            className="w-full sm:w-auto py-3.5 px-8 bg-[#D74108] hover:bg-[#b83606] active:bg-[#9c2e05] disabled:bg-gray-400 text-white font-bold tracking-wider uppercase rounded-lg border-2 border-[#353535] shadow-[4px_4px_0px_0px_rgba(53,53,53,1)] hover:shadow-[2px_2px_0px_0px_rgba(53,53,53,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            {isSavingProfile ? (
              <>
                <Spinner size="sm" />
                <span>Saving Dossier...</span>
              </>
            ) : (
              <span>Save Editorial Profile</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettingsForm;
