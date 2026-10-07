import { useEffect, useRef, useState } from "react";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(
          "https://dummyjson.com/todos?limit=10",
        );

        const data = response.data;

        setTodos(data.todos);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async () => {
    const value = inputRef.current.value.trim();

    if (value === "") return;

    try {
      const response = await axios.post("https://dummyjson.com/todos/add", {
        todo: value,
        completed: false,
        userId: 1,
      });

      const data = response.data;

      setTodos((prevTodos) => [data, ...prevTodos]);

      inputRef.current.value = "";
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = async (id) => {
    const todo = todos.find((item) => item.id === id);

    if (!todo) return;

    try {
      const response = await axios.patch(`https://dummyjson.com/todos/${id}`, {
        completed: !todo.completed,
      });

      const data = response.data;

      setTodos((prevTodos) =>
        prevTodos.map((item) => (item.id === id ? data : item)),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (todo) => {
    setSelectedTodo(todo);
  };

  const handleSave = async () => {
    const newTodoValue = editInputRef.current.value.trim();

    if (newTodoValue === "") return;

    try {
      const response = await axios.patch(
        `https://dummyjson.com/todos/${selectedTodo.id}`,
        {
          todo: newTodoValue,
        },
      );

      const data = response.data;

      setTodos((prevTodos) =>
        prevTodos.map((item) => (item.id === selectedTodo.id ? data : item)),
      );

      setSelectedTodo(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://dummyjson.com/todos/${id}`);

      setTodos((prevTodos) => prevTodos.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      addTodo();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Todo App</h1>
        <div className="flex gap-2 mb-6">
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter todo..."
            onKeyDown={handleKeyDown}
            className="flex-1 p-3 border border-gray-400 rounded-lg outline-none"
          />

          <button
            onClick={addTodo}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg cursor-pointer"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {todos.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleToggle(item.id)}
                  className="w-5 h-5 cursor-pointer"
                />

                <span
                  className={
                    item.completed
                      ? "line-through text-gray-400"
                      : "text-gray-800"
                  }
                >
                  {item.todo}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedTodo && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">Edit Todo</h2>

              <button
                onClick={() => setSelectedTodo(null)}
                className="text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <input
              ref={editInputRef}
              type="text"
              defaultValue={selectedTodo.todo}
              className="w-full p-3 border border-gray-400 rounded-lg outline-none mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedTodo(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
