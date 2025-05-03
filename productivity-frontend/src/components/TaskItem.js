import React from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router

const TaskItem = ({ task, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete(task.id);
    }
  };

  return (
    <div className={`task-item ${task.is_overdue ? "overdue" : ""}`}>
      <h3>
        <Link to={`/tasks/${task.id}`}>{task.title}</Link>
      </h3>
      <p>{task.description}</p>
      <p>
        Due Date:{" "}
        {task.due_date
          ? new Date(task.due_date).toLocaleString()
          : "No due date"}
      </p>
      <p>Priority: {task.priority ? task.priority.name : "N/A"}</p>
      <p>State: {task.state ? task.state.name : "N/A"}</p>
      <p>Category: {task.category ? task.category.name : "N/A"}</p>
      <p>
        Owners:{" "}
        {task.owners.map((owner) => owner.username).join(", ") || "None"}
      </p>
      {/* Display files if needed */}
      {/* <div>
        Files: {task.files.map(file => <span key={file.id}>{file.file.split('/').pop()} </span>)}
      </div> */}
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default TaskItem;
