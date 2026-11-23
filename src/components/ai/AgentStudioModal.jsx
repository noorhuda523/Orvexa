import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuX,
  LuSparkles,
  LuCheck,
  LuSlidersHorizontal,
  LuBookOpen,
  LuWrench,
  LuBot,
  LuWorkflow,
  LuListTodo,
  LuFileText,
  LuChartNoAxesCombined,
  LuTrendingUp,
  LuCircleHelp,
  LuPlus,
  LuTrash2,
  LuPlay,
} from 'react-icons/lu';

const AVAILABLE_ICONS = [
  { name: 'LuBot', label: 'General AI', comp: LuBot },
  { name: 'LuWorkflow', label: 'Workflow', comp: LuWorkflow },
  { name: 'LuListTodo', label: 'Tasks', comp: LuListTodo },
  { name: 'LuFileText', label: 'Content', comp: LuFileText },
  { name: 'LuChartNoAxesCombined', label: 'Analytics', comp: LuChartNoAxesCombined },
  { name: 'LuTrendingUp', label: 'Productivity', comp: LuTrendingUp },
  { name: 'LuCircleHelp', label: 'Support', comp: LuCircleHelp },
];

const AVAILABLE_COLORS = [
  '#7047EB', // Nexora Purple
  '#16B890', // Emerald Green
  '#EC4899', // Pink
  '#0284C7', // Sky Blue
  '#F4AD4E', // Amber
  '#8B75F5', // Soft Violet
  '#19182B', // Dark Obsidian
];

const AVAILABLE_CAPABILITIES = [
  'Workflow guidance & DAG design',
  'Trigger & condition validation',
  'Sprint backlog triage',
  'Due date & SLA risk tracking',
  'Email & memo drafting',
  'Technical specification writing',
  'Telemetry trend analysis',
  'Productivity index calculations',
  'Feature tutorials & guidance',
];

const AVAILABLE_ACTIONS = [
  'Suggest Workflow',
  'Validate Nodes',
  'Optimize Pipeline',
  'Create Task',
  'Reassign Task',
  'Generate Content',
  'Rewrite Copy',
  'Analyze Statistics',
  'Calculate ROI',
  'Recommend Focus Block',
];

