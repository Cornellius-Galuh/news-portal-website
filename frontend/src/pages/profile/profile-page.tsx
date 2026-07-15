import { useEffect, useState } from 'react';
import useAuthStore from '../../store/auth.store';
import { ProfileCard, profileService } from '../../features/profile';
import Spinner from '../../components/ui/spinner';

const ProfilePage = () => {
  const user = useAuthStore((state) => state.currentUser);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const fetchedUser = await profileService.getProfile();
        if (fetchedUser) {
          updateUser(fetchedUser);
        }
      } catch {
        // If background refresh fails, proceed silently with existing store user
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchLatestProfile();
  }, [updateUser]);

  if (!user) {
    return (
      <div className="p-12 text-center bg-[#F9F8F6] border-2 border-[#353535] rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)]">
        <Spinner size="lg" />
        <p className="mt-4 font-serif font-bold text-lg text-[#353535]">Loading Dossier...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoadingProfile && (
        <div className="absolute top-4 right-4 z-10 bg-white/80 border border-[#353535] px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
          <Spinner size="sm" />
          <span>Syncing...</span>
        </div>
      )}
      <ProfileCard user={user} />
    </div>
  );
};

export default ProfilePage;
