import useAuthStore from '../../store/auth.store';
import { ProfileSettingsForm } from '../../features/profile';
import Spinner from '../../components/ui/spinner';

const ProfileSettingsPage = () => {
  const user = useAuthStore((state) => state.currentUser);

  if (!user) {
    return (
      <div className="p-12 text-center bg-[#F9F8F6] border-2 border-[#353535] rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)]">
        <Spinner size="lg" />
        <p className="mt-4 font-serif font-bold text-lg text-[#353535]">Loading Dossier Settings...</p>
      </div>
    );
  }

  return <ProfileSettingsForm user={user} />;
};

export default ProfileSettingsPage;
