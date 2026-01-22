import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

/**
 * 编辑器组件
 * 支持 Markdown 编辑和快捷键
 */
export function Editor() {
  const { notes, currentNoteId, updateNote } = useAppContext();
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // 获取当前笔记
  const currentNote = notes.find(note => note.id === currentNoteId);

  // 当切换笔记时，更新编辑器内容
  useEffect(() => {
    if (currentNote) {
      setContent(currentNote.content);
    } else {
      setContent('');
    }
  }, [currentNoteId, currentNote]);

  /**
   * 防抖保存
   */
  const debouncedSave = (newContent: string, newTitle?: string) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (currentNoteId) {
        updateNote(currentNoteId, {
          content: newContent,
          ...(newTitle && { title: newTitle }),
        });
      }
    }, 500);
  };

  /**
   * 处理内容变化
   */
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // 提取标题（第一行 # 开头的内容）
    const lines = newContent.split('\n');
    const firstLine = lines[0];
    let title = currentNote?.title;

    if (firstLine.startsWith('# ')) {
      const newTitle = firstLine.substring(2).trim();
      if (newTitle && newTitle !== title) {
        title = newTitle;
      }
    } else if (currentNote?.title === '未命名笔记' || !currentNote?.title) {
      // 如果第一行不是标题，使用前30个字符作为标题
      const textContent = newContent.replace(/[#*`\[\]]/g, '').trim();
      title = textContent.substring(0, 30) || '未命名笔记';
    }

    debouncedSave(newContent, title);
  };

  /**
   * 处理 Tab 键
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = content.substring(0, start) + '  ' + content.substring(end);
      setContent(newValue);

      // 恢复光标位置
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }

    // Ctrl+S 保存
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (currentNoteId) {
        updateNote(currentNoteId, { content });
      }
    }
  };

  if (!currentNote) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg">选择或创建一个笔记开始编辑</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>编辑器</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>Tab: 缩进</span>
          <span className="mx-1">•</span>
          <span>Ctrl+S: 保存</span>
        </div>
      </div>

      {/* 编辑区域 */}
      <div className="flex-1 overflow-hidden">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          placeholder="开始输入 Markdown 内容..."
          className="w-full h-full p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed"
          style={{
            lineHeight: '1.8',
          }}
        />
      </div>

      {/* 状态栏 */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
        <span>{content.length} 字符</span>
        <span>{content.split('\n').length} 行</span>
      </div>
    </div>
  );
}
