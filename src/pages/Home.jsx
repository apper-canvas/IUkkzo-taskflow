import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  const addTask = (task) => {
    setTasks(prev => [...prev, task]);
  };
  
  const toggleTaskStatus = (id) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, 
            status: task.status === 'completed' ? 'pending' : 'completed',
            completedAt: task.status === 'completed' ? null : new Date().toISOString()
          } 
        : task
    ));
  };
  
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'high') return task.priority === 'high';
    if (filter === 'medium') return task.priority === 'medium';
    if (filter === 'low') return task.priority === 'low';
    return true;
  });
  
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'priority') {
      const priorityMap = { high: 3, medium: 2, low: 1 };
      return priorityMap[b.priority] - priorityMap[a.priority];
    }
    if (sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
  
  const completedCount = tasks.filter(task => task.status === 'completed').length;
  const pendingCount = tasks.filter(task => task.status === 'pending').length;
  
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome to TaskFlow</h1>
        <p className="text-surface-600 dark:text-surface-400">
          Organize your tasks and boost your productivity
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MainFeature 
            addTask={addTask} 
            tasks={sortedTasks} 
            toggleTaskStatus={toggleTaskStatus}
            deleteTask={deleteTask}
          />
        </div>
        
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-5"
          >
            <h2 className="text-xl font-semibold mb-4">Task Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="neu-light dark:neu-dark rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-primary">{pendingCount}</p>
                <p className="text-sm text-surface-600 dark:text-surface-400">Pending</p>
              </div>
              <div className="neu-light dark:neu-dark rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-secondary">{completedCount}</p>
                <p className="text-sm text-surface-600 dark:text-surface-400">Completed</p>
              </div>
              <div className="neu-light dark:neu-dark rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-accent">{tasks.length}</p>
                <p className="text-sm text-surface-600 dark:text-surface-400">Total</p>
              </div>
              <div className="neu-light dark:neu-dark rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-500">
                  {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%
                </p>
                <p className="text-sm text-surface-600 dark:text-surface-400">Progress</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-5"
          >
            <h2 className="text-xl font-semibold mb-4">Filter & Sort</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Filter by Status</label>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Sort by</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input"
              >
                <option value="date">Date Created</option>
                <option value="priority">Priority</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-5"
          >
            <h2 className="text-xl font-semibold mb-4">Tips</h2>
            <ul className="space-y-2 text-surface-700 dark:text-surface-300">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Break large tasks into smaller, manageable ones</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Set priorities to focus on what matters most</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Review and update your tasks regularly</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;