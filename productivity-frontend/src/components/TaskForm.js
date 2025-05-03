import React, { useState, useEffect } from "react";
import { getCategories, getPriorities, getTaskStates } from "../api/api"; // Assume you have a way to get users too
import LoadingSpinner from "./LoadingSpinner"; // adjust the path as needed

const TaskForm = ({ onSubmit, initialData = {}, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "", // Format as YYYY-MM-DDTHH:mm
    owner_ids: [], // Array of user IDs
    priority_id: null,
    category_id: null,
    state_id: null,
  });

  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [taskStates, setTaskStates] = useState([]);
  const [users, setUsers] = useState([]); // Assume you have an endpoint to get users

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [errorOptions, setErrorOptions] = useState(null);

  useEffect(() => {
    // Fetch options (categories, priorities, states, users)
    const fetchOptions = async () => {
      try {
        const [categoriesRes, prioritiesRes, statesRes, usersRes] =
          await Promise.all([
            getCategories(),
            getPriorities(),
            getTaskStates(),
            // TODO: Add endpoint to get users: api.get('users/')
            Promise.resolve({ data: [] }), // Placeholder for users
          ]);
        setCategories(categoriesRes.data);
        setPriorities(prioritiesRes.data);
        setTaskStates(statesRes.data);
        setUsers(usersRes.data); // Set fetched users
        setLoadingOptions(false);
      } catch (error) {
        setErrorOptions(error);
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    // Populate form data when initialData changes (for editing)
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        due_date: initialData.due_date
          ? new Date(initialData.due_date).toISOString().slice(0, 16)
          : "", // Format for datetime-local input
        owner_ids: initialData.owners
          ? initialData.owners.map((owner) => owner.id)
          : [],
        priority_id: initialData.priority ? initialData.priority.id : null,
        category_id: initialData.category ? initialData.category.id : null,
        state_id: initialData.state ? initialData.state.id : null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;

    if (type === "select-multiple") {
      const values = Array.from(selectedOptions).map((option) => option.value);
      setFormData({ ...formData, [name]: values });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation (can be enhanced)
    if (!formData.title) {
      alert("Title is required.");
      return;
    }
    onSubmit(formData);
  };

  if (loadingOptions) {
    return <LoadingSpinner />;
  }

  if (errorOptions) {
    return (
      <div className="error-message">
        Error loading form options: {errorOptions.message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="due_date">Due Date:</label>
        <input
          type="datetime-local"
          id="due_date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="owner_ids">Owners:</label>
        <select
          id="owner_ids"
          name="owner_ids"
          multiple
          value={formData.owner_ids.map(String)} // Ensure values are strings for select
          onChange={handleChange}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="priority_id">Priority:</label>
        <select
          id="priority_id"
          name="priority_id"
          value={formData.priority_id || ""} // Use empty string for null
          onChange={handleChange}
        >
          <option value="">-- Select Priority --</option>
          {priorities.map((priority) => (
            <option key={priority.id} value={priority.id}>
              {priority.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="category_id">Category:</label>
        <select
          id="category_id"
          name="category_id"
          value={formData.category_id || ""} // Use empty string for null
          onChange={handleChange}
        >
          <option value="">-- Select Category --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="state_id">State:</label>
        <select
          id="state_id"
          name="state_id"
          value={formData.state_id || ""} // Use empty string for null
          onChange={handleChange}
        >
          <option value="">-- Select State --</option>
          {taskStates.map((state) => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">{isEditing ? "Update Task" : "Create Task"}</button>
    </form>
  );
};

export default TaskForm;
