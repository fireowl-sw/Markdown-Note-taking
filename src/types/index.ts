/**
 * 笔记数据结构
 */
export interface INote {
  /** 笔记唯一标识 */
  id: string;
  /** 笔记标题 */
  title: string;
  /** 笔记内容（Markdown格式）*/
  content: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/**
 * 应用上下文类型
 */
export interface IAppContext {
  /** 所有笔记列表 */
  notes: INote[];
  /** 当前选中的笔记ID */
  currentNoteId: string | null;
  /** 创建新笔记 */
  addNote: () => void;
  /** 更新笔记 */
  updateNote: (id: string, data: Partial<Omit<INote, 'id' | 'createdAt'>>) => void;
  /** 删除笔记 */
  deleteNote: (id: string) => void;
  /** 设置当前笔记 */
  setCurrentNoteId: (id: string | null) => void;
}
