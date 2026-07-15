import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Newspaper, ArrowLeft, ShieldAlert } from 'lucide-react';
import useAuthStore from '../../store/auth.store';
import { BecomeAuthorForm, becomeAuthorService, type AuthorRequestData } from '../../features/become-author';
import Spinner from '../../components/ui/spinner';

const BecomeAuthorPage = () => {
  const user = useAuthStore((state) => state.currentUser);
  const [existingRequest, setExistingRequest] = useState<AuthorRequestData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const checkStatus = async () => {
      try {
        setIsLoading(true);
        const req = await becomeAuthorService.getMyRequest();
        setExistingRequest(req);
      } catch {
        // Continue if no existing request found
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [user]);

  const handleApplicationSubmitted = (newRequest: AuthorRequestData) => {
    setExistingRequest(newRequest);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#E3E1DE] flex items-center justify-center p-6">
        <div className="p-8 bg-[#F9F8F6] border-2 border-[#353535] rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)] text-center max-w-md">
          <ShieldAlert className="w-12 h-12 text-[#D74108] mx-auto mb-4" />
          <h2 className="font-serif font-black text-2xl uppercase text-[#353535]">Authentication Required</h2>
          <p className="mt-2 text-sm text-gray-600 font-sans">
            Please sign in to the Paperio News Portal before submitting an application to join our editorial network.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block w-full py-3 bg-[#D74108] text-white font-bold text-xs uppercase tracking-wider rounded-lg border-2 border-[#353535] shadow-[4px_4px_0px_0px_rgba(53,53,53,1)] hover:bg-[#b83606] transition-all"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E3E1DE] text-[#353535] py-10 px-4 font-sans selection:bg-[#D74108] selection:text-white">
      {/* Editorial Masthead Header */}
      <header className="w-full max-w-4xl mx-auto mb-8">
        <div className="border-2 border-[#353535] bg-[#F9F8F6] p-5 sm:p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#353535] pb-3 mb-4 text-xs font-bold uppercase tracking-wider gap-2">
            <span className="flex items-center gap-1.5 text-[#D74108]">
              <Newspaper className="w-4 h-4" />
              <span>Paperio News Portal • Author Admission Studio</span>
            </span>
            <div className="flex items-center gap-4">
              <span className="bg-[#353535] text-white px-2 py-0.5 rounded font-mono text-[10px]">
                CURRENT ROLE: {user.role}
              </span>
              <Link to="/" className="inline-flex items-center gap-1 hover:text-[#D74108] transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Portal</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight uppercase text-[#353535]">
                Author Accreditation
              </h1>
              <p className="text-sm font-medium text-gray-600 font-sans mt-0.5">
                Submit your journalistic dossier to become a published author on our global newsstand.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-4xl mx-auto">
        {isLoading ? (
          <div className="p-12 bg-[#F9F8F6] border-2 border-[#353535] rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)] text-center">
            <Spinner size="lg" />
            <p className="mt-4 font-serif font-bold text-lg text-[#353535]">Auditing Application Status...</p>
          </div>
        ) : (
          <BecomeAuthorForm
            user={user}
            existingRequest={existingRequest}
            onApplicationSubmitted={handleApplicationSubmitted}
          />
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="w-full max-w-4xl mx-auto mt-12 text-center text-xs font-semibold text-[#353535] uppercase tracking-wider space-y-1">
        <div className="border-t-2 border-[#353535] pt-5 flex flex-wrap justify-center gap-4">
          <span>© 2026 Paperio News Portal</span>
          <span>•</span>
          <Link to="/" className="hover:text-[#D74108] transition-colors">
            Portal Newsstand
          </Link>
          <span>•</span>
          <Link to="/profile" className="hover:text-[#D74108] transition-colors">
            My Dossier Profile
          </Link>
          <span>•</span>
          <a href="#" className="hover:text-[#D74108] transition-colors">
            Editorial Guidelines
          </a>
        </div>
      </footer>
    </div>
  );
};

export default BecomeAuthorPage;
