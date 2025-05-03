import React from "react";
import TaskItem from "./TaskItem";
import LoadingSpinner from "./LoadingSpinner";

const TaskList = ({ tasks, onDeleteTask, loading, error }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="error-message">Error loading tasks: {error.message}</div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return <div className="no-tasks">No tasks found.</div>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onDelete={onDeleteTask} />
      ))}
    </div>
  );
};

export default TaskList;
