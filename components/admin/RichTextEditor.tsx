"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { useState, useCallback } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

function ToolbarSep() {
  return <span className="w-px h-5 bg-gray-200 mx-1 inline-block self-center" />;
}

interface BtnProps {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}

function Btn({ onClick, active, title, children }: BtnProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={
        "p-1.5 rounded transition-colors text-sm font-medium " +
        (active
          ? "bg-blue-50 text-blue-600"
          : "text-gray-600 hover:bg-gray-100")
      }
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  minHeight = 320,
}: RichTextEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: false }),
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate({ editor: ed }) {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: "outline-none",
        style: `min-height:${minHeight}px`,
      },
    },
  });

  const applyLink = useCallback(() => {
    if (!editor) return;
    let url = linkUrl.trim();
    if (!url) {
      editor.chain().focus().unsetLink().run();
    } else {
      // Auto-prepend https:// if no protocol provided
      if (!/^https?:\/\//i.test(url) && !url.startsWith("/")) {
        url = "https://" + url;
      }
      editor.chain().focus().setLink({ href: url }).run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const removeLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
    setShowLinkInput(false);
    setLinkUrl("");
  }, [editor]);

  const applyImage = useCallback(() => {
    if (!editor) return;
    const url = imageUrl.trim();
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setShowImageInput(false);
    setImageUrl("");
  }, [editor, imageUrl]);

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 flex flex-wrap items-center gap-0.5 px-2 py-1.5">
        {/* Headings */}
        <Btn
          title="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        >
          H2
        </Btn>
        <Btn
          title="Heading 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
        >
          H3
        </Btn>

        <ToolbarSep />

        {/* Inline styles */}
        <Btn
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" d="M6 4h8a4 4 0 0 1 0 8H6z" />
            <path strokeLinecap="round" d="M6 12h9a4 4 0 0 1 0 8H6z" />
          </svg>
        </Btn>
        <Btn
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <line x1="19" y1="4" x2="10" y2="4" />
            <line x1="14" y1="20" x2="5" y2="20" />
            <line x1="15" y1="4" x2="9" y2="20" />
          </svg>
        </Btn>
        <Btn
          title="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M6 4v6a6 6 0 0 0 12 0V4" />
            <line x1="4" y1="20" x2="20" y2="20" />
          </svg>
        </Btn>
        <Btn
          title="Highlight"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          active={editor.isActive("highlight")}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M9 7l-4 9h2l1-2h4l1 2h2L11 7z" />
            <path d="M9 7h6" />
            <line x1="4" y1="20" x2="20" y2="20" strokeWidth={2.5} />
          </svg>
        </Btn>

        <ToolbarSep />

        {/* Lists and blocks */}
        <Btn
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="9" y1="6" x2="20" y2="6" />
            <line x1="9" y1="12" x2="20" y2="12" />
            <line x1="9" y1="18" x2="20" y2="18" />
            <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        </Btn>
        <Btn
          title="Ordered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="10" y1="6" x2="21" y2="6" />
            <line x1="10" y1="12" x2="21" y2="12" />
            <line x1="10" y1="18" x2="21" y2="18" />
            <text x="2" y="7" fontSize="6" fill="currentColor" stroke="none" fontWeight="bold">1.</text>
            <text x="2" y="13" fontSize="6" fill="currentColor" stroke="none" fontWeight="bold">2.</text>
            <text x="2" y="19" fontSize="6" fill="currentColor" stroke="none" fontWeight="bold">3.</text>
          </svg>
        </Btn>
        <Btn
          title="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
          </svg>
        </Btn>

        <ToolbarSep />

        {/* Alignment */}
        <Btn
          title="Align Left"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="15" y2="12" />
            <line x1="3" y1="18" x2="18" y2="18" />
          </svg>
        </Btn>
        <Btn
          title="Align Center"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="6" y1="12" x2="18" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </Btn>

        <ToolbarSep />

        {/* Link */}
        <Btn
          title="Link"
          onClick={() => {
            const existing = editor.getAttributes("link").href as string | undefined;
            setLinkUrl(existing ?? "");
            setShowLinkInput((v) => !v);
            setShowImageInput(false);
          }}
          active={editor.isActive("link")}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </Btn>

        {/* Image */}
        <Btn
          title="Image"
          onClick={() => {
            setShowImageInput((v) => !v);
            setShowLinkInput(false);
          }}
          active={false}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </Btn>

        {/* Horizontal Rule */}
        <Btn
          title="Horizontal Rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          active={false}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="3" y1="12" x2="21" y2="12" />
          </svg>
        </Btn>

        <ToolbarSep />

        {/* History */}
        <Btn
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          active={false}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M9 14 4 9l5-5" />
            <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
          </svg>
        </Btn>
        <Btn
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          active={false}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M15 14l5-5-5-5" />
            <path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" />
          </svg>
        </Btn>
      </div>

      {/* Link popover */}
      {showLinkInput && (
        <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 flex items-center gap-2">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyLink(); } }}
            placeholder="https://..."
            className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-400"
            autoFocus
          />
          <button
            type="button"
            onClick={applyLink}
            className="text-xs font-semibold px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={removeLink}
            className="text-xs font-semibold px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Remove
          </button>
          <button
            type="button"
            onClick={() => setShowLinkInput(false)}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            x
          </button>
        </div>
      )}

      {/* Image popover */}
      {showImageInput && (
        <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 flex items-center gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyImage(); } }}
            placeholder="Image URL..."
            className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-400"
            autoFocus
          />
          <button
            type="button"
            onClick={applyImage}
            className="text-xs font-semibold px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => setShowImageInput(false)}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            x
          </button>
        </div>
      )}

      {/* Editor content area */}
      <div className="rte-content p-4">
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .rte-content .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #94a3b8;
          pointer-events: none;
          height: 0;
        }
        .rte-content .tiptap {
          outline: none;
        }
        .rte-content .tiptap h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: #0f172a;
        }
        .rte-content .tiptap h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.4rem;
          color: #0f172a;
        }
        .rte-content .tiptap p {
          margin-bottom: 0.75rem;
          color: #475569;
          max-width: none;
        }
        .rte-content .tiptap ul {
          list-style-type: disc;
          margin-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .rte-content .tiptap ol {
          list-style-type: decimal;
          margin-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .rte-content .tiptap li {
          margin-bottom: 0.25rem;
          color: #475569;
        }
        .rte-content .tiptap a {
          color: #2563eb;
          text-decoration: underline;
        }
        .rte-content .tiptap strong {
          font-weight: 600;
          color: #0f172a;
        }
        .rte-content .tiptap em {
          font-style: italic;
        }
        .rte-content .tiptap u {
          text-decoration: underline;
        }
        .rte-content .tiptap mark {
          background-color: #fef08a;
          border-radius: 2px;
          padding: 0 2px;
        }
        .rte-content .tiptap blockquote {
          border-left: 4px solid #2563eb;
          padding: 0.5rem 1rem;
          background: #eff6ff;
          border-radius: 0 0.375rem 0.375rem 0;
          margin: 1rem 0;
          font-style: italic;
          color: #0f172a;
        }
        .rte-content .tiptap hr {
          border: none;
          border-top: 2px solid #e2e8f0;
          margin: 1.5rem 0;
        }
        .rte-content .tiptap img {
          max-width: 100%;
          border-radius: 0.5rem;
          margin: 0.5rem 0;
        }
        .rte-content .tiptap code {
          background: #f1f5f9;
          border-radius: 3px;
          padding: 0.1em 0.3em;
          font-size: 0.875em;
          font-family: monospace;
          color: #0f172a;
        }
        .rte-content .tiptap pre {
          background: #1e293b;
          color: #e2e8f0;
          border-radius: 0.5rem;
          padding: 1rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .rte-content .tiptap pre code {
          background: none;
          color: inherit;
          padding: 0;
        }
        .rte-content .tiptap table {
          border-collapse: collapse;
          width: 100%;
          margin: 1.25rem 0;
          font-size: 0.875rem;
          overflow-x: auto;
          display: block;
        }
        .rte-content .tiptap th,
        .rte-content .tiptap td {
          border: 1px solid #e2e8f0;
          padding: 0.5rem 0.75rem;
          text-align: left;
          vertical-align: top;
          color: #334155;
        }
        .rte-content .tiptap th {
          background: #f8fafc;
          font-weight: 600;
          color: #0f172a;
        }
        .rte-content .tiptap tr:nth-child(even) td {
          background: #f8fafc;
        }
        .rte-content .tiptap .selectedCell::after {
          background: rgba(37, 99, 235, 0.08);
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .rte-content .tiptap .column-resize-handle {
          background-color: #2563eb;
          bottom: -2px;
          pointer-events: none;
          position: absolute;
          right: -2px;
          top: 0;
          width: 2px;
        }
        .rte-content .tiptap .tableWrapper {
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
}
