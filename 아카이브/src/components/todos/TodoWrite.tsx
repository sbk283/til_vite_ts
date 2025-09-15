import { useRef, useState } from 'react';
import type { Todo, TodoInsert } from '../../types/TodoType';
import { useTodos } from '../../contexts/TodoContext';
import { createTodo } from '../../services/todoService';

type TodoWriteProps = {
  children?: React.ReactNode;
  handleChangePage: (page: number) => void;
};
const TodoWrite = ({ handleChangePage }: TodoWriteProps): JSX.Element => {
  // Context 를 사용함.
  const { addTodo } = useTodos();

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  // 데이터가 추가 되고 있는지의 상태
  const [saving, setSaving] = useState<boolean>(false);

  // 추가: 저장 재진입 방지용 ref (렌더 유발 안 함)
  const savingRef = useRef(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    // 한글 IME 조합 중 엔터면 무시
    if (e.key === 'Enter' && (e.nativeEvent?.isComposing || false)) return;

    // 길게 눌러서 생기는 반복 키 입력 방지
    if (e.key === 'Enter' && e.repeat) return;

    if (e.key === 'Enter') {
      e.preventDefault(); // 엔터 시 기본 동작 차단
      handleSave();
    }
  };

  //  Supabase 에 데이터를 Insert 한다. : 비동기
  const handleSave = async (): Promise<void> => {
    // 저장 중 재진입 방지
    if (savingRef.current) return;

    if (!title.trim()) {
      alert('제목을 입력하세요.');
      return;
    }

    try {
      savingRef.current = true;

      const newTodo = { title: title.trim(), content: content.trim() };
      // Supabase 에 데이터를 Insert 함
      // Insert 결과로 추가가 된 Todo 형태를 받아옮
      const result = await createTodo(newTodo);
      if (result) {
        // Context 에 Todo 타입 데이터를 추가해 줌.
        addTodo(result);

        // 현재 페이지를 1 페이지로 이동
        handleChangePage(1);
      }

      // 현재 Write 컴포넌트 state 초기화
      setTitle('');
      setContent('');
    } catch (error) {
      console.log(error);
      alert('데이터 추가에 실패 하였습니다.');
    } finally {
      savingRef.current = false;
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: 'var(--space-4)', color: 'var(--gray-800)' }}>할일 작성</h2>
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <input
          type="text"
          value={title}
          onChange={e => handleChange(e)}
          onKeyDown={e => handleKeyDown(e)}
          placeholder="제목을 입력하세요"
          className="form-input"
          style={{ flex: 1 }}
        />
        <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
          {saving ? '저장중...' : '저장'}
        </button>
      </div>
    </div>
  );
};

export default TodoWrite;
