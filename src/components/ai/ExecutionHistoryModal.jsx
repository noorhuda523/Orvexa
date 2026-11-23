import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LuX,
  LuClock,
  LuSearch,
  LuCpu,
  LuTrash2,
  LuCircleCheck,
  LuSparkles,
} from 'react-icons/lu';
import { readExecutionHistory } from '../../services/ai/agentService';

export default function ExecutionHistoryModal({ isOpen, onClose }) {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      setHistory(readExecutionHistory());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = history.filter(
    (h) =>
      h.agentName?.toLowerCase().includes(search.toLowerCase()) ||
      h.prompt?.toLowerCase().includes(search.toLowerCase()) ||
      h.responsePreview?.toLowerCase().includes(search.toLowerCase())
  );

  const handleClear = () => {
    localStorage.removeItem('nx-ai-executions');
    setHistory([]);
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
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '85vh',
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
              <LuCpu />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#19182B' }}>
                AI Agent Execution Telemetry
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#74758A' }}>
                Audit log of recent simulated autonomous agent invocations and latency.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  background: 'none',
                  border: '1px solid #E9E8F1',
                  color: '#EF6474',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <LuTrash2 size={13} />
                Clear Logs
              </button>
            )}
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
              }}
            >
              <LuX size={18} />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid #E9E8F1', backgroundColor: '#F8F9FC' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E9E8F1',
              borderRadius: '8px',
              padding: '6px 12px',
            }}
          >
            <LuSearch size={14} color="#74758A" />
            <input
              type="text"
              placeholder="Search by agent name, prompt query, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '13px',
                color: '#19182B',
              }}
            />
          </div>
        </div>

        {/* List of executions */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#74758A' }}>
              <LuClock size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#19182B' }}>No execution records found</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>Invocations in the Playground or Copilot will appear here.</div>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '1px solid #E9E8F1',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#7047EB',
                        backgroundColor: '#EDE7FF',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {item.agentName}
                    </span>
                    <span style={{ fontSize: '12px', color: '#74758A' }}>
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        color: '#16B890',
                        backgroundColor: '#ECFDF5',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <LuCircleCheck size={11} />
                      {item.status || 'Completed'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#74758A', fontFamily: 'monospace' }}>
                      {item.latency || '260ms'}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 500, color: '#19182B' }}>
                  "{item.prompt}"
                </div>

                <div
                  style={{
                    fontSize: '12px',
                    color: '#74758A',
                    backgroundColor: '#F8F9FC',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #E9E8F1',
                    lineHeight: 1.4,
                  }}
                >
                  {item.responsePreview}
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
