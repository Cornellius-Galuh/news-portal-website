import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import {
  Newspaper,
  CheckCircle,
  Clock,
  AlertCircle,
  Award,
  BarChart3,
  ShieldCheck,
  FileText,
  Send,
  BookOpen,
} from 'lucide-react';
import becomeAuthorService, { type AuthorRequestData } from '../services/become-author.service';
import { becomeAuthorSchema, type BecomeAuthorFormData } from '../validators/become-author.validator';
import Spinner from '../../../components/ui/spinner';
import type { User } from '../../../types/auth.types';

interface BecomeAuthorFormProps {
  user: User;
  existingRequest: AuthorRequestData | null;
  onApplicationSubmitted: (newRequest: AuthorRequestData) => void;
}

const BecomeAuthorForm = ({ user, existingRequest, onApplicationSubmitted }: BecomeAuthorFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BecomeAuthorFormData>({
    resolver: zodResolver(becomeAuthorSchema),
    defaultValues: {
      reason: '',
    },
  });

  const reasonContent = useWatch({ control, name: 'reason', defaultValue: '' }) || '';

  const onSubmit = async (data: BecomeAuthorFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await becomeAuthorService.submitRequest(data.reason);
      onApplicationSubmitted(result);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setSubmitError(
        errorObj.response?.data?.message || 'Failed to submit application. You may already have a pending request.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAlreadyApproved = user.role === 'AUTHOR' || user.role === 'ADMIN' || existingRequest?.status === 'APPROVED';
  const isPendingReview = existingRequest?.status === 'PENDING' && !isAlreadyApproved;
  const isRejected = existingRequest?.status === 'REJECTED' && !isAlreadyApproved;

  return (
    <div className="space-y-8 font-sans text-[#353535]">
      {/* SECTION 1: Explanation & Mission Header */}
      <div className="p-6 sm:p-8 bg-[#F9F8F6] border-2 border-[#353535] rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)] space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#353535] text-white rounded font-mono text-xs font-bold uppercase tracking-wide shadow-sm">
          <Newspaper className="w-4 h-4 text-[#D74108]" />
          <span>Paperio Editorial Network</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold uppercase text-[#353535] tracking-tight">
          Join Our Global Authors & Journalists Studio
        </h2>
        <p className="font-serif text-base sm:text-lg leading-relaxed text-[#353535]">
          We are seeking dedicated investigative reporters, cultural essayists, and newsroom analysts to join the Paperio News Portal. As a verified Author, you gain direct access to our publishing suite, allowing you to publish stories, manage dossiers, and engage millions of discerning readers worldwide.
        </p>
      </div>

      {/* SECTION 2: Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border-2 border-[#353535] rounded-xl shadow-[4px_4px_0px_0px_rgba(53,53,53,1)] flex flex-col justify-between space-y-3">
          <div>
            <div className="w-12 h-12 rounded-lg bg-[#D74108] border-2 border-[#353535] flex items-center justify-center text-white mb-3 shadow-[2px_2px_0px_0px_rgba(53,53,53,1)]">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg uppercase text-[#353535]">
              Publish & Distribute
            </h3>
            <p className="text-sm text-gray-600 font-sans mt-1">
              Publish breaking news, analytical reports, and opinion pieces straight to the main portal newsstand.
            </p>
          </div>
          <span className="font-mono text-[11px] font-bold text-[#D74108] uppercase tracking-wider pt-2 border-t border-gray-200">
            Reach Global Readers
          </span>
        </div>

        <div className="p-6 bg-white border-2 border-[#353535] rounded-xl shadow-[4px_4px_0px_0px_rgba(53,53,53,1)] flex flex-col justify-between space-y-3">
          <div>
            <div className="w-12 h-12 rounded-lg bg-[#353535] border-2 border-[#353535] flex items-center justify-center text-white mb-3 shadow-[2px_2px_0px_0px_rgba(215,65,8,1)]">
              <BarChart3 className="w-6 h-6 text-[#D74108]" />
            </div>
            <h3 className="font-serif font-bold text-lg uppercase text-[#353535]">
              Author Studio & Metrics
            </h3>
            <p className="text-sm text-gray-600 font-sans mt-1">
              Access real-time reader engagement data, views breakdown, and our streamlined editorial studio.
            </p>
          </div>
          <span className="font-mono text-[11px] font-bold text-[#D74108] uppercase tracking-wider pt-2 border-t border-gray-200">
            Data-Driven Insights
          </span>
        </div>

        <div className="p-6 bg-white border-2 border-[#353535] rounded-xl shadow-[4px_4px_0px_0px_rgba(53,53,53,1)] flex flex-col justify-between space-y-3">
          <div>
            <div className="w-12 h-12 rounded-lg bg-[#CBC8B9] border-2 border-[#353535] flex items-center justify-center text-[#353535] mb-3 shadow-[2px_2px_0px_0px_rgba(53,53,53,1)]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg uppercase text-[#353535]">
              Verified Byline & Badge
            </h3>
            <p className="text-sm text-gray-600 font-sans mt-1">
              Earn an official editorial badge on your public profile and build an authoritative journalism portfolio.
            </p>
          </div>
          <span className="font-mono text-[11px] font-bold text-[#D74108] uppercase tracking-wider pt-2 border-t border-gray-200">
            Official Recognition
          </span>
        </div>
      </div>

      {/* SECTION 3: Editorial Rules & Ethics Box */}
      <div className="p-6 sm:p-8 bg-amber-50 border-2 border-[#353535] rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)] space-y-4">
        <div className="flex items-center gap-2 border-b-2 border-[#353535] pb-3">
          <ShieldCheck className="w-6 h-6 text-[#D74108] flex-shrink-0" />
          <h3 className="font-serif font-bold text-lg uppercase tracking-wide text-[#353535]">
            Mandatory Journalistic Standards & Rules
          </h3>
        </div>

        <ul className="space-y-3 text-sm text-[#353535] font-sans">
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded bg-[#353535] text-white flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5">
              1
            </span>
            <span>
              <strong>Original & Fact-Checked Reporting:</strong> All submissions must be 100% original work. Plagiarism, AI spam, or unverified claims result in immediate editorial revocation.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded bg-[#353535] text-white flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5">
              2
            </span>
            <span>
              <strong>Journalistic Integrity & Fairness:</strong> Authors must strictly adhere to accuracy, fairness, and balanced representation when covering sensitive topics.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded bg-[#353535] text-white flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5">
              3
            </span>
            <span>
              <strong>Editorial Board Governance:</strong> Submissions and author credentials are subject to periodic governance audits by our senior editorial board.
            </span>
          </li>
        </ul>
      </div>

      {/* SECTION 4: Application Status & Form */}
      <div className="p-6 sm:p-8 bg-[#F9F8F6] border-2 border-[#353535] rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)] space-y-6">
        {/* CASE A: Already Approved / Author Role */}
        {isAlreadyApproved ? (
          <div className="p-6 bg-green-50 border-2 border-green-600 rounded-xl space-y-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center justify-center sm:justify-start gap-3 text-green-900">
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <h4 className="font-serif font-black text-lg uppercase tracking-tight">
                    Application Approved • Active Author
                  </h4>
                  <p className="text-sm font-medium text-green-800">
                    Congratulations! You have verified Author access in the Paperio News Portal.
                  </p>
                </div>
              </div>
              <Link
                to="/author"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#353535] hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg border-2 border-[#353535] shadow-[3px_3px_0px_0px_rgba(53,53,53,1)] transition-all"
              >
                <BookOpen className="w-4 h-4 text-[#D74108]" />
                <span>Launch Author Studio</span>
              </Link>
            </div>
          </div>
        ) : isPendingReview ? (
          /* CASE B: Pending Review */
          <div className="p-6 bg-amber-100/70 border-2 border-[#353535] rounded-xl space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-7 h-7 text-[#D74108] flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#D74108] text-white font-mono text-[10px] font-bold uppercase rounded">
                  Status: PENDING REVIEW
                </div>
                <h4 className="font-serif font-black text-xl uppercase text-[#353535]">
                  Your Author Application is Under Review
                </h4>
                <p className="text-sm text-gray-700 font-sans leading-relaxed">
                  We have received your dossier application and our Editorial Board is currently auditing your credentials and statement. You cannot submit a duplicate request while this is pending.
                </p>
                {existingRequest?.reason && (
                  <div className="mt-4 p-4 bg-white border-2 border-[#353535] rounded-lg shadow-sm">
                    <span className="block text-xs font-mono font-bold uppercase text-gray-500 mb-1">
                      Submitted Statement ({existingRequest.createdAt ? new Date(existingRequest.createdAt).toLocaleDateString() : 'Recent'})
                    </span>
                    <p className="font-serif text-sm text-[#353535] italic">
                      "{existingRequest.reason}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* CASE C: New Submission (or Re-submission after rejection) */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="border-b-2 border-[#353535] pb-3 flex items-center justify-between">
              <h3 className="font-serif font-black text-xl uppercase tracking-tight text-[#353535]">
                Submit Author Application Dossier
              </h3>
              {isRejected && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 border-2 border-red-600 text-red-800 rounded font-mono text-xs font-bold uppercase">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                  <span>Previous Application Not Approved</span>
                </span>
              )}
            </div>

            {isRejected && (
              <div className="p-4 bg-red-50 border-2 border-red-600 rounded-lg text-sm text-red-800 space-y-1 font-semibold">
                <p>We reviewed your previous application on {existingRequest?.reviewedAt ? new Date(existingRequest.reviewedAt).toLocaleDateString() : 'recent audit'}, but were unable to approve it.</p>
                <p className="font-normal text-xs text-red-700">You may submit a comprehensive and expanded statement below to re-apply.</p>
              </div>
            )}

            {submitError && (
              <div className="p-4 bg-red-50 border-2 border-red-600 rounded-lg flex items-center gap-3 text-red-800 text-sm font-semibold animate-fadeIn">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
                <span>{submitError}</span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="reason" className="block text-sm font-bold uppercase tracking-wide text-[#353535]">
                  Statement of Purpose & Journalism Experience <span className="text-red-600">*</span>
                </label>
                <span
                  className={`font-mono text-xs font-bold ${
                    reasonContent.length < 30 ? 'text-amber-600' : reasonContent.length > 1000 ? 'text-red-600' : 'text-green-700'
                  }`}
                >
                  {reasonContent.length} / 1000 chars (Min: 30)
                </span>
              </div>

              <textarea
                id="reason"
                rows={6}
                placeholder="Explain why you wish to join our editorial network. Describe your writing expertise, areas of journalism coverage (e.g. Technology, World Politics, Culture), and your commitment to accurate reporting..."
                disabled={isSubmitting}
                className={`w-full p-4 border-2 rounded-lg font-serif text-base text-[#353535] focus:outline-none transition-all ${
                  errors.reason
                    ? 'border-red-500 bg-red-50/50'
                    : 'border-[#353535] bg-white focus:border-[#D74108] focus:ring-2 focus:ring-[#D74108]/20'
                }`}
                {...register('reason')}
              />

              {errors.reason ? (
                <p className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.reason.message}
                </p>
              ) : (
                <p className="mt-2 text-xs font-medium text-gray-500">
                  Please write at least 30 characters detailing your qualifications. This dossier statement will be reviewed by senior editors.
                </p>
              )}
            </div>

            <div className="pt-4 border-t-2 border-[#CBC8B9] flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || reasonContent.trim().length < 30}
                className="w-full sm:w-auto py-3.5 px-8 bg-[#D74108] hover:bg-[#b83606] active:bg-[#9c2e05] disabled:bg-gray-400 text-white font-bold tracking-wider uppercase rounded-lg border-2 border-[#353535] shadow-[4px_4px_0px_0px_rgba(53,53,53,1)] hover:shadow-[2px_2px_0px_0px_rgba(53,53,53,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Author Application</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BecomeAuthorForm;
