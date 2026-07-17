import { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import Modal from '../../../components/ui/modal';
import Button from '../../../components/ui/button';
import { categoryService } from '../services/category.service';
import type { Category } from '../../../types/category.types';

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category: Category | null;
}

const DeleteCategoryModal = ({
  isOpen,
  onClose,
  onSuccess,
  category,
}: DeleteCategoryModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  if (!category) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setApiError(null);
      await categoryService.deleteCategory(category._id);
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete category.';
      setApiError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Category Deletion">
      <div className="space-y-4 font-sans">
        {apiError ? (
          <div className="p-4 bg-red-50 border-2 border-red-600 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <span>Deletion Blocked by Editorial Safety Rule</span>
            </div>
            <p className="text-xs text-red-800 leading-relaxed font-medium">{apiError}</p>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 border-2 border-amber-500 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="font-bold">Warning: Permanent Removal</p>
              <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                You are about to delete the category classification <span className="font-bold">"{category.name}"</span> (`/{category.slug}`). If this category is currently referenced by any published articles, our safety check will reject this operation.
              </p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            isLoading={isDeleting}
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 border-2 border-[#353535] shadow-[3px_3px_0px_0px_rgba(53,53,53,1)]"
          >
            <Trash2 className="w-4 h-4" />
            <span>Confirm Deletion</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteCategoryModal;
