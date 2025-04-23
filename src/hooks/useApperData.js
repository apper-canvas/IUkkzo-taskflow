import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchTasks, createTask, updateTask, deleteTask, 
  setTaskPagination, clearTaskErrors 
} from '../store/taskSlice'
import {
  fetchProjects, createProject, updateProject, deleteProject,
  setProjectPagination, selectProject, clearProjectErrors
} from '../store/projectSlice'

// Custom hook for working with tasks
export const useTaskData = (initialFilters = {}) => {
  const dispatch = useDispatch()
  const { items, isLoading, error, pagination } = useSelector(state => state.tasks)
  const [filters, setFilters] = useState(initialFilters)

  // Load tasks
  const loadTasks = useCallback((params = {}) => {
    const queryParams = {
      ...params,
      filters: params.filters || filters,
      limit: params.limit || pagination.limit,
      offset: params.offset || pagination.offset,
    }
    return dispatch(fetchTasks(queryParams))
  }, [dispatch, filters, pagination.limit, pagination.offset])

  // Create a new task
  const addTask = useCallback((taskData) => {
    return dispatch(createTask(taskData))
  }, [dispatch])

  // Update a task
  const editTask = useCallback((id, taskData) => {
    return dispatch(updateTask({ id, taskData }))
  }, [dispatch])

  // Delete a task
  const removeTask = useCallback((id) => {
    return dispatch(deleteTask(id))
  }, [dispatch])

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters,
    }))
  }, [])

  // Update pagination
  const updatePagination = useCallback((newPagination) => {
    dispatch(setTaskPagination(newPagination))
  }, [dispatch])

  // Clear errors
  const clearErrors = useCallback(() => {
    dispatch(clearTaskErrors())
  }, [dispatch])

  // Load tasks when filters or pagination changes
  useEffect(() => {
    loadTasks()
  }, [filters, pagination.limit, pagination.offset, loadTasks])

  return {
    tasks: items,
    isLoading,
    error,
    pagination,
    loadTasks,
    addTask,
    editTask,
    removeTask,
    updateFilters,
    updatePagination,
    clearErrors,
  }
}

// Custom hook for working with projects
export const useProjectData = (initialFilters = {}) => {
  const dispatch = useDispatch()
  const { items, isLoading, error, pagination, selectedProject } = useSelector(state => state.projects)
  const [filters, setFilters] = useState(initialFilters)

  // Load projects
  const loadProjects = useCallback((params = {}) => {
    const queryParams = {
      ...params,
      filters: params.filters || filters,
      limit: params.limit || pagination.limit,
      offset: params.offset || pagination.offset,
    }
    return dispatch(fetchProjects(queryParams))
  }, [dispatch, filters, pagination.limit, pagination.offset])

  // Create a new project
  const addProject = useCallback((projectData) => {
    return dispatch(createProject(projectData))
  }, [dispatch])

  // Update a project
  const editProject = useCallback((id, projectData) => {
    return dispatch(updateProject({ id, projectData }))
  }, [dispatch])

  // Delete a project
  const removeProject = useCallback((id) => {
    return dispatch(deleteProject(id))
  }, [dispatch])

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters,
    }))
  }, [])

  // Update pagination
  const updatePagination = useCallback((newPagination) => {
    dispatch(setProjectPagination(newPagination))
  }, [dispatch])

  // Select a project
  const setSelectedProject = useCallback((project) => {
    dispatch(selectProject(project))
  }, [dispatch])

  // Clear errors
  const clearErrors = useCallback(() => {
    dispatch(clearProjectErrors())
  }, [dispatch])

  // Load projects when filters or pagination changes
  useEffect(() => {
    loadProjects()
  }, [filters, pagination.limit, pagination.offset, loadProjects])

  return {
    projects: items,
    isLoading,
    error,
    pagination,
    selectedProject,
    loadProjects,
    addProject,
    editProject,
    removeProject,
    updateFilters,
    updatePagination,
    setSelectedProject,
    clearErrors,
  }
}