export default function AgentStudioModal({
  isOpen,
  onClose,
  agent = null,
  onSave,
}) {
  const isEditing = Boolean(agent && agent.id);

  const [activeTab, setActiveTab] = useState('identity');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Workflow & Automation',
    icon: 'LuBot',
    color: '#7047EB',
    status: 'active',
    instructions: {
      role: '',
      personality: '',
      objective: '',
      responseStyle: '',
    },
    capabilities: [],
    behavior: {
      tone: 'Professional & Direct',
      creativity: 0.3,
      responseLength: 'Detailed',
      requireConfirmation: true,
    },
    knowledge: [],
    actions: [],
  });

  const [newKnowledgeItem, setNewKnowledgeItem] = useState('');
  const [testPrompt, setTestPrompt] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (agent) {
      setFormData({
        ...agent,
        instructions: {
          role: agent.instructions?.role || '',
          personality: agent.instructions?.personality || '',
          objective: agent.instructions?.objective || '',
          responseStyle: agent.instructions?.responseStyle || '',
        },
        capabilities: agent.capabilities || [],
        behavior: {
          tone: agent.behavior?.tone || 'Professional & Direct',
          creativity: agent.behavior?.creativity ?? 0.3,
          responseLength: agent.behavior?.responseLength || 'Detailed',
          requireConfirmation: agent.behavior?.requireConfirmation ?? true,
        },
        knowledge: agent.knowledge || [],
        actions: agent.actions || [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'Workflow & Automation',
        icon: 'LuBot',
        color: '#7047EB',
        status: 'active',
        instructions: {
          role: 'Operational Assistant',
          personality: 'Helpful, concise, and structured',
          objective: 'Assist team members with daily workspace operations',
          responseStyle: 'Markdown with actionable bullet points',
        },
        capabilities: ['Workflow guidance & DAG design', 'Sprint backlog triage'],
        behavior: {
          tone: 'Professional & Direct',
          creativity: 0.3,
          responseLength: 'Detailed',
          requireConfirmation: true,
        },
        knowledge: ['Orvexa Workspace Architecture Spec v2'],
        actions: ['Suggest Workflow', 'Create Task'],
      });
    }
    setActiveTab('identity');
    setTestPrompt('');
    setTestResponse('');
  }, [agent, isOpen]);

  if (!isOpen) return null;

  const handleAddKnowledge = (e) => {
    e.preventDefault();
    if (!newKnowledgeItem.trim()) return;
    setFormData((prev) => ({
      ...prev,
      knowledge: [...prev.knowledge, newKnowledgeItem.trim()],
    }));
    setNewKnowledgeItem('');
  };

  const handleRemoveKnowledge = (idx) => {
    setFormData((prev) => ({
      ...prev,
      knowledge: prev.knowledge.filter((_, i) => i !== idx),
    }));
  };

  const toggleCapability = (cap) => {
    setFormData((prev) => {
      const exists = prev.capabilities.includes(cap);
      return {
        ...prev,
        capabilities: exists
          ? prev.capabilities.filter((c) => c !== cap)
          : [...prev.capabilities, cap],
      };
    });
  };

  const toggleAction = (act) => {
    setFormData((prev) => {
      const exists = prev.actions.includes(act);
      return {
        ...prev,
        actions: exists
          ? prev.actions.filter((a) => a !== act)
          : [...prev.actions, act],
      };
    });
  };

  const handleTestSimulate = async () => {
    if (!testPrompt.trim()) return;
    setTesting(true);
    setTestResponse('');
    await new Promise((res) => setTimeout(res, 500));
    setTestResponse(
      `[${formData.name || 'AI Agent'} Simulation]\nRole: ${formData.instructions.role || 'Assistant'}\n\n` +
      `"I processed your query: '${testPrompt.trim()}'.\n` +
      `Based on my active capabilities (${formData.capabilities.slice(0, 2).join(', ') || 'General Analysis'}), ` +
      `I recommend reviewing sprint backlog velocity and validating webhook endpoint conditions."`
    );
    setTesting(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave?.(formData);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(25, 24, 43, 0.45)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 20px 48px rgba(25, 24, 43, 0.16)',
          border: '1px solid #E9E8F1',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E9E8F1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FC 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#EDE7FF',
                color: '#7047EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              <LuSparkles />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#19182B' }}>
                {isEditing ? 'Configure AI Agent' : 'Create Custom AI Agent'}
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#74758A' }}>
                Define instructions, parameters, capabilities, and autonomous workspace tools.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#74758A',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LuX size={18} />
          </button>
        </div>

        {/* Studio Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '10px 24px',
            borderBottom: '1px solid #E9E8F1',
            backgroundColor: '#F8F9FC',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'identity', label: '1. Identity' },
            { id: 'instructions', label: '2. Instructions' },
            { id: 'capabilities', label: '3. Capabilities & Knowledge' },
            { id: 'behavior', label: '4. Behavior & Guardrails' },
            { id: 'test', label: '5. Test & Actions' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? 600 : 500,
                color: activeTab === tab.id ? '#7047EB' : '#74758A',
                backgroundColor: activeTab === tab.id ? '#EDE7FF' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {/* TAB 1: IDENTITY */}
          {activeTab === 'identity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#19182B', marginBottom: '6px' }}>
                  Agent Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sprint Quality Guardian"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #E9E8F1',
                    fontSize: '14px',
                    color: '#19182B',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#19182B', marginBottom: '6px' }}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #E9E8F1',
                    fontSize: '14px',
                    color: '#19182B',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                  }}
                >
                  <option value="Workflow & Automation">Workflow & Automation</option>
                  <option value="Task Management">Task Management</option>
                  <option value="Content & Copy">Content & Copy</option>
                  <option value="Data & Telemetry">Data & Telemetry</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Customer Support">Customer Support</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#19182B', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe what this AI agent does and its operational focus..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #E9E8F1',
                    fontSize: '14px',
                    color: '#19182B',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Icon Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#19182B', marginBottom: '8px' }}>
                  Avatar Icon
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {AVAILABLE_ICONS.map((ic) => {
                    const Comp = ic.comp;
                    const selected = formData.icon === ic.name;
                    return (
                      <button
                        key={ic.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: ic.name })}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '10px',
                          border: selected ? '2px solid #7047EB' : '1px solid #E9E8F1',
                          backgroundColor: selected ? '#EDE7FF' : '#F8F9FC',
                          color: selected ? '#7047EB' : '#74758A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          cursor: 'pointer',
                        }}
                        title={ic.label}
                      >
                        <Comp />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Accent Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#19182B', marginBottom: '8px' }}>
                  Theme Accent Color
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {AVAILABLE_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c })}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: c,
                        border: formData.color === c ? '3px solid #19182B' : '2px solid #FFFFFF',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INSTRUCTIONS */}
          {activeTab === 'instructions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#19182B', marginBottom: '6px' }}>
                  System Role
                </label>
                <input
                  type="text"
                  placeholder="e.g., Senior Technical Architect & Incident Commander"
                  value={formData.instructions.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      instructions: { ...formData.instructions, role: e.target.value },
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #E9E8F1',
                    fontSize: '14px',
                    color: '#19182B',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#19182B', marginBottom: '6px' }}>
                  Personality & Tone
                </label>
                <input
                  type="text"
                  placeholder="e.g., Analytical, disciplined, calm under pressure, and encouraging"
                  value={formData.instructions.personality}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      instructions: { ...formData.instructions, personality: e.target.value },
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #E9E8F1',
                    fontSize: '14px',
                    color: '#19182B',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#19182B', marginBottom: '6px' }}>
                  Core Objective
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g., Identify code review risks, triage inbound PRs, and recommend automated tests."
                  value={formData.instructions.objective}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      instructions: { ...formData.instructions, objective: e.target.value },
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #E9E8F1',
                    fontSize: '14px',
                    color: '#19182B',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#19182B', marginBottom: '6px' }}>
                  Preferred Response Format
                </label>
                <input
                  type="text"
                  placeholder="e.g., Structured markdown bullet points with code snippets and action items"
                  value={formData.instructions.responseStyle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      instructions: { ...formData.instructions, responseStyle: e.target.value },
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #E9E8F1',
                    fontSize: '14px',
                    color: '#19182B',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {/* TAB 3: CAPABILITIES & KNOWLEDGE */}
          {activeTab === 'capabilities' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#19182B', marginBottom: '10px' }}>
                  Select Agent Capabilities
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
                  {AVAILABLE_CAPABILITIES.map((cap) => {
                    const isChecked = formData.capabilities.includes(cap);
                    return (
                      <div
                        key={cap}
                        onClick={() => toggleCapability(cap)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: isChecked ? '1px solid #7047EB' : '1px solid #E9E8F1',
                          backgroundColor: isChecked ? '#EDE7FF' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '13px',
                          color: isChecked ? '#7047EB' : '#19182B',
                          fontWeight: isChecked ? 600 : 400,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            border: isChecked ? 'none' : '1px solid #74758A',
                            backgroundColor: isChecked ? '#7047EB' : '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            flexShrink: 0,
                          }}
                        >
                          {isChecked && <LuCheck />}
                        </div>
                        <span>{cap}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#19182B', marginBottom: '8px' }}>
                  Knowledge Base Context Entries
                </label>
                <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#74758A' }}>
                  Add reference specifications, guidelines, or SOP documents this agent should keep in memory.
                </p>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="e.g., Orvexa API Rate Limits & Auth Specs"
                    value={newKnowledgeItem}
                    onChange={(e) => setNewKnowledgeItem(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E9E8F1',
                      fontSize: '13px',
                      color: '#19182B',
                      outline: 'none',
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddKnowledge(e);
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddKnowledge}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#7047EB',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <LuPlus size={14} />
                    Add
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {formData.knowledge.map((k, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        backgroundColor: '#F8F9FC',
                        borderRadius: '6px',
                        border: '1px solid #E9E8F1',
                        fontSize: '13px',
                        color: '#19182B',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LuBookOpen size={14} color="#7047EB" />
                        <span>{k}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveKnowledge(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#EF6474',
                          padding: '4px',
                        }}
                      >
                        <LuTrash2 size={13} />
                      </button>
                    </div>
                  ))}
                  {formData.knowledge.length === 0 && (
                    <span style={{ fontSize: '13px', color: '#74758A', fontStyle: 'italic' }}>
                      No custom knowledge entries added yet.
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BEHAVIOR & GUARDRAILS */}
          {activeTab === 'behavior' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#19182B' }}>
                    Creativity / Temperature: {formData.behavior.creativity}
                  </label>
                  <span style={{ fontSize: '12px', color: '#74758A' }}>
                    {formData.behavior.creativity < 0.4 ? 'Deterministic & Precise' : 'Balanced & Creative'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={formData.behavior.creativity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      behavior: { ...formData.behavior, creativity: parseFloat(e.target.value) },
                    })
                  }
                  style={{ width: '100%', accentColor: '#7047EB' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#19182B', marginBottom: '6px' }}>
                  Response Length
                </label>
                <select
                  value={formData.behavior.responseLength}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      behavior: { ...formData.behavior, responseLength: e.target.value },
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #E9E8F1',
                    fontSize: '14px',
                    color: '#19182B',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                  }}
                >
                  <option value="Concise">Concise (Direct summaries only)</option>
                  <option value="Balanced">Balanced (Context + recommended actions)</option>
                  <option value="Detailed">Detailed (Full breakdown with citations)</option>
                </select>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px',
                  backgroundColor: '#F8F9FC',
                  borderRadius: '10px',
                  border: '1px solid #E9E8F1',
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#19182B' }}>
                    Require Confirmation for Destructive Actions
                  </div>
                  <div style={{ fontSize: '12px', color: '#74758A' }}>
                    Prompt workspace user before deleting tasks, archiving workflows, or making external calls.
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={formData.behavior.requireConfirmation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      behavior: { ...formData.behavior, requireConfirmation: e.target.checked },
                    })
                  }
                  style={{ width: '18px', height: '18px', accentColor: '#7047EB', cursor: 'pointer' }}
                />
              </div>
            </div>
          )}

          {/* TAB 5: TEST & ACTIONS */}
          {activeTab === 'test' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#19182B', marginBottom: '10px' }}>
                  Enabled Workspace Actions
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                  {AVAILABLE_ACTIONS.map((act) => {
                    const isChecked = formData.actions.includes(act);
                    return (
                      <div
                        key={act}
                        onClick={() => toggleAction(act)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: isChecked ? '1px solid #16B890' : '1px solid #E9E8F1',
                          backgroundColor: isChecked ? '#ECFDF5' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '13px',
                          color: isChecked ? '#065F46' : '#19182B',
                          fontWeight: isChecked ? 600 : 400,
                        }}
                      >
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            border: isChecked ? 'none' : '1px solid #74758A',
                            backgroundColor: isChecked ? '#16B890' : '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            fontSize: '11px',
                          }}
                        >
                          {isChecked && <LuCheck />}
                        </div>
                        <span>{act}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Simulation Sandbox Box */}
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#F8F9FC',
                  borderRadius: '12px',
                  border: '1px solid #E9E8F1',
                }}
              >
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#19182B', marginBottom: '8px' }}>
                  Simulated Agent Sandbox
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    placeholder="Type a test question for this agent..."
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E9E8F1',
                      fontSize: '13px',
                      color: '#19182B',
                      backgroundColor: '#FFFFFF',
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTestSimulate();
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleTestSimulate}
                    disabled={testing}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#7047EB',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      opacity: testing ? 0.7 : 1,
                    }}
                  >
                    <LuPlay size={13} />
                    {testing ? 'Testing...' : 'Test Run'}
                  </button>
                </div>

                {testResponse && (
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E9E8F1',
                      fontSize: '13px',
                      color: '#19182B',
                      whiteSpace: 'pre-line',
                      fontFamily: 'monospace',
                    }}
                  >
                    {testResponse}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #E9E8F1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            backgroundColor: '#FFFFFF',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              border: '1px solid #E9E8F1',
              backgroundColor: '#FFFFFF',
              color: '#74758A',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              padding: '9px 20px',
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
              boxShadow: '0 2px 6px rgba(112, 71, 235, 0.25)',
            }}
          >
            <LuSparkles size={14} />
            {isEditing ? 'Save Agent Changes' : 'Create Agent'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
