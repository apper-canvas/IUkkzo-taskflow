import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Circle, 
  Trash2, 
  Clock, 
  AlertTriangle, 
  Flag, 
  Plus, 
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const MainFeature = ({ addTask, tasks, toggleTaskStatus, deleteTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [formError, setFormError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setFormError('Task title is required');
      return;
    }
    
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      priority,
      status: 'pending',
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    
    addTask(newTask);
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setFormError('');
    setIsFormOpen(false);
  };
  
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'medium':
        return <Clock size={16} className="text-yellow-500" />;
      case 'low':
        return <Flag size={16} className="text-green-500" />;
      default:
        return null;
    }
  };
  
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'task-item-high';
      case 'medium':
        return 'task-item-medium';
      case 'low':
        return 'task-item-low';
      default:
        return '';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Tasks</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(prev => !prev)}
          className="btn btn-primary flex items-center gap-2"
        >
          {isFormOpen ? <X size={18} /> : <Plus size={18} />}
          {isFormOpen ? 'Cancel' : 'Add Task'}
        </motion.button>
      </div>
      
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="card p-5 mb-6">
              <h3 className="text-xl font-semibold mb-4">Create New Task</h3>
              
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (e.target.value.trim()) setFormError('');
                  }}
                  placeholder="What needs to be done?"
                  className="input"
                />
                {formError && (
                  <p className="mt-1 text-sm text-red-500">{formError}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add details about this task..."
                  rows="3"
                  className="input"
                ></textarea>
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-medium mb-1">Priority</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value="low"
                      checked={priority === 'low'}
                      onChange={() => setPriority('low')}
                      className="sr-only"
                    />
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      priority === 'low' 
                        ? 'border-green-500 bg-green-500/10' 
                        : 'border-surface-300 dark:border-surface-600'
                    }`}>
                      {priority === 'low' && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
                    </span>
                    <span>Low</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value="medium"
                      checked={priority === 'medium'}
                      onChange={() => setPriority('medium')}
                      className="sr-only"
                    />
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      priority === 'medium' 
                        ? 'border-yellow-500 bg-yellow-500/10' 
                        : 'border-surface-300 dark:border-surface-600'
                    }`}>
                      {priority === 'medium' && <span className="w-2 h-2 rounded-full bg-yellow-500"></span>}
                    </span>
                    <span>Medium</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value="high"
                      checked={priority === 'high'}
                      onChange={() => setPriority('high')}
                      className="sr-only"
                    />
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      priority === 'high' 
                        ? 'border-red-500 bg-red-500/10' 
                        : 'border-surface-300 dark:border-surface-600'
                    }`}>
                      {priority === 'high' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                    </span>
                    <span>High</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn btn-primary"
                >
                  Create Task
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="space-y-3">
        <AnimatePresence>
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="card p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
                <CheckCircle size={32} className="text-surface-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
              <p className="text-surface-600 dark:text-surface-400 mb-4">
                Add your first task to get started
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFormOpen(true)}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Add Task
              </motion.button>
            </motion.div>
          ) : (
            tasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                toggleTaskStatus={toggleTaskStatus}
                deleteTask={deleteTask}
                getPriorityIcon={getPriorityIcon}
                getPriorityClass={getPriorityClass}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const TaskItem = ({ task, toggleTaskStatus, deleteTask, getPriorityIcon, getPriorityClass }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className={`card task-item ${getPriorityClass(task.priority)}`}
    >
      <div className="p-4 flex items-start gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleTaskStatus(task.id)}
          className="mt-0.5 flex-shrink-0"
        >
          {task.status === 'completed' ? (
            <CheckCircle size={20} className="text-primary" />
          ) : (
            <Circle size={20} className="text-surface-400" />
          )}
        </motion.button>
        
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-surface-500 dark:text-surface-500' : ''}`}>
                {task.title}
              </h3>
              
              <div className="flex items-center gap-2 mt-1 text-xs text-surface-500 dark:text-surface-400">
                <span className="flex items-center gap-1">
                  {getPriorityIcon(task.priority)}
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </span>
                <span>•</span>
                <span>Created {formatDate(task.createdAt)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteTask(task.id)}
                className="text-surface-500 hover:text-red-500 dark:text-surface-400 dark:hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsExpanded(prev => !prev)}
                className="text-surface-500 hover:text-primary dark:text-surface-400 dark:hover:text-primary transition-colors"
              >
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </motion.button>
            </div>
          </div>
          
          <AnimatePresence>
            {isExpanded && task.description && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 text-sm text-surface-600 dark:text-surface-400 overflow-hidden"
              >
                <div className="p-3 bg-surface-50 dark:bg-surface-700/50 rounded-lg">
                  {task.description}
                </div>
                
                {task.completedAt && (
                  <div className="mt-2 text-xs text-surface-500 dark:text-surface-500">
                    Completed: {formatDate(task.completedAt)}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default MainFeature;