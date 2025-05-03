import React, { useState, useEffect } from "react";
import { getCategories, getPriorities, getTaskStates } from "../api/api"; // Assume you have a way to get users too
import LoadingSpinner from "./LoadingSpinner"; // adjust the path as needed

const FilterBar = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    is_overdue: "",
    priority: "",
    category: "",
    state: "",
    owners: "", // Filter by owner ID
    search: "", // Search term for title/description
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleApplyFilters = () => {
    // Only send filters that have a value
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== "" && value !== null
      )
    );
    onApplyFilters(activeFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      is_overdue: "",
      priority: "",
      category: "",
      state: "",
      owners: "",
      search: "",
    });
    onApplyFilters({}); // Apply no filters
  };

  if (loadingOptions) {
    return <LoadingSpinner />;
  }

  if (errorOptions) {
    return (
      <div className="error-message">
        Error loading filter options: {errorOptions.message}
      </div>
    );
  }

  return (
    <div className="filter-bar">
      <div>
        <label htmlFor="search">Search:</label>
        <input
          type="text"
          id="search"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search title or description"
        />
      </div>
      <div>
        <label htmlFor="is_overdue">Overdue:</label>
        <select
          id="is_overdue"
          name="is_overdue"
          value={filters.is_overdue}
          onChange={handleChange}
        >
          <option value="">All</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      <div>
        <label htmlFor="priority">Priority:</label>
        <select
          id="priority"
          name="priority"
          value={filters.priority}
          onChange={handleChange}
        >
          <option value="">All</option>
          {priorities.map((priority) => (
            <option key={priority.id} value={priority.id}>
              {priority.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          name="category"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="state">State:</label>
        <select
          id="state"
          name="state"
          value={filters.state}
          onChange={handleChange}
        >
          <option value="">All</option>
          {taskStates.map((state) => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="owners">Owner:</label>
        <select
          id="owners"
          name="owners"
          value={filters.owners}
          onChange={handleChange}
        >
          <option value="">All</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleApplyFilters}>Apply Filters</button>
      <button onClick={handleClearFilters}>Clear Filters</button>
    </div>
  );
};

export default FilterBar;
