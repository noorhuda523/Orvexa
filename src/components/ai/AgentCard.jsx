import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LuWorkflow,
  LuListTodo,
  LuFileText,
  LuChartNoAxesCombined,
  LuTrendingUp,
  LuCircleHelp,
  LuBot,
  LuPlay,
  LuSettings2,
  LuEllipsisVertical,
  LuCopy,
  LuTrash2,
  LuClock,
  LuCpu,
  LuCheck,
} from 'react-icons/lu';

const ICON_MAP = {
  LuWorkflow,
  LuListTodo,
  LuFileText,
  LuChartNoAxesCombined,
  LuTrendingUp,
  LuCircleHelp,
  LuBot,
};

export default function AgentCard({
  agent,
  onConfigure,
  onDuplicate,
  onDelete,
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const IconComp = ICON_MAP[agent.icon] || LuBot;

  const handleCopyId = () => {
    navigator.clipboard?.writeText(agent.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="nx-agent-card"
      style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E9E8F1',
        boxShadow: '0 2px 8px rgba(25, 24, 43, 0.04)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
      }}
    >
      {/* Top Header Row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Agent Avatar Icon */}
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: `${agent.color || '#7047EB'}15`,
              color: agent.color || '#7047EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              flexShrink: 0,
              border: `1px solid ${agent.color || '#7047EB'}30`,
            }}
          >
            <IconComp />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#19182B',
                  lineHeight: 1.3,
                }}
              >
                {agent.name}
              </h3>
              {agent.isPrebuilt && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    padding: '2px 7px',
                    borderRadius: '12px',
                    backgroundColor: '#EDE7FF',
                    color: '#7047EB',
                  }}
                >
                  Core Agent
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  color: agent.status === 'active' ? '#16B890' : '#74758A',
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: agent.status === 'active' ? '#16B890' : '#74758A',
                  }}
                />
                {agent.status === 'active' ? 'Active & Ready' : 'Paused'}
              </span>
              <span style={{ color: '#E9E8F1' }}>•</span>
              <span style={{ fontSize: '12px', color: '#74758A' }}>{agent.category}</span>
            </div>
          </div>
        </div>

        {/* Options Menu Toggle */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
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
            aria-label="Agent options"
          >
            <LuEllipsisVertical size={16} />
          </button>

          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                width: '160px',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E9E8F1',
                boxShadow: '0 8px 24px rgba(25, 24, 43, 0.12)',
                zIndex: 20,
                padding: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onConfigure?.(agent);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  fontSize: '13px',
                  color: '#19182B',
                  background: 'none',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8F9FC')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LuSettings2 size={14} color="#74758A" />
                Configure
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDuplicate?.(agent.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  fontSize: '13px',
                  color: '#19182B',
                  background: 'none',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8F9FC')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LuCopy size={14} color="#74758A" />
                Duplicate
              </button>
              <button
                type="button"
                onClick={() => {
                  handleCopyId();
                  setTimeout(() => setMenuOpen(false), 600);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  fontSize: '13px',
                  color: '#19182B',
                  background: 'none',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8F9FC')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {copied ? <LuCheck size={14} color="#16B890" /> : <LuCpu size={14} color="#74758A" />}
                {copied ? 'ID Copied!' : 'Copy Agent ID'}
              </button>
              {!agent.isPrebuilt && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete?.(agent.id);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    fontSize: '13px',
                    color: '#EF6474',
                    background: 'none',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <LuTrash2 size={14} color="#EF6474" />
                  Delete Agent
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          margin: 0,
          fontSize: '13px',
          color: '#74758A',
          lineHeight: 1.5,
          minHeight: '38px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {agent.description}
      </p>

      {/* Capabilities Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {agent.capabilities?.slice(0, 3).map((cap, idx) => (
          <span
            key={idx}
            style={{
              fontSize: '11px',
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: '#F8F9FC',
              color: '#19182B',
              border: '1px solid #E9E8F1',
              fontWeight: 500,
            }}
          >
            {cap}
          </span>
        ))}
        {agent.capabilities?.length > 3 && (
          <span
            style={{
              fontSize: '11px',
              padding: '3px 6px',
              borderRadius: '6px',
              backgroundColor: '#F1F0FA',
              color: '#7047EB',
              fontWeight: 500,
            }}
          >
            +{agent.capabilities.length - 3}
          </span>
        )}
      </div>

      {/* Footer Metrics & Actions */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '14px',
          borderTop: '1px solid #E9E8F1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#74758A' }}>
          <LuClock size={13} color="#74758A" />
          <span>{agent.executionCount || 0} runs</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => onConfigure?.(agent)}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 500,
              color: '#19182B',
              backgroundColor: '#F8F9FC',
              border: '1px solid #E9E8F1',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#EDE7FF';
              e.currentTarget.style.color = '#7047EB';
              e.currentTarget.style.borderColor = '#8B75F5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F8F9FC';
              e.currentTarget.style.color = '#19182B';
              e.currentTarget.style.borderColor = '#E9E8F1';
            }}
          >
            <LuSettings2 size={13} />
            Configure
          </button>

          <button
            type="button"
            onClick={() => navigate(`/app/playground?agent=${agent.id}`)}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#FFFFFF',
              backgroundColor: '#7047EB',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(112, 71, 235, 0.25)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5D35DB')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#7047EB')}
          >
            <LuPlay size={12} />
            Playground
          </button>
        </div>
      </div>
    </motion.div>
  );
}
