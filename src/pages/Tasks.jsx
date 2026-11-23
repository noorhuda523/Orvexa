import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuPlus,
  LuLayoutGrid,
  LuList,
  LuCalendar,
  LuFilter,
  LuArrowUpDown,
  LuEllipsis,
  LuFlag,
  LuPaperclip,
  LuMessageSquare,
  LuCheck,
  LuTrash2,
  LuPencil,
  LuSearch,
  LuX,
  LuGlobe,
  LuLayers,
} from 'react-icons/lu';

import { Btn } from '../components/Button';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { addDays, daysTo, fmtDay, isoOf } from '../utils/dates';
import { newId, readTasks, saveTasks } from '../utils/storage';
import '../styles/organixTasks.css';

/* ─── Mock Visual Avatars ────────────────────────────────────────────────── */
const TEAM_AVATARS = [
  { id: '1', initials: 'NK', bg: '#EDE7FF', color: '#7047EB' },
  { id: '2', initials: 'JD', bg: '#E8F8F4', color: '#16B890' },
  { id: '3', initials: 'AL', bg: '#FEF4E8', color: '#F4AD4E' },
];

/* ─── Task Form Modal Component ──────────────────────────────────────────── */
export function TaskForm({ task, onSave, onClose }) {
  const isEdit = !!(task && task.id);
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [category, setCategory] = useState(task?.category || 'Design');
  const [priority, setPriority] = useState(task?.pri || task?.priority || 'Med');
  const [status, setStatus] = useState(task?.status || 'todo');
  const [due, setDue] = useState(task?.due || isoOf(addDays(3)));
  const [hasBanner, setHasBanner] = useState(task?.hasBanner || false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrors({ title: 'Task title is required.' });
      return;
    }
    onSave({
      ...(task || {}),
      title: title.trim(),
      description: description.trim(),
      category,
      pri: priority,
      priority,
      status,
      due,
      hasBanner,
      attachmentsCount: task?.attachmentsCount || Math.floor(Math.random() * 8 + 3),
      commentsCount: task?.commentsCount || Math.floor(Math.random() * 14 + 5),
      updatedAt: Date.now(),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19182B', display: 'block', marginBottom: 6 }}>
          Task Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setErrors({}); }}
          placeholder="e.g. Customer Journey Mapping"
          className="organix-tool-btn"
          style={{ width: '100%', padding: '9px 12px', fontSize: '0.9rem' }}
          autoFocus
        />
        {errors.title && <span style={{ color: '#EF6474', fontSize: '0.78rem' }}>{errors.title}</span>}
      </div>

      <div>
        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19182B', display: 'block', marginBottom: 6 }}>
          Description
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short task description..."
          className="organix-tool-btn"
          style={{ width: '100%', padding: '9px 12px', fontSize: '0.86rem', resize: 'vertical' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19182B', display: 'block', marginBottom: 6 }}>
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="organix-tool-btn"
            style={{ width: '100%' }}
          >
            <option value="Design">Design</option>
            <option value="Development">Development</option>
            <option value="3D Modeling">3D Modeling</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19182B', display: 'block', marginBottom: 6 }}>
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="organix-tool-btn"
            style={{ width: '100%' }}
          >
            <option value="High">High Priority</option>
            <option value="Med">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19182B', display: 'block', marginBottom: 6 }}>
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="organix-tool-btn"
            style={{ width: '100%' }}
          >
            <option value="todo">To - Do</option>
            <option value="doing">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19182B', display: 'block', marginBottom: 6 }}>
            Due Date
          </label>
          <input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="organix-tool-btn"
            style={{ width: '100%', padding: '7px 12px' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <input
          type="checkbox"
          id="banner-cb"
          checked={hasBanner}
          onChange={(e) => setHasBanner(e.target.checked)}
        />
        <label htmlFor="banner-cb" style={{ fontSize: '0.82rem', color: '#74758A', cursor: 'pointer' }}>
          Highlight card with visual showcase illustration
        </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
        <Btn v="sec" onClick={onClose}>Cancel</Btn>
        <Btn type="submit">{isEdit ? 'Save Changes' : 'Create Task'}</Btn>
      </div>
    </form>
  );
}

/* ─── Organix Kanban Card Component (Matching Reference Image 2) ─────────── */
function OrganixCard({ task, onEdit, onDelete, onStatusChange, onDragStart }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const getTagClass = (cat = '') => {
    const c = cat.toLowerCase();
    if (c.includes('development')) return 'development';
    if (c.includes('modeling') || c.includes('3d')) return 'modeling';
    if (c.includes('marketing')) return 'marketing';
    return 'design';
  };

  const priClass = (task.pri || task.priority || 'Med').toLowerCase();

  return (
    <motion.div
      className="organix-card"
      layout
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18 }}
    >
      {/* Top Row: Category Tag + Ellipsis Menu */}
      <div className="organix-card-top">
        <span className={`organix-tag ${getTagClass(task.category)}`}>
          {task.category || 'Design'}
        </span>

        <div style={{ position: 'relative' }}>
          <button
            className="organix-card-menu"
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            title="Options"
          >
            <LuEllipsis size={16} />
          </button>

          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: 4,
                width: 140,
                background: '#FFFFFF',
                border: '1px solid #E9E8F1',
                borderRadius: 8,
                padding: 4,
                boxShadow: '0 8px 20px rgba(25, 24, 43, 0.12)',
                zIndex: 30,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="organix-tool-btn"
                style={{ border: 'none', justifyContent: 'flex-start', width: '100%', padding: '6px 8px' }}
                onClick={() => { setMenuOpen(false); onEdit(task); }}
              >
                <LuPencil size={12} />
                <span>Edit</span>
              </button>
              <button
                className="organix-tool-btn"
                style={{ border: 'none', justifyContent: 'flex-start', width: '100%', padding: '6px 8px', color: '#EF6474' }}
                onClick={() => { setMenuOpen(false); onDelete(task); }}
              >
                <LuTrash2 size={12} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Featured Visual Illustration (Like Customer Journey Mapping card) */}
      {(task.hasBanner || task.title?.includes('Customer Journey')) && (
        <div className="organix-card-banner">
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #38BDF8 20%, #0284C7 80%)',
              margin: '0 auto',
              boxShadow: '0 8px 18px rgba(2, 132, 199, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <LuGlobe size={28} />
            </div>
          </div>
        </div>
      )}

      {/* Card Title & Description */}
      <div>
        <h4 className="organix-card-title">{task.title}</h4>
        {task.description && (
          <p className="organix-card-desc">{task.description}</p>
        )}
      </div>

      {/* Metadata Row: Priority Badge + Due Date */}
      <div className="organix-card-meta">
        <span className={`organix-pri-pill ${priClass}`}>
          <LuFlag size={10} />
          <span>{task.pri === 'Med' ? 'Medium' : task.pri || 'Medium'}</span>
        </span>

        <span className="organix-due-date">
          <LuCalendar size={12} />
          <span>{fmtDay(task.due)}</span>
        </span>
      </div>

      {/* Card Footer: Assignee Avatars & Attachment / Comment Counters */}
      <div className="organix-card-footer">
        <div className="organix-avatar-group">
          {TEAM_AVATARS.map((av) => (
            <div
              key={av.id}
              className="organix-avatar"
              style={{ background: av.bg, color: av.color }}
              title={`Team Member ${av.initials}`}
            >
              {av.initials}
            </div>
          ))}
        </div>

        <div className="organix-card-stats">
          <span className="organix-stat-item" title="Attachments">
            <LuPaperclip size={12} />
            <span>{task.attachmentsCount || 16}</span>
          </span>
          <span className="organix-stat-item" title="Comments">
            <LuMessageSquare size={12} />
            <span>{task.commentsCount || 31}</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Organix Tasks Component ───────────────────────────────────────── */
export default function Tasks() {
  const toast = useToast();

  // State
  const [tasks, setTasks] = useState(() => {
    const stored = readTasks();
    if (Array.isArray(stored) && stored.length > 0) return stored;
    // Initial rich mock set matching reference image
    return [
      {
        id: 'tk-1',
        title: 'Customer Journey Mapping',
        description: 'Analyzing touchpoints and user workflows across the onboarding lifecycle.',
        category: 'Design',
        pri: 'Med',
        status: 'todo',
        due: '2026-10-28',
        hasBanner: true,
        attachmentsCount: 16,
        commentsCount: 31,
      },
      {
        id: 'tk-2',
        title: 'Database Customization',
        description: "Customizing the database for User's internal system, focusing on micro interactions.",
        category: 'Development',
        pri: 'Med',
        status: 'doing',
        due: '2026-10-21',
        attachmentsCount: 10,
        commentsCount: 8,
      },
      {
        id: 'tk-3',
        title: 'Redesign WordPress Website',
        description: 'Redesigning the website for Design Lab to enhance usability and visual appeal.',
        category: 'Design',
        pri: 'High',
        status: 'done',
        due: '2026-10-17',
        attachmentsCount: 3,
        commentsCount: 20,
      },
      {
        id: 'tk-4',
        title: 'UI Component Modification',
        description: 'Micro interactions, loading states, and responsive adjustments across cards.',
        category: 'Design',
        pri: 'Med',
        status: 'todo',
        due: '2026-10-28',
        attachmentsCount: 23,
        commentsCount: 32,
      },
      {
        id: 'tk-5',
        title: 'Fix Interior Planning',
        description: 'Addressing layout and functional issues in the 3D modeling of interior spaces.',
        category: '3D Modeling',
        pri: 'Low',
        status: 'doing',
        due: '2026-10-13',
        attachmentsCount: 14,
        commentsCount: 9,
      },
      {
        id: 'tk-6',
        title: 'Facebook Ads Campaign',
        description: 'Launching Q4 paid growth campaigns across targeted developer demographics.',
        category: 'Marketing',
        pri: 'Med',
        status: 'done',
        due: '2026-10-30',
        attachmentsCount: 8,
        commentsCount: 17,
      },
    ];
  });

  const [activeTab, setActiveTab] = useState('board'); // 'board' | 'table' | 'calendar'
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [editTask, setEditTask] = useState(null); // null = closed, {} = new, obj = edit
  const [draggedTask, setDraggedTask] = useState(null);

  const persist = (next, msg = '') => {
    setTasks(next);
    saveTasks(next);
    if (msg) toast(msg);
  };

  const handleSave = (task) => {
    if (task.id) {
      const next = tasks.map((t) => (t.id === task.id ? task : t));
      persist(next, 'Task updated successfully');
    } else {
      const created = { ...task, id: newId() };
      persist([created, ...tasks], 'Task created successfully');
    }
    setEditTask(null);
  };

  const handleDelete = (task) => {
    const next = tasks.filter((t) => t.id !== task.id);
    persist(next, `"${task.title}" deleted`);
  };

  const handleStatusChange = (task, newStatus) => {
    const next = tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t));
    persist(next, `Moved to ${newStatus === 'todo' ? 'To - Do' : newStatus === 'doing' ? 'In Progress' : 'Done'}`);
  };

  // Drag and Drop
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== targetStatus) {
      handleStatusChange(draggedTask, targetStatus);
    }
    setDraggedTask(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (filterCategory !== 'All' && (t.category || '').toLowerCase() !== filterCategory.toLowerCase()) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = (t.title || '').toLowerCase().includes(q);
          const matchDesc = (t.description || '').toLowerCase().includes(q);
          if (!matchTitle && !matchDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'Priority') {
          const rank = { High: 0, Med: 1, Low: 2 };
          return (rank[a.pri] || 1) - (rank[b.pri] || 1);
        }
        return (b.updatedAt || 0) - (a.updatedAt || 0);
      });
  }, [tasks, filterCategory, searchQuery, sortBy]);

  const todoList = filteredTasks.filter((t) => t.status === 'todo');
  const doingList = filteredTasks.filter((t) => t.status === 'doing');
  const doneList = filteredTasks.filter((t) => t.status === 'done');

  return (
    <div className="pg apppg organix-tasks-page">
      {/* ─── Top Header (Matching Image 2) ─────────────────────────────────── */}
      <div className="organix-header">
        <h1 className="organix-title">Tasks</h1>

        <div className="organix-header-right">
          <button className="organix-btn-add" onClick={() => setEditTask({})}>
            <LuPlus size={16} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* ─── View Switcher Tabs & Tools Toolbar ────────────────────────────── */}
      <div className="organix-toolbar">
        {/* Left: View Tabs (Board, Table, Calendar) */}
        <div className="organix-view-tabs">
          <button
            className={`organix-tab-btn ${activeTab === 'board' ? 'active' : ''}`}
            onClick={() => setActiveTab('board')}
          >
            <LuLayoutGrid size={15} />
            <span>Board</span>
          </button>
          <button
            className={`organix-tab-btn ${activeTab === 'table' ? 'active' : ''}`}
            onClick={() => setActiveTab('table')}
          >
            <LuList size={15} />
            <span>Table</span>
          </button>
          <button
            className={`organix-tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <LuCalendar size={15} />
            <span>Calendar</span>
          </button>
        </div>

        {/* Right: Search, Filter & Sort */}
        <div className="organix-toolbar-tools">
          {/* Quick Search */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <LuSearch size={14} style={{ position: 'absolute', left: 10, color: '#74758A' }} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="organix-tool-btn"
              style={{ paddingLeft: 30, width: 170 }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: 8, background: 'none', border: 'none', color: '#74758A', cursor: 'pointer' }}
              >
                <LuX size={12} />
              </button>
            )}
          </div>

          {/* Filter dropdown */}
          <select
            className="organix-tool-btn"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Design">Design</option>
            <option value="Development">Development</option>
            <option value="3D Modeling">3D Modeling</option>
            <option value="Marketing">Marketing</option>
          </select>

          {/* Sort dropdown */}
          <select
            className="organix-tool-btn"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="Newest">Sort: Newest</option>
            <option value="Priority">Sort: Priority</option>
          </select>
        </div>
      </div>

      {/* ─── View 1: Kanban Board View (Exact Match to Image 2) ───────────── */}
      {activeTab === 'board' && (
        <div className="organix-board-grid">
          {/* Column 1: To - Do */}
          <div
            className="organix-col"
            onDrop={(e) => handleDrop(e, 'todo')}
            onDragOver={handleDragOver}
          >
            <div className="organix-col-header todo">
              <div className="organix-col-header-left">
                <span>To - Do</span>
                <span className="organix-badge-count">{todoList.length}</span>
              </div>
              <button
                className="organix-col-add-btn"
                onClick={() => setEditTask({ status: 'todo' })}
                title="Add task to To - Do"
              >
                <LuPlus size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <AnimatePresence>
                {todoList.map((t) => (
                  <OrganixCard
                    key={t.id}
                    task={t}
                    onEdit={setEditTask}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                    onDragStart={handleDragStart}
                  />
                ))}
              </AnimatePresence>
              {todoList.length === 0 && (
                <div style={{ padding: '24px 12px', textAlign: 'center', color: '#74758A', fontSize: '0.82rem' }}>
                  No tasks in To - Do. Drag cards here.
                </div>
              )}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div
            className="organix-col"
            onDrop={(e) => handleDrop(e, 'doing')}
            onDragOver={handleDragOver}
          >
            <div className="organix-col-header doing">
              <div className="organix-col-header-left">
                <span>In Progress</span>
                <span className="organix-badge-count">{doingList.length}</span>
              </div>
              <button
                className="organix-col-add-btn"
                onClick={() => setEditTask({ status: 'doing' })}
                title="Add task to In Progress"
              >
                <LuPlus size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <AnimatePresence>
                {doingList.map((t) => (
                  <OrganixCard
                    key={t.id}
                    task={t}
                    onEdit={setEditTask}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                    onDragStart={handleDragStart}
                  />
                ))}
              </AnimatePresence>
              {doingList.length === 0 && (
                <div style={{ padding: '24px 12px', textAlign: 'center', color: '#74758A', fontSize: '0.82rem' }}>
                  No tasks in In Progress. Drag cards here.
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Done */}
          <div
            className="organix-col"
            onDrop={(e) => handleDrop(e, 'done')}
            onDragOver={handleDragOver}
          >
            <div className="organix-col-header done">
              <div className="organix-col-header-left">
                <span>Done</span>
                <span className="organix-badge-count">{doneList.length}</span>
              </div>
              <button
                className="organix-col-add-btn"
                onClick={() => setEditTask({ status: 'done' })}
                title="Add task to Done"
              >
                <LuPlus size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <AnimatePresence>
                {doneList.map((t) => (
                  <OrganixCard
                    key={t.id}
                    task={t}
                    onEdit={setEditTask}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                    onDragStart={handleDragStart}
                  />
                ))}
              </AnimatePresence>
              {doneList.length === 0 && (
                <div style={{ padding: '24px 12px', textAlign: 'center', color: '#74758A', fontSize: '0.82rem' }}>
                  No tasks completed yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── View 2: High-Density Table List View ──────────────────────────── */}
      {activeTab === 'table' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E9E8F1', borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: '#F8F9FC', borderBottom: '1px solid #E9E8F1', color: '#74758A' }}>
                <th style={{ padding: '12px 18px' }}>Task Name</th>
                <th style={{ padding: '12px 18px' }}>Category</th>
                <th style={{ padding: '12px 18px' }}>Priority</th>
                <th style={{ padding: '12px 18px' }}>Due Date</th>
                <th style={{ padding: '12px 18px' }}>Status</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #F1F0FA' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 600, color: '#19182B' }}>{t.title}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span className="organix-tag design">{t.category || 'Design'}</span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span className={`organix-pri-pill ${(t.pri || 'Med').toLowerCase()}`}>
                      {t.pri || 'Medium'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', color: '#74758A' }}>{fmtDay(t.due)}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <select
                      className="organix-tool-btn"
                      value={t.status}
                      onChange={(e) => handleStatusChange(t, e.target.value)}
                    >
                      <option value="todo">To - Do</option>
                      <option value="doing">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <button className="organix-tool-btn" onClick={() => setEditTask(t)} style={{ marginRight: 6 }}>
                      Edit
                    </button>
                    <button className="organix-tool-btn" onClick={() => handleDelete(t)} style={{ color: '#EF6474' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── View 3: Calendar View ────────────────────────────────────────── */}
      {activeTab === 'calendar' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E9E8F1', borderRadius: 14, padding: 24, textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '1.1rem' }}>Task Schedule & Delivery Deadlines</h3>
          <p style={{ color: '#74758A', fontSize: '0.86rem', marginBottom: 20 }}>
            Visual calendar representation of upcoming task sprint deadlines.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} style={{ padding: 8, fontWeight: 700, fontSize: '0.78rem', color: '#74758A' }}>
                {day}
              </div>
            ))}
            {Array.from({ length: 28 }).map((_, i) => {
              const dayNum = i + 1;
              const matches = tasks.filter((t) => t.due && parseInt(t.due.split('-')[2], 10) === dayNum);
              return (
                <div
                  key={i}
                  style={{
                    minHeight: 80,
                    border: '1px solid #F1F0FA',
                    borderRadius: 8,
                    padding: 6,
                    textAlign: 'left',
                    background: matches.length > 0 ? '#F8F9FC' : 'transparent',
                  }}
                >
                  <span style={{ fontSize: '0.74rem', color: '#74758A', fontWeight: 600 }}>{dayNum}</span>
                  {matches.slice(0, 2).map((m) => (
                    <div
                      key={m.id}
                      style={{
                        background: '#EDE7FF',
                        color: '#7047EB',
                        fontSize: '0.68rem',
                        padding: '2px 4px',
                        borderRadius: 4,
                        marginTop: 4,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={m.title}
                    >
                      {m.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Create / Edit Modal ───────────────────────────────────────────── */}
      {editTask !== null && (
        <Modal
          title={editTask.id ? 'Edit Task' : 'Add New Task'}
          onClose={() => setEditTask(null)}
        >
          <TaskForm task={editTask.id ? editTask : null} onSave={handleSave} onClose={() => setEditTask(null)} />
        </Modal>
      )}
    </div>
  );
}
