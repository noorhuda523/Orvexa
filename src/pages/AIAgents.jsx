import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuBot,
  LuSparkles,
  LuPlus,
  LuSearch,
  LuFilter,
  LuCpu,
  LuClock,
  LuCircleCheck,
  LuSlidersHorizontal,
} from 'react-icons/lu';
import AgentCard from '../components/ai/AgentCard';
import AgentStudioModal from '../components/ai/AgentStudioModal';
import ExecutionHistoryModal from '../components/ai/ExecutionHistoryModal';
import {
  readAgents,
  createAgent,
  updateAgent,
  deleteAgent,
  duplicateAgent,
  readExecutionHistory,
} from '../services/ai/agentService';

const CATEGORIES = [
  'All',
  'Workflow & Automation',
  'Task Management',
  'Content & Copy',
  'Data & Telemetry',
  'Productivity',
  'Customer Support',
];

export default function AIAgents() {
  const [agents, setAgents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [studioOpen, setStudioOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    setAgents(readAgents());
    const handler = () => setAgents(readAgents());
    window.addEventListener('nx-agents-updated', handler);
    return () => window.removeEventListener('nx-agents-updated', handler);
  }, []);

  const totalRuns = useMemo(() => {
    return agents.reduce((acc, curr) => acc + (curr.executionCount || 0), 0);
  }, [agents]);

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchCat = selectedCategory === 'All' || agent.category === selectedCategory;
      const matchSearch =
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [agents, selectedCategory, searchQuery]);

  const handleCreateNew = () => {
    setEditingAgent(null);
    setStudioOpen(true);
  };

  const handleConfigure = (agent) => {
    setEditingAgent(agent);
    setStudioOpen(true);
  };

  const handleSaveAgent = (formData) => {
    if (editingAgent && editingAgent.id) {
      updateAgent(editingAgent.id, formData);
    } else {
      createAgent(formData);
    }
    setAgents(readAgents());
  };

  const handleDuplicate = (id) => {
    duplicateAgent(id);
    setAgents(readAgents());
  };

  const handleDelete = (id) => {
    deleteAgent(id);
    setAgents(readAgents());
  };

  return (
    <div className="nx-page-container" style={{ padding: '24px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Banner: Prototype Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderRadius: '10px',
          backgroundColor: '#EDE7FF',
          border: '1px solid #8B75F5',
          marginBottom: '24px',
          fontSize: '12px',
          color: '#19182B',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LuSparkles color="#7047EB" size={16} />
          <span>
            <strong>Orvexa AI Sandbox Prototype:</strong> Autonomous agents operate client-side with real-time workspace contextual awareness and instant simulated telemetry.
          </span>
        </div>
        <span
          style={{
            fontWeight: 600,
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '6px',
            backgroundColor: '#7047EB',
            color: '#FFFFFF',
          }}
        >
          FRONTEND DEMO
        </span>
      </div>

      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="nx-hero-heading" style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: '#19182B' }}>
              AI Agents Studio
            </h1>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                padding: '3px 9px',
                borderRadius: '12px',
                backgroundColor: '#EDE7FF',
                color: '#7047EB',
              }}
            >
              {agents.length} Agents
            </span>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '14px', color: '#74758A' }}>
            Create, configure, and orchestrate intelligent AI agents tailored for your workflows, tasks, and telemetry.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              border: '1px solid #E9E8F1',
              backgroundColor: '#FFFFFF',
              color: '#19182B',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 1px 3px rgba(25, 24, 43, 0.04)',
            }}
          >
            <LuClock size={14} color="#74758A" />
            Execution Logs
          </button>

          <button
            type="button"
            onClick={handleCreateNew}
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#7047EB',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(112, 71, 235, 0.25)',
            }}
          >
            <LuPlus size={16} />
            Create AI Agent
          </button>
        </div>
      </div>

      {/* Metric Cards Ribbon */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E9E8F1',
            boxShadow: '0 1px 4px rgba(25, 24, 43, 0.03)',
          }}
        >
          <div style={{ fontSize: '12px', color: '#74758A', fontWeight: 500 }}>Active Agents</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#19182B', marginTop: '4px' }}>
            {agents.filter((a) => a.status === 'active').length}
          </div>
          <div style={{ fontSize: '11px', color: '#16B890', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <LuCircleCheck size={12} />
            <span>Ready for autonomous trigger</span>
          </div>
        </div>

        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E9E8F1',
            boxShadow: '0 1px 4px rgba(25, 24, 43, 0.03)',
          }}
        >
          <div style={{ fontSize: '12px', color: '#74758A', fontWeight: 500 }}>Total Executions</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#7047EB', marginTop: '4px' }}>
            {totalRuns.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#74758A', marginTop: '4px' }}>
            Across workspace pipelines
          </div>
        </div>

        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E9E8F1',
            boxShadow: '0 1px 4px rgba(25, 24, 43, 0.03)',
          }}
        >
          <div style={{ fontSize: '12px', color: '#74758A', fontWeight: 500 }}>Average Execution Latency</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#19182B', marginTop: '4px' }}>
            248ms
          </div>
          <div style={{ fontSize: '11px', color: '#16B890', marginTop: '4px' }}>
            Instant client inference
          </div>
        </div>

        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E9E8F1',
            boxShadow: '0 1px 4px rgba(25, 24, 43, 0.03)',
          }}
        >
          <div style={{ fontSize: '12px', color: '#74758A', fontWeight: 500 }}>Task Completion Rate</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#16B890', marginTop: '4px' }}>
            99.6%
          </div>
          <div style={{ fontSize: '11px', color: '#74758A', marginTop: '4px' }}>
            Deterministic reliability
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          padding: '14px 18px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E9E8F1',
          marginBottom: '24px',
        }}
      >
        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: selectedCategory === cat ? 600 : 500,
                color: selectedCategory === cat ? '#7047EB' : '#74758A',
                backgroundColor: selectedCategory === cat ? '#EDE7FF' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#F8F9FC',
            border: '1px solid #E9E8F1',
            borderRadius: '8px',
            padding: '6px 12px',
            width: '260px',
          }}
        >
          <LuSearch size={14} color="#74758A" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '13px',
              color: '#19182B',
              width: '100%',
            }}
          />
        </div>
      </div>

      {/* Agents Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px',
        }}
      >
        <AnimatePresence>
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onConfigure={handleConfigure}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AgentStudioModal
        isOpen={studioOpen}
        onClose={() => setStudioOpen(false)}
        agent={editingAgent}
        onSave={handleSaveAgent}
      />

      <ExecutionHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </div>
  );
}
