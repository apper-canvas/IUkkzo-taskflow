import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTaskData, useProjectData } from '../hooks/useApperData'
import { format } from 'date-fns'

function Dashboard() {
  const { user } = useSelector(state => state.user)
  const { 
    tasks, 
    isLoading: tasksLoading, 
    loadTasks 
  } = useTaskData()
  const { 
    projects, 
    isLoading: projectsLoading, 
    loadProjects 
  } = useProjectData()
  
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    totalProjects: 0,
    activeProjects: 0
  })

  useEffect(() => {
    // Load initial data
    loadTasks()
    loadProjects()
  }, [loadTasks, loadProjects])

  useEffect(() => {
    // Calculate stats from loaded data
    if (tasks && projects) {
      setStats({
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'Completed').length,
        inProgressTasks: tasks.filter(t => t.status === 'In Progress').length,
        todoTasks: tasks.filter(t => t.status === 'Todo').length,
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'In Progress').length
      })
    }
  }, [tasks, projects])

  if (tasksLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.firstName || 'User'}!</p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Tasks</h3>
          <p className="text-2xl font-semibold">{stats.totalTasks}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Tasks Completed</h3>
          <p className="text-2xl font-semibold text-green-600">{stats.completedTasks}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-gray-500 text-sm font-medium mb-1">In Progress</h3>
          <p className="text-2xl font-semibold text-blue-600">{stats.inProgressTasks}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Active Projects</h3>
          <p className="text-2xl font-semibold text-purple-600">{stats.activeProjects}</p>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.slice(0, 5).map((task) => (
                <tr key={task.Id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${task.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${task.priority === 'High' ? 'bg-red-100 text-red-800' : 
                        task.priority === 'Medium' ? 'bg-orange-100 text-orange-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'Not set'}
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No tasks found. Create your first task to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Projects */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.slice(0, 5).map((project) => (
                <tr key={project.Id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.Name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${project.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.start_date ? format(new Date(project.start_date), 'MMM dd, yyyy') : 'Not set'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.end_date ? format(new Date(project.end_date), 'MMM dd, yyyy') : 'Not set'}
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No projects found. Create your first project to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard