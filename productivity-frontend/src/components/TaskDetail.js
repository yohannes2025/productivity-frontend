import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Assuming React Router
import {
  getTask,
  updateTask,
  uploadTaskFile,
  deleteTaskFile,
} from "../api/api";
import TaskForm from "./TaskForm";
import LoadingSpinner from "./LoadingSpinner";

const TaskDetail = () => {
  const { taskId } = useParams(); // Get task ID from URL
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTask(taskId);
      setTask(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const response = await updateTask(taskId, taskData);
      setTask(response.data); // Update the task state with the response
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Error updating task:", error);
      // Handle error
    }
  };

  const handleFileChange = (e) => {
    setFileToUpload(e.target.files[0]);
  };

  const handleUploadFile = async () => {
    if (!fileToUpload) {
      alert("Please select a file to upload.");
      return;
    }

    setUploadingFile(true);
    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const response = await uploadTaskFile(taskId, formData);
      // Add the new file to the task's files list
      setTask({
        ...task,
        files: [...task.files, response.data],
      });
      setFileToUpload(null); // Clear the selected file
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle error
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        await deleteTaskFile(fileId);
        // Remove the deleted file from the task's files list
        setTask({
          ...task,
          files: task.files.filter((file) => file.id !== fileId),
        });
      } catch (error) {
        console.error("Error deleting file:", error);
        // Handle error
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="error-message">Error loading task: {error.message}</div>
    );
  }

  if (!task) {
    return <div className="not-found">Task not found.</div>;
  }

  return (
    <div className="task-detail-page">
      {isEditing ? (
        <div>
          <h2>Edit Task</h2>
          <TaskForm
            onSubmit={handleUpdateTask}
            initialData={task}
            isEditing={true}
          />
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h2>{task.title}</h2>
          <p>Description: {task.description}</p>
          <p>
            Due Date:{" "}
            {task.due_date
              ? new Date(task.due_date).toLocaleString()
              : "No due date"}
          </p>
          <p>Overdue: {task.is_overdue ? "Yes" : "No"}</p>
          <p>Priority: {task.priority ? task.priority.name : "N/A"}</p>
          <p>State: {task.state ? task.state.name : "N/A"}</p>
          <p>Category: {task.category ? task.category.name : "N/A"}</p>
          <p>
            Created By: {task.created_by ? task.created_by.username : "N/A"}
          </p>
          <p>
            Owners:{" "}
            {task.owners.map((owner) => owner.username).join(", ") || "None"}
          </p>
          <p>Created At: {new Date(task.created_at).toLocaleString()}</p>
          <p>Updated At: {new Date(task.updated_at).toLocaleString()}</p>

          <button onClick={() => setIsEditing(true)}>Edit Task</button>

          <h3>Files</h3>
          {task.files && task.files.length > 0 ? (
            <ul>
              {task.files.map((file) => (
                <li key={file.id}>
                  <a href={file.file} target="_blank" rel="noopener noreferrer">
                    {file.file.split("/").pop()} {/* Display filename */}
                  </a>
                  {file.uploaded_by &&
                    ` (Uploaded by: ${file.uploaded_by.username})`}
                  <button onClick={() => handleDeleteFile(file.id)}>
                    Delete File
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No files attached.</p>
          )}

          <h4>Upload New File</h4>
          <input type="file" onChange={handleFileChange} />
          <button
            onClick={handleUploadFile}
            disabled={!fileToUpload || uploadingFile}
          >
            {uploadingFile ? "Uploading..." : "Upload File"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
