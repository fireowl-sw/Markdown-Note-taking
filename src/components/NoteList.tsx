import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Storage } from '../utils/storage';

/**
 * 笔记列表组件
 * 显示所有笔记，支持搜索和切换
 */
export function NoteList() {
  const { notes, currentNoteId, setCurrentNoteId, addNote, deleteNote } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState(notes);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // 根据搜索关键词过滤笔记
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNotes(notes);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
      setFilteredNotes(filtered);
    }
  }, [searchQuery, notes]);

  /**
   * 处理删除笔记
   */
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDeleteConfirm === id) {
      deleteNote(id);
      setShowDeleteConfirm(null);
    } else {
      setShowDeleteConfirm(id);
    }
  };

  /**
   * 获取笔记预览文本
   */
  const getPreview = (content: string): string => {
    const text = content.replace(/[#*`\[\]]/g, '').trim();
    return text.substring(0, 50) + (text.length > 50 ? '...' : '');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 border-r border-gray-200">
      {/* 头部：搜索框和新建按钮 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            placeholder="搜索笔记..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <button
          onClick={addNote}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建笔记
        </button>
      </div>

      {/* 笔记列表 */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? '没有找到匹配的笔记' : '暂无笔记'}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                onClick={() => setCurrentNoteId(note.id)}
                className={`p-4 cursor-pointer transition-colors hover:bg-gray-100 ${
                  currentNoteId === note.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate mb-1">
                      {note.title || '未命名笔记'}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {note.content ? getPreview(note.content) : '空笔记'}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {Storage.formatDate(note.updatedAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(note.id, e)}
                    className={`p-1 rounded transition-colors ${
                      showDeleteConfirm === note.id
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                    title={showDeleteConfirm === note.id ? '确认删除' : '删除笔记'}
                  >
                    {showDeleteConfirm === note.id ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
