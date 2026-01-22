### 1. 项目说明

本项目是一个基于 React + TypeScript + Vite 的 Markdown 笔记应用，支持实时预览、笔记管理和本地存储。

### 2. 开发规范

**2.1 代码风格**
- 使用 TypeScript 编写所有代码
- 遵循 ESLint 和 Prettier 配置
- 组件使用函数式组件 + Hooks
- Props 使用 TypeScript 接口定义

**2.2 命名约定**
- 组件文件：PascalCase（如 `NoteList.tsx`）
- 工具文件：camelCase（如 `storage.ts`）
- 接口类型：PascalCase，以 `I` 开头（如 `INote`）

**2.3 注释规范**
- 所有组件添加 JSDoc 注释
- 复杂逻辑添加行内注释
- 导出的函数必须有注释说明

### 3. 开发流程

**3.1 初始化项目**
```bash
npm create vite@latest markdown-notes -- --template react-ts
cd markdown-notes
npm install
```

**3.2 安装依赖**
```bash
npm install react-markdown react-syntax-highlighter
npm install remark-gfm
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**3.3 开发步骤**
1. 搭建基础布局（三栏结构）
2. 实现数据模型和 LocalStorage
3. 开发 NoteList 组件（列表 + 搜索）
4. 开发 Editor 组件（编辑 + 保存）
5. 开发 Preview 组件（渲染 + 高亮）
6. 集成和联调
7. 优化和测试

### 4. 组件实现要求

**4.1 NoteList 组件**
- 显示笔记列表
- 实现搜索框（实时过滤）
- 每个笔记项显示标题和更新时间
- 点击切换当前笔记
- 删除按钮带确认

**4.2 Editor 组件**
- 使用 `textarea` 实现编辑器
- 支持语法缩进（Tab 键）
- 输入时自动更新状态
- 防抖保存（500ms）

**4.3 Preview 组件**
- 使用 `react-markdown` 渲染
- 集成 `react-syntax-highlighter` 高亮代码
- 支持常见 Markdown 语法
- 样式与编辑器对应

### 5. 状态管理要求

**使用 Context API 管理**
```typescript
// AppContext.tsx
export const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);

  // 实现增删改查方法
  const addNote = () => { ... };
  const updateNote = (id: string, data: Partial<Note>) => { ... };
  const deleteNote = (id: string) => { ... };

  return (
    <AppContext.Provider value={{ notes, currentNoteId, addNote, updateNote, deleteNote }}>
      {children}
    </AppContext.Provider>
  );
}
```

### 6. 样式要求

**使用 Tailwind CSS**
- 预设颜色：`bg-gray-50`, `text-gray-900`
- 布局：`flex`, `grid`, `h-screen`
- 间距：`p-4`, `gap-4`, `m-2`
- 边框：`border`, `border-gray-200`, `rounded`

**自定义样式**
```css
/* 在 index.css 中添加 */
.markdown-body {
  @apply prose max-w-none;
}
```

### 7. 测试要求

**7.1 单元测试**
- 使用 Vitest
- 测试关键组件和工具函数
- 覆盖率目标：70%+

**7.2 手动测试清单**
- [ ] 创建新笔记
- [ ] 编辑笔记内容
- [ ] 实时预览更新
- [ ] 搜索笔记
- [ ] 删除笔记
- [ ] 刷新页面数据不丢失
- [ ] Markdown 渲染正确
- [ ] 代码高亮显示

### 8. 性能要求

- 首屏加载 < 2s
- 编辑响应延迟 < 50ms
- 预览渲染延迟 < 100ms
- 支持至少 100 个笔记

### 9. 部署说明

**构建生产版本**
```bash
npm run build
```

**本地预览**
```bash
npm run preview
```

**部署到 GitHub Pages**
1. 在 `vite.config.ts` 配置 `base: '/repo-name/'`
2. 构建：`npm run build`
3. 推送到 `gh-pages` 分支

### 10. 附加功能（可选）

- [ ] 导出笔记为 Markdown 文件
- [ ] 导入 Markdown 文件
- [ ] 暗黑模式切换
- [ ] 快捷键支持
- [ ] 笔记标签系统
- [ ] 全文搜索（包括内容）

### 11. 常见问题

**Q: LocalStorage 有大小限制吗？**
A: 通常 5-10MB，足够存储大量文本笔记。

**Q: 如何处理 XSS 攻击？**
A: `react-markdown` 默认会转义 HTML，不要设置 `skipHtml`。

**Q: 代码高亮支持哪些语言？**
A: `react-syntax-highlighter` 支持 100+ 种语言。
