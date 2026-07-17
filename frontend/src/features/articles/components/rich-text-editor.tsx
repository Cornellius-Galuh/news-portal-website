import React, { useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  UploadCloud,
  RotateCcw,
  RotateCw,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#D74108] underline cursor-pointer font-semibold',
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto my-4 border border-[#353535] bg-[#353535]/5',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose max-w-none min-h-[300px] p-4 focus:outline-none text-[#353535] font-serif leading-relaxed',
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL link:', previousUrl || 'https://');

    // cancelled
    if (url === null) {
      return;
    }

    // empty -> remove link
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // set link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const handleInlineImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      if (file.size > 50 * 1024 * 1024) {
        alert('Image file must be smaller than 50 MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        if (src) {
          editor.chain().focus().setImage({ src }).run();
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    },
    [editor],
  );

  if (!editor) {
    return (
      <div className="w-full border border-[#353535] bg-[#F2EFE9] min-h-[350px] flex items-center justify-center font-serif text-sm uppercase tracking-wider text-[#353535]/70">
        Loading editor...
      </div>
    );
  }

  return (
    <div className={`border border-[#353535] bg-[#F2EFE9] flex flex-col ${className}`}>
      {/* Toolbar */}
      <div className="bg-[#E8E5DF] border-b border-[#353535] p-2 flex flex-wrap items-center gap-1 select-none">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 text-[#353535] hover:bg-[#F2EFE9] transition-colors ${
            editor.isActive('bold') ? 'bg-[#353535] text-white font-bold' : ''
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 text-[#353535] hover:bg-[#F2EFE9] transition-colors ${
            editor.isActive('italic') ? 'bg-[#353535] text-white font-bold' : ''
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 text-[#353535] hover:bg-[#F2EFE9] transition-colors ${
            editor.isActive('underline') ? 'bg-[#353535] text-white font-bold' : ''
          }`}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-[#353535]/40 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 text-[#353535] hover:bg-[#F2EFE9] transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-[#353535] text-white font-bold' : ''
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 text-[#353535] hover:bg-[#F2EFE9] transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-[#353535] text-white font-bold' : ''
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 text-[#353535] hover:bg-[#F2EFE9] transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-[#353535] text-white font-bold' : ''
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-[#353535]/40 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 text-[#353535] hover:bg-[#F2EFE9] transition-colors ${
            editor.isActive('bulletList') ? 'bg-[#353535] text-white font-bold' : ''
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 text-[#353535] hover:bg-[#F2EFE9] transition-colors ${
            editor.isActive('orderedList') ? 'bg-[#353535] text-white font-bold' : ''
          }`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-[#353535]/40 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 text-[#353535] hover:bg-[#F2EFE9] transition-colors ${
            editor.isActive('blockquote') ? 'bg-[#353535] text-white font-bold' : ''
          }`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 text-[#353535] hover:bg-[#F2EFE9] transition-colors ${
            editor.isActive('codeBlock') ? 'bg-[#353535] text-white font-bold' : ''
          }`}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-[#353535]/40 mx-1" />

        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 text-[#353535] hover:bg-[#F2EFE9] transition-colors ${
            editor.isActive('link') ? 'bg-[#353535] text-white font-bold' : ''
          }`}
          title="Set Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        {editor.isActive('link') && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-1.5 text-rose-600 hover:bg-rose-100 transition-colors"
            title="Unset Link"
          >
            <Unlink className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 text-[#353535] hover:bg-[#F2EFE9] transition-colors"
          title="Upload & Insert Image from Device"
        >
          <UploadCloud className="w-4 h-4 text-[#D74108]" />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-1.5 text-[#353535] hover:bg-[#F2EFE9] transition-colors"
          title="Insert Image URL"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-[#353535]/40 mx-1 ml-auto" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 text-[#353535] hover:bg-[#F2EFE9] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Undo"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 text-[#353535] hover:bg-[#F2EFE9] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Redo"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Hidden file input for inserting inline images directly */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInlineImageSelect}
        className="hidden"
      />

      {/* Editor Content Area */}
      <div className="flex-1 cursor-text bg-[#F2EFE9]" onClick={() => editor.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
