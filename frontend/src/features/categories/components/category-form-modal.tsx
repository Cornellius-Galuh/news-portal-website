import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, FolderPlus, Save } from 'lucide-react';
import Modal from '../../../components/ui/modal';
import Input from '../../../components/ui/input';
import Button from '../../../components/ui/button';
import { categoryService } from '../services/category.service';
import { categoryFormSchema, type CategoryFormData } from '../validators/category-form.validator';
import type { Category } from '../../../types/category.types';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Category | null;
}

const CategoryFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: CategoryFormModalProps) => {
  const isEditing = Boolean(initialData);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      setApiError(null);
      if (initialData) {
        reset({
          name: initialData.name || '',
          description: initialData.description || '',
        });
      } else {
        reset({
          name: '',
          description: '',
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setApiError(null);
      if (isEditing && initialData) {
        await categoryService.updateCategory(initialData._id, data);
      } else {
        await categoryService.createCategory(data);
      }
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred during save operation.';
      setApiError(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Category Dossier' : 'Create New Category'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans">
        {apiError && (
          <div className="p-3.5 bg-red-50 border-2 border-red-500 rounded-xl flex items-start gap-2.5 text-xs text-red-800 font-bold">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        <div>
          <Input
            label="Category Name *"
            placeholder="e.g. Artificial Intelligence"
            error={errors.name?.message}
            {...register('name')}
          />
          <p className="mt-1 text-[11px] text-gray-500 font-sans">
            A URL slug (e.g., /artificial-intelligence) will be automatically formatted on save.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Description (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Enter editorial description and topic coverage summary..."
            className={`w-full px-3 py-2.5 bg-white border-2 rounded-xl text-sm font-sans placeholder:text-gray-400 focus:outline-none transition-all shadow-[2px_2px_0px_0px_rgba(53,53,53,1)] ${
              errors.description
                ? 'border-red-500 focus:border-red-600'
                : 'border-[#353535] focus:border-[#D74108]'
            }`}
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-xs font-bold text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="inline-flex items-center gap-1.5 bg-[#D74108] text-white hover:bg-[#b83606] border-2 border-[#353535] shadow-[3px_3px_0px_0px_rgba(53,53,53,1)]"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <FolderPlus className="w-4 h-4" />
                <span>Create Category</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryFormModal;
