import { useState } from "react";
import type { IDEntry } from "../lib/pokedex/misc-types";
import "../styles/TaskList.css";
import { PokemonAutocomplete } from "./PokemonAutocomplete";
import { getSpeciesForTask, type Task } from "../lib/tasks";

interface TaskListProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onCompleteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskList = ({
  tasks,
  onAddTask,
  onCompleteTask,
  onDeleteTask,
}: TaskListProps) => {
  const [title, setTitle] = useState("");
  const [selectedReward, setSelectedReward] = useState<IDEntry | undefined>();

  const handleAddTask = () => {
    if (!selectedReward) {
      return;
    }
    if (title.trim()) {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title,
        completed: false,
        reward: selectedReward,
        createdAt: Date.now(),
      };
      onAddTask(newTask);
      setTitle("");
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="task-list-container">
      <div className="progress-bar">
        <h2>Cleaning Progress</h2>
        <div className="progress">
          <div
            className="progress-fill"
            style={{
              width:
                totalCount === 0
                  ? 0
                  : `${(completedCount / totalCount) * 100}%`,
            }}
          ></div>
        </div>
        <p>
          {completedCount} / {totalCount} tasks completed
        </p>
      </div>

      <div className="add-task-form">
        <h3>Add New Tidying Task</h3>
        <input
          type="text"
          placeholder="Enter task (e.g., Clean bedroom)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
          className="task-input"
        />
        <PokemonAutocomplete
          value={selectedReward}
          onChange={setSelectedReward}
        />
        <button onClick={handleAddTask} className="add-btn">
          Add Task
        </button>
      </div>

      <div className="tasks">
        <h3>Your Tasks</h3>
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks yet. Add one to get started!</p>
        ) : (
          <ul className="task-items">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`task-item ${task.completed ? "completed" : ""}`}
              >
                <div className="task-content">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => !task.completed && onCompleteTask(task.id)}
                    disabled={task.completed}
                    className="task-checkbox"
                  />
                  <div className="task-info">
                    <span className="task-title">{task.title}</span>
                    <span className="task-reward">
                      🎁 Earns {getSpeciesForTask(task).name}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="delete-btn"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
