import { AppProvider } from './context/AppContext';
import { NoteList } from './components/NoteList';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';

/**
 * 应用主组件
 * 三栏布局：笔记列表 + 编辑器 + 预览
 */
function App() {
  return (
    <AppProvider>
      <div className="h-screen flex flex-col">
        {/* 顶部导航栏 */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Markdown 笔记应用</h1>
          </div>
        </header>

        {/* 主内容区域 - 三栏布局 */}
        <main className="flex-1 flex overflow-hidden">
          {/* 左侧：笔记列表 */}
          <aside className="w-80 flex-shrink-0">
            <NoteList />
          </aside>

          {/* 中间：编辑器 */}
          <section className="flex-1 flex-shrink-0 border-l border-gray-200">
            <Editor />
          </section>

          {/* 右侧：预览 */}
          <section className="flex-1 flex-shrink-0 border-l border-gray-200">
            <Preview />
          </section>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
