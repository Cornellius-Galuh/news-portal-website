import { Link } from 'react-router';
import {
  User as UserIcon,
  Mail,
  Calendar,
  ExternalLink,
  Edit,
  Shield,
  BookOpen,
} from 'lucide-react';
import type { User } from '../../../types/auth.types';

interface ProfileCardProps {
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

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return {
        label: 'SYSTEM ADMINISTRATOR',
        bg: 'bg-[#353535] text-white border-[#353535]',
        icon: Shield,
      };
    case 'AUTHOR':
      return {
        label: 'EDITORIAL AUTHOR',
        bg: 'bg-[#D74108] text-white border-[#353535]',
        icon: BookOpen,
      };
    default:
      return {
        label: 'PORTAL READER',
        bg: 'bg-[#CBC8B9] text-[#353535] border-[#353535]',
        icon: UserIcon,
      };
  }
};

const ProfileCard = ({ user }: ProfileCardProps) => {
  const avatarUrl = getAvatarUrl(user.avatar);
  const roleInfo = getRoleBadge(user.role);
  const RoleIcon = roleInfo.icon;
  const joinDate = user.joinedAt || (user as unknown as { createdAt?: string }).createdAt;

  return (
    <div className="space-y-6 font-sans text-[#353535]">
      {/* Top Profile Header Block */}
      <div className="p-6 sm:p-8 bg-[#F9F8F6] border-2 border-[#353535] rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)] flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
        {/* Avatar Display */}
        <div className="relative flex-shrink-0">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#353535] shadow-[4px_4px_0px_0px_rgba(53,53,53,1)] bg-white overflow-hidden flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-serif font-black text-[#D74108] uppercase">
                {user.username.slice(0, 2)}
              </span>
            )}
          </div>
        </div>

        {/* User Info Column */}
        <div className="flex-1 text-center sm:text-left space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black uppercase tracking-tight text-[#353535]">
                @{user.username}
              </h2>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm font-medium text-gray-600 mt-0.5">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{user.email}</span>
              </div>
            </div>

            <Link
              to="/profile/settings"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#D74108] hover:bg-[#b83606] text-white font-bold text-xs uppercase tracking-wider rounded-lg border-2 border-[#353535] shadow-[3px_3px_0px_0px_rgba(53,53,53,1)] hover:shadow-[1px_1px_0px_0px_rgba(53,53,53,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all self-center sm:self-start"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Dossier</span>
            </Link>
          </div>

          {/* Role Badge & Join Date */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-xs font-bold uppercase tracking-wide border-2 shadow-sm ${roleInfo.bg}`}
            >
              <RoleIcon className="w-3.5 h-3.5" />
              {roleInfo.label}
            </span>

            {joinDate && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 bg-white border-2 border-[#353535] px-3 py-1 rounded-md shadow-sm">
                <Calendar className="w-3.5 h-3.5 text-[#D74108]" />
                <span>Joined {new Date(joinDate).toLocaleDateString()}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Biography Section */}
      <div className="p-6 sm:p-8 bg-[#F9F8F6] border-2 border-[#353535] rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)] space-y-3">
        <h3 className="text-base font-bold uppercase tracking-wider font-mono text-[#D74108] border-b-2 border-[#353535] pb-2">
          Documented Biography
        </h3>
        <p className="font-serif text-lg leading-relaxed text-[#353535] whitespace-pre-wrap">
          {user.bio || (
            <span className="italic text-gray-500 font-sans text-sm">
              No biography documented in this dossier yet.{' '}
              <Link to="/profile/settings" className="text-[#D74108] font-bold hover:underline">
                Click here to write your bio.
              </Link>
            </span>
          )}
        </p>
      </div>

      {/* Social Networks Block */}
      <div className="p-6 sm:p-8 bg-[#F9F8F6] border-2 border-[#353535] rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)] space-y-4">
        <h3 className="text-base font-bold uppercase tracking-wider font-mono text-[#D74108] border-b-2 border-[#353535] pb-2">
          Connected Social Links
        </h3>

        {user.socialLinks && user.socialLinks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {user.socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-white border-2 border-[#353535] rounded-lg shadow-[3px_3px_0px_0px_rgba(53,53,53,1)] hover:shadow-[1px_1px_0px_0px_rgba(53,53,53,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all font-bold text-sm uppercase tracking-wide text-[#353535]"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D74108]"></span>
                  {social.platform}
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">
            No social accounts attached.{' '}
            <Link to="/profile/settings" className="text-[#D74108] font-bold hover:underline">
              Add your Twitter, GitHub, LinkedIn, or Website.
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
