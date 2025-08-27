import { useTodos } from "../../contexts/TodoContext";
import type { TodoType } from "../../types/TodoType";
import TodoItem from "./TodoItem";

const TodoList = (): JSX.Element => {
  const { todos } = useTodos();
  return (
    <div>
      <h2>TodoList</h2>
      <ul>
        {todos.map((item: any) => (
          <TodoItem key={item.id} todo={item} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
