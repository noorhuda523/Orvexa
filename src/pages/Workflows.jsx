import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuPlay,
  LuClock3,
  LuZap,
  LuSparkles,
  LuPlus,
  LuDownload,
  LuUpload,
  LuZoomIn,
  LuZoomOut,
  LuMaximize2,
  LuUndo2,
  LuRedo2,
  LuBot,
  LuSettings,
  LuEllipsisVertical,
  LuCheck,
  LuCopy,
  LuTrash2,
  LuListOrdered,
  LuLayers,
  LuArrowLeft,
  LuList,
  LuLayoutGrid,
  LuActivity,
  LuSlidersHorizontal,
} from 'react-icons/lu';

import { Btn } from '../components/Button';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { newId, readWf, saveWf } from '../utils/storage';
import { seedWf } from '../data/demoData';
import '../styles/zynflowWorkflow.css';

export default function Workflows() {
  const toast = useToast();

  // Stored workflows
  const [workflows, setWorkflows] = useState(() => {
    const stored = readWf();
    return Array.isArray(stored) && stored.length > 0 ? stored : seedWf();
  });

  const [activeWfIndex, setActiveWfIndex] = useState(0);
  const [viewMode, setViewMode] = useState('editor'); // 'editor' (Zynflow Canvas) | 'list' (Management table)

  const currentWf = workflows[activeWfIndex] || workflows[0] || {
    id: 'wf-1',
    name: 'Hello Lazie',
    description: 'Autonomous webhook and customer alert pipeline',
  };

  // Editable workflow parameters matching Reference Image 1
  const [wfName, setWfName] = useState(currentWf.name || 'Hello Lazie');
  const [wfDesc, setWfDesc] = useState(currentWf.description || 'Add short description...');
  const [autoRun, setAutoRun] = useState(true);
  const [timeoutMs, setTimeoutMs] = useState('5000ms');
  const [retryAttempts, setRetryAttempts] = useState('1');
  const [stopOnError, setStopOnError] = useState(true);

  // Canvas zoom
  const [zoom, setZoom] = useState(1);

  // Trigger Node configuration state
  const [evaluateType, setEvaluateType] = useState('Once');
  const [scheduleType, setScheduleType] = useState('No');
  const [processingLevel, setProcessingLevel] = useState('Unlimited');

  // Branch Nodes configuration state
  const [leftActionTitle, setLeftActionTitle] = useState('Notify the owner');
  const [leftTemperature, setLeftTemperature] = useState('0.5');

  const [rightActionChannel, setRightActionChannel] = useState('Notify investors-channels');
  const [rightSystemMsg, setRightSystemMsg] = useState('Hello Lazie');

  // Simulation execution state
  const [isRunning, setIsRunning] = useState(false);
  const [activeNodeHighlight, setActiveNodeHighlight] = useState(null);

  // Sync state when active workflow changes
  useEffect(() => {
    if (currentWf) {
      setWfName(currentWf.name || 'Hello Lazie');
      setWfDesc(currentWf.description || 'Add short description...');
    }
  }, [currentWf]);

  const handleSave = () => {
    const updated = workflows.map((w, idx) => {
      if (idx === activeWfIndex) {
        return {
          ...w,
          name: wfName,
          description: wfDesc,
          updatedAt: Date.now(),
        };
      }
      return w;
    });
    setWorkflows(updated);
    saveWf(updated);
    toast('Workflow published & saved successfully!', 'ok');
  };

  const handleRunSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    toast('Executing workflow pipeline…');
    setActiveNodeHighlight('trigger');

    setTimeout(() => {
      setActiveNodeHighlight('left-action');
      setTimeout(() => {
        setActiveNodeHighlight('right-action');
        setTimeout(() => {
          setActiveNodeHighlight(null);
          setIsRunning(false);
          toast('Workflow run completed with 100% success rate!', 'ok');
        }, 600);
      }, 600);
    }, 600);
  };

  return (
    <div className="zyn-builder-page">
      {/* ─── 1. Left Properties & Runtime Settings Sidebar (Matching Image 1) ─ */}
      <div className="zyn-sidebar">
        {/* Detail Information */}
        <div>
          <div className="zyn-section-title">
            <span>Detail Information</span>
            <span style={{ fontSize: '0.72rem', color: '#74758A' }}>Config</span>
          </div>

          <div className="zyn-field-group">
            <div>
              <span className="zyn-field-label">Name</span>
              <input
                type="text"
                className="zyn-input"
                value={wfName}
                onChange={(e) => setWfName(e.target.value)}
                placeholder="Workflow name..."
              />
            </div>

            <div>
              <span className="zyn-field-label">Description</span>
              <textarea
                rows={2}
                className="zyn-textarea"
                value={wfDesc}
                onChange={(e) => setWfDesc(e.target.value)}
                placeholder="Add short description..."
              />
            </div>
          </div>
        </div>

        {/* Runtime Settings */}
        <div>
          <div className="zyn-section-title">
            <span>Runtime Settings</span>
          </div>

          <div className="zyn-field-group">
            <div className="zyn-toggle-row">
              <span>Auto-run on trigger</span>
              <button
                type="button"
                className={`zyn-toggle-btn ${autoRun ? 'on' : ''}`}
                onClick={() => setAutoRun(!autoRun)}
              >
                {autoRun ? 'On' : 'Off'}
              </button>
            </div>

            <div className="zyn-toggle-row">
              <span className="zyn-field-label">Timeout</span>
              <input
                type="text"
                className="zyn-input"
                style={{ width: 90, textAlign: 'right', padding: '4px 8px' }}
                value={timeoutMs}
                onChange={(e) => setTimeoutMs(e.target.value)}
              />
            </div>

            <div className="zyn-toggle-row">
              <span className="zyn-field-label">Retry attempts</span>
              <input
                type="number"
                className="zyn-input"
                style={{ width: 60, textAlign: 'right', padding: '4px 8px' }}
                value={retryAttempts}
                onChange={(e) => setRetryAttempts(e.target.value)}
              />
            </div>

            <div className="zyn-toggle-row">
              <span>Stop on error</span>
              <button
                type="button"
                className={`zyn-toggle-btn ${stopOnError ? 'on' : ''}`}
                onClick={() => setStopOnError(!stopOnError)}
              >
                {stopOnError ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        </div>

        {/* Actions Quick Tool List */}
        <div>
          <div className="zyn-section-title">
            <span>Actions</span>
          </div>

          <div className="zyn-action-list">
            <button
              type="button"
              className="zyn-action-row"
              onClick={() => toast('AI Assistant optimizing sequence…')}
            >
              <span>AI Assist</span>
              <span className="zyn-action-badge">9</span>
            </button>
            <button
              type="button"
              className="zyn-action-row"
              onClick={() => toast('Sequence re-ordering active.')}
            >
              <span>Edit Sequence</span>
              <LuListOrdered size={14} color="#74758A" />
            </button>
            <button
              type="button"
              className="zyn-action-row"
              onClick={() => toast('Assign task dispatched.')}
            >
              <span>Assign Task</span>
              <LuPlus size={14} color="#74758A" />
            </button>
          </div>
        </div>

        {/* AI Agents Workflow Nodes */}
        <div>
          <div className="zyn-section-title">
            <span>AI AGENTS (AUTONOMOUS)</span>
          </div>

          <div className="zyn-action-list">
            <button
              type="button"
              className="zyn-action-row"
              onClick={() => toast('AI Agent node attached: Orvexa Workflow Assistant')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <LuSparkles size={13} color="#7047EB" />
                <span>Workflow Agent</span>
              </div>
              <span className="zyn-action-badge" style={{ backgroundColor: '#EDE7FF', color: '#7047EB' }}>PRO</span>
            </button>
            <button
              type="button"
              className="zyn-action-row"
              onClick={() => toast('AI Agent node attached: Summarize & Extract')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <LuBot size={13} color="#16B890" />
                <span>AI Summarizer</span>
              </div>
              <span className="zyn-action-badge" style={{ backgroundColor: '#ECFDF5', color: '#16B890' }}>NEW</span>
            </button>
            <button
              type="button"
              className="zyn-action-row"
              onClick={() => toast('AI Agent node attached: Task Dispatcher')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <LuSparkles size={13} color="#F4AD4E" />
                <span>Task Dispatcher</span>
              </div>
              <span className="zyn-action-badge" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>AUTO</span>
            </button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div>
          <div className="zyn-section-title">
            <span>Performance</span>
          </div>

          <div className="zyn-perf-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span style={{ color: '#74758A' }}>Success Rate</span>
              <strong style={{ color: '#16B890' }}>98%</strong>
            </div>

            <div className="zyn-progress-bar-wrap">
              <div className="zyn-progress-bar-fill" style={{ width: '98%' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span style={{ color: '#74758A' }}>Response Time</span>
              <strong>1.4s</strong>
            </div>

            <div className="zyn-perf-metrics-grid">
              <div>
                <div className="zyn-perf-metric-val">320</div>
                <div className="zyn-perf-metric-lbl">Query Processed</div>
              </div>
              <div>
                <div className="zyn-perf-metric-val">99.2%</div>
                <div className="zyn-perf-metric-lbl">Accuracy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Card matching Reference Image 1 */}
        <div className="zyn-upgrade-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <LuSparkles size={15} />
            </div>
            <strong style={{ fontSize: '0.84rem' }}>Orvexa Pro</strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.76rem', lineHeight: 1.4, opacity: 0.9 }}>
            Pro gives you faster workflows and higher execution limits.
          </p>
          <button
            type="button"
            className="zyn-upgrade-btn"
            onClick={() => toast('Workspace upgraded to Pro tier!')}
          >
            Upgrade Pro
          </button>
        </div>
      </div>

      {/* ─── 2. Main Visual Tree Canvas (Matching Image 1) ────────────────── */}
      <div className="zyn-canvas-wrap">
        {/* Top Canvas Bar */}
        <div className="zyn-canvas-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2 className="zyn-topbar-title">{wfName}</h2>
            <span style={{
              fontSize: '0.74rem',
              padding: '3px 8px',
              borderRadius: 6,
              background: '#E8F8F4',
              color: '#16B890',
              fontWeight: 700,
            }}>
              Live Active
            </span>
          </div>

          <div className="zyn-topbar-actions">
            <button
              type="button"
              className="zyn-btn-action"
              onClick={() => toast('Workflow template exported to JSON')}
              title="Download Workflow"
            >
              <LuDownload size={14} />
              <span>Download</span>
            </button>
            <button
              type="button"
              className="zyn-btn-action"
              onClick={() => toast('Importing workflow payload…')}
              title="Upload Workflow"
            >
              <LuUpload size={14} />
              <span>Upload</span>
            </button>
            <button
              type="button"
              className="zyn-btn-publish"
              onClick={handleRunSimulation}
              disabled={isRunning}
            >
              {isRunning ? 'Running…' : 'Publish / Run'}
            </button>
          </div>
        </div>

        {/* Visual Workflow Canvas Viewport */}
        <div className="zyn-canvas-viewport">
          <div style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}>
            {/* ── Top Root Trigger Node ── */}
            <motion.div
              className="zyn-node-card"
              style={{
                borderColor: activeNodeHighlight === 'trigger' ? '#7047EB' : '#E9E8F1',
                boxShadow: activeNodeHighlight === 'trigger' ? '0 0 0 4px rgba(112, 71, 235, 0.18)' : undefined,
              }}
              whileHover={{ y: -2 }}
            >
              <div className="zyn-node-header">
                <div className="zyn-node-header-left">
                  <div className="zyn-node-icon-pill">
                    <LuPlay size={14} />
                  </div>
                  <span className="zyn-node-title">Trigger</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="zyn-node-tag">DATA</span>
                  <button className="zyn-float-btn" style={{ padding: 2 }} onClick={() => toast('Trigger settings')}>
                    <LuSettings size={13} />
                  </button>
                </div>
              </div>

              <p className="zyn-node-text">
                Record ID in Companies updated
              </p>

              <div className="zyn-node-row">
                <span>Evaluate:</span>
                <select
                  className="zyn-node-select"
                  value={evaluateType}
                  onChange={(e) => setEvaluateType(e.target.value)}
                >
                  <option value="Once">Once</option>
                  <option value="Recurring">Recurring</option>
                  <option value="Continuous">Continuous</option>
                </select>
              </div>

              <div className="zyn-node-row">
                <span>Schedule:</span>
                <select
                  className="zyn-node-select"
                  value={scheduleType}
                  onChange={(e) => setScheduleType(e.target.value)}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes (Cron)</option>
                </select>
              </div>

              <div className="zyn-node-row">
                <span>Processing Level:</span>
                <select
                  className="zyn-node-select"
                  value={processingLevel}
                  onChange={(e) => setProcessingLevel(e.target.value)}
                >
                  <option value="Unlimited">Unlimited</option>
                  <option value="Standard">Standard</option>
                  <option value="Throttle">Throttle</option>
                </select>
              </div>
            </motion.div>

            {/* ── Branching Tree Lines & Connectors ── */}
            <div className="zyn-branch-tree">
              {/* Vertical stem down */}
              <div className="zyn-stem-line" />

              {/* Horizontal Crossbar for forking */}
              <div className="zyn-branch-fork">
                <div className="zyn-fork-crossbar" />

                {/* Left Branch: If False */}
                <div className="zyn-branch-col">
                  <div className="zyn-stem-line" style={{ height: 20 }} />
                  <span className="zyn-condition-pill">If false</span>

                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#F1F0FA',
                    color: '#7047EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                  }}>
                    #
                  </div>

                  {/* Left Action Node: Send Alert */}
                  <motion.div
                    className="zyn-node-card"
                    style={{
                      borderColor: activeNodeHighlight === 'left-action' ? '#7047EB' : '#E9E8F1',
                      boxShadow: activeNodeHighlight === 'left-action' ? '0 0 0 4px rgba(112, 71, 235, 0.18)' : undefined,
                    }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="zyn-node-header">
                      <div className="zyn-node-header-left">
                        <div className="zyn-node-icon-pill">
                          <LuZap size={14} />
                        </div>
                        <span className="zyn-node-title">Action</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="zyn-node-tag">DATA</span>
                        <button className="zyn-float-btn" style={{ padding: 2 }}>
                          <LuEllipsisVertical size={13} />
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#19182B' }}>
                      Send alert
                    </div>

                    <div className="zyn-node-row">
                      <span>Notify:</span>
                      <select
                        className="zyn-node-select"
                        value={leftActionTitle}
                        onChange={(e) => setLeftActionTitle(e.target.value)}
                      >
                        <option value="Notify the owner">Notify the owner</option>
                        <option value="Notify engineering">Notify engineering</option>
                      </select>
                    </div>

                    <div className="zyn-node-row">
                      <span>Temperature:</span>
                      <input
                        type="text"
                        className="zyn-input"
                        style={{ width: 60, padding: '3px 6px', textAlign: 'center' }}
                        value={leftTemperature}
                        onChange={(e) => setLeftTemperature(e.target.value)}
                      />
                    </div>
                  </motion.div>

                  <button
                    type="button"
                    className="zyn-plus-circle-btn"
                    onClick={() => toast('Added action step to branch.')}
                    title="Add Node"
                  >
                    <LuPlus size={16} />
                  </button>
                </div>

                {/* Right Branch: If True */}
                <div className="zyn-branch-col">
                  <div className="zyn-stem-line" style={{ height: 20 }} />
                  <span className="zyn-condition-pill true">If true</span>

                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#7047EB',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                  }}>
                    <LuSparkles size={16} />
                  </div>

                  {/* Right Action Node: Auto Post */}
                  <motion.div
                    className="zyn-node-card"
                    style={{
                      borderColor: activeNodeHighlight === 'right-action' ? '#7047EB' : '#E9E8F1',
                      boxShadow: activeNodeHighlight === 'right-action' ? '0 0 0 4px rgba(112, 71, 235, 0.18)' : undefined,
                    }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="zyn-node-header">
                      <div className="zyn-node-header-left">
                        <div className="zyn-node-icon-pill">
                          <LuZap size={14} />
                        </div>
                        <span className="zyn-node-title">Action</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="zyn-node-tag">DATA</span>
                        <button className="zyn-float-btn" style={{ padding: 2 }}>
                          <LuEllipsisVertical size={13} />
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#19182B' }}>
                      Auto post
                    </div>

                    <div className="zyn-node-row">
                      <span>Channel:</span>
                      <select
                        className="zyn-node-select"
                        value={rightActionChannel}
                        onChange={(e) => setRightActionChannel(e.target.value)}
                      >
                        <option value="Notify investors-channels">investors-channels</option>
                        <option value="ops-alerts">ops-alerts</option>
                      </select>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.74rem', color: '#74758A', display: 'block', marginBottom: 4 }}>
                        System message:
                      </span>
                      <input
                        type="text"
                        className="zyn-input"
                        value={rightSystemMsg}
                        onChange={(e) => setRightSystemMsg(e.target.value)}
                      />
                    </div>
                  </motion.div>

                  <button
                    type="button"
                    className="zyn-plus-circle-btn"
                    onClick={() => toast('Added action step to branch.')}
                    title="Add Node"
                  >
                    <LuPlus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Floating Bottom Canvas Toolbar (Matching Image 1) ───────────── */}
        <div className="zyn-bottom-floating-bar">
          <button
            type="button"
            className="zyn-float-btn"
            onClick={() => setZoom(z => Math.max(z - 0.15, 0.6))}
            title="Zoom out"
          >
            <LuZoomOut size={14} />
          </button>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#19182B', minWidth: 44, textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            className="zyn-float-btn"
            onClick={() => setZoom(z => Math.min(z + 0.15, 1.5))}
            title="Zoom in"
          >
            <LuZoomIn size={14} />
          </button>
          <div style={{ width: 1, height: 16, background: '#E9E8F1' }} />
          <button
            type="button"
            className="zyn-float-btn"
            onClick={() => setZoom(1)}
            title="Fit to Screen"
          >
            <LuMaximize2 size={14} />
          </button>
          <button
            type="button"
            className="zyn-float-btn"
            onClick={() => toast('Undo action')}
            title="Undo"
          >
            <LuUndo2 size={14} />
          </button>
          <div style={{ width: 1, height: 16, background: '#E9E8F1' }} />
          <button
            type="button"
            className="zyn-btn-ask-ai"
            onClick={() => toast('AI Assistant inspecting workflow structure…')}
          >
            <LuBot size={13} />
            <span>Ask AI</span>
          </button>
        </div>
      </div>
    </div>
  );
}
