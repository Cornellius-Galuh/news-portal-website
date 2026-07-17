import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { articleService } from '../services/article.service';
import { categoryService } from '../../categories/services/category.service';
import type { Category } from '../../../types/category.types';
import RichTextEditor from './rich-text-editor';
import { Button, Input, Spinner } from '../../../components/ui';
import {
  Save,
  Send,
  Image as ImageIcon,
  X,
  UploadCloud,
  AlertCircle,
  CheckCircle2,
  Tag,
} from 'lucide-react';

interface ArticleEditorProps {
  initialData?: {
    _id?: string;
    title?: string;
    excerpt?: string;
    content?: string;
    categories?: string[];
    coverImage?: string;
    images?: string[];
  };
  onSuccess?: (articleId: string) => void;
}

const LOCAL_STORAGE_KEY = 'draft_article_auto_save';

const ArticleEditor: React.FC<ArticleEditorProps> = ({ initialData, onSuccess }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState(initialData?.title || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.categories || [],
  );

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initialData?.coverImage || null,
  );

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(
    initialData?.images || [],
  );

  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const res = await categoryService.getCategories({ limit: 100 });
        setAvailableCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Load auto-saved draft from localStorage if creating a new article and no initialData
  useEffect(() => {
    if (!initialData?._id) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.title) setTitle(parsed.title);
          if (parsed.excerpt) setExcerpt(parsed.excerpt);
          if (parsed.content) setContent(parsed.content);
          if (parsed.categories) setSelectedCategories(parsed.categories);
          setLastSavedTime('Loaded from local draft');
        } catch {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }
    }
  }, [initialData?._id]);

  // Mark form dirty when values change
  const handleFieldChange = useCallback(() => {
    setIsDirty(true);
  }, []);

  // Auto-save to localStorage every 3 seconds if dirty
  useEffect(() => {
    if (!isDirty || initialData?._id) return;

    const timer = setTimeout(() => {
      const draftData = {
        title,
        excerpt,
        content,
        categories: selectedCategories,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draftData));
      const timeStr = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setLastSavedTime(`Draft auto-saved at ${timeStr}`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [title, excerpt, content, selectedCategories, isDirty, initialData?._id]);

  // Warn before leaving page if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    if (isDirty) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  // Handle Category click
  const toggleCategory = (catIdOrSlug: string) => {
    handleFieldChange();
    setSelectedCategories((prev) =>
      prev.includes(catIdOrSlug)
        ? prev.filter((id) => id !== catIdOrSlug)
        : [...prev, catIdOrSlug],
    );
  };

  // Handle Cover File
  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('Cover image must be smaller than 50 MB.');
      return;
    }

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    handleFieldChange();
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    if (coverInputRef.current) coverInputRef.current.value = '';
    handleFieldChange();
  };

  // Handle Gallery Files
  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    if (galleryPreviews.length + newFiles.length > 25) {
      setErrorMessage('You can select up to 25 gallery images in total.');
      return;
    }

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setGalleryFiles((prev) => [...prev, ...newFiles]);
    setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    handleFieldChange();
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const removeGalleryImage = (index: number) => {
    const previewToRemove = galleryPreviews[index];
    if (previewToRemove && previewToRemove.startsWith('blob:')) {
      let blobIndex = 0;
      for (let i = 0; i < index; i++) {
        if (galleryPreviews[i].startsWith('blob:')) {
          blobIndex++;
        }
      }
      setGalleryFiles((prev) => prev.filter((_, i) => i !== blobIndex));
      try {
        URL.revokeObjectURL(previewToRemove);
      } catch {
        // ignore
      }
    }
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    handleFieldChange();
  };

  // Submit Handler
  const handleSubmit = async (shouldPublish: boolean) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    if (!title.trim()) {
      setErrorMessage('Please enter an article title.');
      return;
    }
    if (!excerpt.trim()) {
      setErrorMessage('Please enter a brief excerpt/summary.');
      return;
    }
    if (selectedCategories.length === 0) {
      setErrorMessage('Please select at least one category.');
      return;
    }
    if (!content.trim() || content === '<p></p>') {
      setErrorMessage('Please write some content for the article.');
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Create Article (or update if editing)
      let articleId = initialData?._id;
      if (!articleId) {
        const created = await articleService.createArticle({
          title: title.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          categories: selectedCategories,
        });
        articleId = created._id;
      } else {
        const remainingExistingImages = galleryPreviews.filter((url) => !url.startsWith('blob:'));
        const remainingCover = coverPreview && !coverPreview.startsWith('blob:') ? coverPreview : undefined;
        await articleService.updateArticle(articleId, {
          title: title.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          categories: selectedCategories,
          images: remainingExistingImages,
          coverImage: remainingCover,
        });
      }

      // 2. Upload Cover Image if selected
      if (coverFile && articleId) {
        await articleService.uploadCover(articleId, coverFile);
      }

      // 3. Upload Gallery Images if selected
      if (galleryFiles.length > 0 && articleId) {
        await articleService.uploadImages(articleId, galleryFiles);
      }

      // 4. Publish if requested
      if (shouldPublish && articleId) {
        await articleService.publishArticle(articleId);
      }

      // Clean up localStorage on success
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setIsDirty(false);

      const msg = shouldPublish
        ? 'Article published successfully!'
        : 'Article saved as draft!';
      setSuccessMessage(msg);

      if (onSuccess && articleId) {
        onSuccess(articleId);
      } else {
        setTimeout(() => {
          navigate('/author');
        }, 1500);
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to save article. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-[#353535] bg-[#F2EFE9] text-[#353535] overflow-hidden">
      {/* Header Bar */}
      <div className="bg-[#E8E5DF] px-6 py-5 border-b border-[#353535] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold uppercase tracking-tight text-[#353535]">
            {initialData?._id ? 'Edit Article Record' : 'Write New Dispatch'}
          </h2>
          <div className="flex items-center gap-2 mt-1 text-xs font-semibold uppercase tracking-wider text-[#353535]/80">
            <span>Status:</span>
            <span className="border border-[#353535] bg-[#353535] text-white px-2 py-0.5">
              DRAFT
            </span>
            {lastSavedTime && (
              <span className="text-[#353535]/60 italic font-sans">| {lastSavedTime}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="flex items-center gap-2 border border-[#353535] bg-[#F2EFE9] text-[#353535] hover:bg-white uppercase text-xs font-bold tracking-wider px-4 py-2.5 rounded-none"
          >
            {isSubmitting ? (
              <Spinner size="sm" className="text-[#353535]" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save as Draft
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="flex items-center gap-2 border border-[#353535] bg-[#353535] text-white hover:bg-[#D74108] hover:border-[#D74108] uppercase text-xs font-bold tracking-wider px-6 py-2.5 rounded-none transition-colors"
          >
            {isSubmitting ? (
              <Spinner size="sm" className="text-white" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Publish Now
          </Button>
        </div>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="mx-6 mt-6 p-4 border border-[#353535] bg-rose-100 text-rose-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm font-semibold">{errorMessage}</div>
        </div>
      )}

      {successMessage && (
        <div className="mx-6 mt-6 p-4 border border-[#353535] bg-emerald-100 text-emerald-900 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <div className="text-sm font-bold">{successMessage}</div>
        </div>
      )}

      {/* Main Form Grid */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Title, Excerpt, Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#353535] mb-2">
              Article Headline <span className="text-[#D74108]">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. BREAKING: Historic Infrastructure Proposal Unveiled"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                handleFieldChange();
              }}
              className="text-lg font-serif font-bold py-3 border border-[#353535] bg-[#F2EFE9] focus:bg-white rounded-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#353535]">
                Brief Excerpt / Lead <span className="text-[#D74108]">*</span>
              </label>
              <span className="text-xs font-mono text-[#353535]/70">
                {excerpt.length}/300 chars
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={300}
              placeholder="Provide a compelling 2-3 sentence overview of the story..."
              value={excerpt}
              onChange={(e) => {
                setExcerpt(e.target.value);
                handleFieldChange();
              }}
              className="w-full px-4 py-2.5 border border-[#353535] bg-[#F2EFE9] focus:bg-white focus:outline-none text-[#353535] font-serif text-sm transition-colors resize-none rounded-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#353535] mb-2">
              Full Dispatch Content <span className="text-[#D74108]">*</span>
            </label>
            <RichTextEditor
              content={content}
              onChange={(html) => {
                setContent(html);
                handleFieldChange();
              }}
            />
          </div>
        </div>

        {/* Right 1 Column: Categories & Media Uploads */}
        <div className="space-y-6">
          {/* Categories Selector */}
          <div className="bg-[#E8E5DF] p-5 border border-[#353535]">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#353535] mb-3">
              <Tag className="w-4 h-4 text-[#D74108]" />
              Categories <span className="text-[#D74108]">*</span>
            </label>
            <p className="text-xs text-[#353535]/80 font-sans mb-3">
              Select all classifications relevant to your dispatch.
            </p>

            {isLoadingCategories ? (
              <div className="py-4 flex justify-center">
                <Spinner size="sm" className="text-[#353535]" />
              </div>
            ) : availableCategories.length === 0 ? (
              <div className="text-xs text-[#353535]/70 bg-[#F2EFE9] p-3 border border-dashed border-[#353535] text-center font-serif">
                No categories available yet. Please create categories first.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto p-1">
                {availableCategories.map((cat) => {
                  const isSelected =
                    selectedCategories.includes(cat._id) ||
                    selectedCategories.includes(cat.slug);
                  return (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => toggleCategory(cat._id)}
                      className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border border-[#353535] rounded-none ${
                        isSelected
                          ? 'bg-[#353535] text-white shadow-sm'
                          : 'bg-[#F2EFE9] text-[#353535] hover:bg-white'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {isSelected && <span className="text-[#D74108]">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cover Image Upload */}
          <div className="bg-[#E8E5DF] p-5 border border-[#353535]">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#353535] mb-2">
              <ImageIcon className="w-4 h-4 text-[#D74108]" />
              Cover Masthead Image
            </label>
            <p className="text-xs text-[#353535]/80 font-sans mb-4">
              Upload a high-resolution cover photo (Max 50MB, all image formats).
            </p>

            {coverPreview ? (
              <div className="relative border border-[#353535] group shadow-sm bg-[#F2EFE9]">
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-full h-44 object-cover"
                />
                <button
                  type="button"
                  onClick={removeCover}
                  className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-transform transform active:scale-95 rounded-none"
                  title="Remove cover image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => coverInputRef.current?.click()}
                className="border border-dashed border-[#353535] hover:border-[#D74108] p-6 text-center cursor-pointer bg-[#F2EFE9] hover:bg-white transition-colors group flex flex-col items-center justify-center min-h-[160px]"
              >
                <UploadCloud className="w-8 h-8 text-[#353535]/60 group-hover:text-[#D74108] transition-colors mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#353535] group-hover:text-[#D74108]">
                  Click to select cover photo
                </span>
                <span className="text-xs text-[#353535]/70 font-sans mt-1">
                  Supports all formats (JPG, PNG, WEBP, GIF, SVG, AVIF, HEIC, etc.)
                </span>
              </div>
            )}

            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverSelect}
              className="hidden"
            />
          </div>

          {/* Gallery Images Upload */}
          <div className="bg-[#E8E5DF] p-5 border border-[#353535]">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#353535]">
                <ImageIcon className="w-4 h-4 text-[#D74108]" />
                Gallery Archive
              </label>
              <span className="text-xs font-mono font-bold text-[#353535]/80">
                {galleryPreviews.length}/25 Max
              </span>
            </div>
            <p className="text-xs text-[#353535]/80 font-sans mb-4">
              Add multiple supporting photographs to display as a gallery carousel (Max 50MB per file).
            </p>

            {/* Previews Grid */}
            {galleryPreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-3 max-h-56 overflow-y-auto p-1">
                {galleryPreviews.map((previewUrl, idx) => (
                  <div
                    key={idx}
                    className="relative border border-[#353535] bg-[#F2EFE9] shadow-xs group h-24"
                  >
                    <img
                      src={previewUrl}
                      alt={`Gallery preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 bg-rose-600 hover:bg-rose-700 text-white shadow transition-transform transform active:scale-95 rounded-none"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {galleryPreviews.length < 25 && (
              <div
                onClick={() => galleryInputRef.current?.click()}
                className="border border-dashed border-[#353535] hover:border-[#D74108] p-4 text-center cursor-pointer bg-[#F2EFE9] hover:bg-white transition-colors group flex items-center justify-center gap-2"
              >
                <UploadCloud className="w-5 h-5 text-[#353535]/60 group-hover:text-[#D74108] transition-colors" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#353535] group-hover:text-[#D74108]">
                  Add Gallery Images
                </span>
              </div>
            )}

            <input
              ref={galleryInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleGallerySelect}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;
