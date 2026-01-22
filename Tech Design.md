
### 1. 技术栈

**前端框架**
- React 18+：组件化开发
- TypeScript 5+：类型安全
- Vite 5+：快速构建工具

**核心库**
- react-markdown：Markdown 解析和渲染
- react-syntax-highlighter：代码语法高亮
- remark-gfm：GitHub Flavored Markdown 支持

**样式**
- Tailwind CSS 3+：原子化 CSS
- 支持暗黑模式（可选）

**数据存储**
- LocalStorage API：本地数据持久化

### 2. 架构设计

```
┌─────────────────────────────────────────────────┐
│                   App                           │
├──────────┬──────────────────┬──────────────────┤
│ NoteList │    Editor        │    Preview       │
│          │                  │                  │
│ - 搜索   │ - TextArea       │ - ReactMarkdown  │
│ - 列表   │ - 实时编辑       │ - 语法高亮       │
│ - 删除   │ - 自动保存       │ - 样式渲染       │
└──────────┴──────────────────┴──────────────────┘
           │
           ▼
    ┌─────────────┐
    │ LocalStore  │
    │ - notes     │
    │ - settings  │
    └─────────────┘
```

### 3. 数据结构设计

**Note 接口**
```typescript
interface Note {
  id: string;          // 唯一标识（UUID）
  title: string;       // 笔记标题
  content: string;     // Markdown 内容
  createdAt: number;   // 创建时间戳
  updatedAt: number;   // 更新时间戳
}
```

**数据存储结构**
```typescript
interface StoreData {
  notes: Note[];
  currentNoteId: string | null;
  settings: {
    theme: 'light' | 'dark';
    fontSize: number;
  };
}
```

### 4. 组件设计

**4.1 App（主组件）**
- 管理全局状态（笔记列表、当前笔记）
- 提供 Context 或 State 管理

**4.2 NoteList（笔记列表组件）**
- Props: `notes: Note[]`, `onSelect: (id: string) => void`, `onDelete: (id: string) => void`
- 功能：显示笔记列表、搜索过滤、删除操作

**4.3 Editor（编辑器组件）**
- Props: `note: Note`, `onChange: (content: string) => void`
- 功能：Markdown 输入、自动保存

**4.4 Preview（预览组件）**
- Props: `content: string`
- 功能：Markdown 渲染、代码高亮

### 5. 状态管理

**选项 1：React Hooks + Context**
```typescript
const AppContext = createContext<{
  notes: Note[];
  currentNote: Note | null;
  addNote: () => void;
  updateNote: (id: string, data: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}>(...);
```

**选项 2：Zustand（轻量级状态管理）**
- 简单易用
- 自动持久化中间件

### 6. 关键功能实现

**6.1 自动保存**
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    saveToLocalStorage(notes);
  }, 500);
  return () => clearTimeout(timer);
}, [notes]);
```

**6.2 搜索功能**
```typescript
const filteredNotes = notes.filter(note =>
  note.title.toLowerCase().includes(searchQuery.toLowerCase())
);
```

**6.3 Markdown 渲染**
```tsx
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    code({node, inline, className, children, ...props}) {
      return <SyntaxHighlighter {...props}>{children}</SyntaxHighlighter>;
    }
  }}
>
  {content}
</ReactMarkdown>
```

### 7. 样式设计

**布局**
- Flexbox/Grid 布局
- 固定高度，内部滚动
- 响应式断点：768px

**颜色方案**
- 主色：蓝色系
- 背景：浅灰色
- 边框：灰色分割线

### 8. 性能优化

- useMemo 缓存计算结果（搜索、渲染）
- useCallback 缓存事件处理函数
- 虚拟滚动（如果笔记数量很多）

### 9. 开发规范

**目录结构**
```
src/
├── components/       # 组件
│   ├── NoteList.tsx
│   ├── Editor.tsx
│   └── Preview.tsx
├── hooks/           # 自定义 Hooks
│   ├── useNotes.ts
│   └── useLocalStorage.ts
├── types/           # TypeScript 类型
│   └── index.ts
├── utils/           # 工具函数
│   └── storage.ts
└── App.tsx
```

**命名规范**
- 组件：PascalCase（NoteList）
- 函数：camelCase（saveNote）
- 常量：UPPER_SNAKE_CASE（MAX_NOTES）
