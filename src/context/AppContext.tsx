import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IAppContext, INote } from '../types';
import { Storage } from '../utils/storage';

/**
 * 应用上下文
 */
export const AppContext = createContext<IAppContext | null>(null);

/**
 * AppProvider 组件的 Props
 */
interface IAppProviderProps {
  children: ReactNode;
}

/**
 * 应用状态管理 Provider
 */
export function AppProvider({ children }: IAppProviderProps) {
  const [notes, setNotes] = useState<INote[]>([]);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初始化：从 LocalStorage 加载数据
  useEffect(() => {
    const loadedNotes = Storage.loadNotes();
    setNotes(loadedNotes);

    // 如果有笔记，默认选中第一条
    if (loadedNotes.length > 0) {
      setCurrentNoteId(loadedNotes[0].id);
    } else {
      // 如果没有笔记，创建一个默认笔记
      createDefaultNote();
    }

    setIsLoaded(true);
  }, []);

  // 当笔记变化时，自动保存到 LocalStorage
  useEffect(() => {
    if (isLoaded) {
      Storage.saveNotes(notes);
    }
  }, [notes, isLoaded]);

  /**
   * 创建默认笔记
   */
  const createDefaultNote = () => {
    const newNote: INote = {
      id: Storage.generateId(),
      title: '欢迎使用 Markdown 笔记',
      content: `# 欢迎使用 Markdown 笔记应用

这是一个简洁、高效的在线 Markdown 笔记工具。

## 功能特点

- ✨ 实时预览
- 📝 笔记管理
- 💾 本地存储
- 🔍 搜索功能

## Markdown 语法示例

### 文本格式

**粗体文本** 和 *斜体文本*

### 列表

1. 第一项
2. 第二项
3. 第三项

### 代码块

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

### 链接

[访问 GitHub](https://github.com)

---

开始记录你的想法吧！ 🚀`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote]);
    setCurrentNoteId(newNote.id);
  };

  /**
   * 添加新笔记
   */
  const addNote = () => {
    const newNote: INote = {
      id: Storage.generateId(),
      title: '未命名笔记',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setCurrentNoteId(newNote.id);
  };

  /**
   * 更新笔记
   */
  const updateNote = (id: string, data: Partial<Omit<INote, 'id' | 'createdAt'>>) => {
    setNotes(prev =>
      prev.map(note => {
        if (note.id === id) {
          return {
            ...note,
            ...data,
            updatedAt: new Date().toISOString(),
          };
        }
        return note;
      })
    );
  };

  /**
   * 删除笔记
   */
  const deleteNote = (id: string) => {
    const filteredNotes = notes.filter(note => note.id !== id);
    setNotes(filteredNotes);

    // 如果删除的是当前笔记，切换到其他笔记
    if (currentNoteId === id) {
      if (filteredNotes.length > 0) {
        setCurrentNoteId(filteredNotes[0].id);
      } else {
        // 如果没有笔记了，创建一个新笔记
        createDefaultNote();
      }
    }
  };

  const value: IAppContext = {
    notes,
    currentNoteId,
    addNote,
    updateNote,
    deleteNote,
    setCurrentNoteId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * 使用应用上下文的 Hook
 */
export function useAppContext(): IAppContext {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
