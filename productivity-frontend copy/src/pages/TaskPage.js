import React, { useState, useEffect } from "react";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import FilterBar from "../components/FilterBar";
import { getTasks, createTask, deleteTask } from "../api/api";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [errorTasks, setErrorTasks] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});

  useEffect(() => {
    fetchTasks(currentFilters);
  }, [currentFilters]); // Refetch tasks when filters change

  const fetchTasks = async (filters) => {
    setLoadingTasks(true);
    setErrorTasks(null);
    try {
      const response = await getTasks(filters);
      setTasks(response.data);
    } catch (error) {
      setErrorTasks(error);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await createTask(taskData);
      setTasks([...tasks, response.data]); // Add the new task to the list
      // Optionally, reset the form or navigate
    } catch (error) {
      console.error("Error creating task:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId)); // Remove the deleted task
    } catch (error) {
      console.error("Error deleting task:", error);
      // Handle error
    }
  };

  const handleApplyFilters = (filters) => {
    setCurrentFilters(filters);
  };

  return (
    <div className="task-page">
      <h1>Tasks</h1>

      <h2>Create New Task</h2>
      <TaskForm onSubmit={handleCreateTask} />

      <h2>Filter Tasks</h2>
      <FilterBar onApplyFilters={handleApplyFilters} />

      <h2>Task List</h2>
      <TaskList
        tasks={tasks}
        onDeleteTask={handleDeleteTask}
        loading={loadingTasks}
        error={errorTasks}
      />
    </div>
  );
};

export default TaskPage;
