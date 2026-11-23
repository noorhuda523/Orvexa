import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Btn } from '../components/Button';
import { useToast } from '../components/Toast';
import { useApp } from '../context/AppContext';
import { HELP_FAQ } from '../data/content';
import useLocalState from '../hooks/useLocalState';
import { ago } from '../utils/dates';
import { fadeUp, cardVariants, staggerContainer, SPRING } from '../motion/variants';

const CATEGORIES = ['All', 'Workflows', 'Tasks & Projects', 'Integrations', 'Billing & Plans'];

export default function Help() {
  const toast = useToast();
  const { notify } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [tickets, setTickets] = useLocalState('nx-tickets', []);
  const [form, setForm] = useState({ subject: '', category: 'Technical Support', message: '' });
  const [errors, setErrors] = useState({});

  const filteredFaqs = HELP_FAQ.filter((f) => {
    const matchCat =
      selectedCat === 'All' ||
      (selectedCat === 'Workflows' && (f.c === 'Workflows' || (f.q + f.a).toLowerCase().includes('workflow'))) ||
      (selectedCat === 'Tasks & Projects' && (f.c === 'Tasks' || (f.q + f.a).toLowerCase().includes('task'))) ||
      (selectedCat === 'Integrations' && (f.c === 'Integrations' || (f.q + f.a).toLowerCase().includes('connect') || (f.q + f.a).toLowerCase().includes('api'))) ||
      (selectedCat === 'Billing & Plans' && (f.c === 'Billing' || (f.q + f.a).toLowerCase().includes('plan') || (f.q + f.a).toLowerCase().includes('upgrade')));

    const matchSearch =
      !searchQuery.trim() ||
      (f.q + ' ' + f.a).toLowerCase().includes(searchQuery.trim().toLowerCase());

    return matchCat && matchSearch;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (form.subject.trim().length < 4) {
      newErrors.subject = 'Please add a clear subject line (at least 4 characters).';
    }
    if (form.message.trim().length < 15) {
      newErrors.message = 'Please describe your request in at least 15 characters.';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length) {
      toast('Please fix the highlighted fields.', 'err');
      return;
    }

    const ticketId = 'NX-' + (1001 + tickets.length);
    const newTicket = {
      id: ticketId,
      subject: form.subject.trim(),
      category: form.category,
      at: Date.now(),
      status: 'Open',
    };

    setTickets([newTicket, ...tickets]);
    setForm({ subject: '', category: 'Technical Support', message: '' });
    notify(`Support ticket ${ticketId} created`, 'Our team will review your message shortly.', 'success');
    toast(`Support ticket ${ticketId} submitted successfully!`);
  };

  return (
    <div className="pg apppg nx-help-page">
      {/* Header */}
      <div className="nx-page-header">
        <div className="nx-header-left">
          <div className="nx-header-breadcrumbs">
            <span>Workspace</span>
            <span className="nx-bc-sep">/</span>
            <span className="nx-bc-current">Help & Documentation</span>
          </div>
          <h1 className="nx-page-title">Help Center & Support</h1>
          <p className="nx-page-sub">
            Guides, FAQs, and dedicated support for configuring pipelines and workspace automations.
          </p>
        </div>

        <div className="nx-header-actions">
          <div className="nx-sys-status-badge">
            <span className="nx-status-dot-pulse" />
            All Systems Operational (99.98%)
          </div>
        </div>
      </div>

      {/* Search & Hero Card */}
      <motion.div
        className="nx-help-search-hero"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h2>How can we help your team today?</h2>
        <div className="nx-help-search-input-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search documentation, setup guides, trigger configurations…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Category Pills */}
      <div className="nx-filter-bar">
        <div className="nx-category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`nx-cat-pill ${selectedCat === cat ? 'active' : ''}`}
              onClick={() => setSelectedCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="nx-faq-section-card">
        <div className="nx-card-head">
          <h3>Frequently Asked Questions</h3>
          <span className="nx-card-note">{filteredFaqs.length} articles found</span>
        </div>

        {filteredFaqs.length > 0 ? (
          <div className="nx-faq-accordion-list">
            {filteredFaqs.map((faq, i) => (
              <details key={faq.q || i} className="nx-faq-item">
                <summary className="nx-faq-question">
                  <span>{faq.q}</span>
                  <span className="nx-faq-chevron">▾</span>
                </summary>
                <div className="nx-faq-answer">
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="nx-empty-notifs-card">
            <h3>No articles match your query</h3>
            <p>Try different keywords or submit a direct support ticket below.</p>
            <Btn
              v="sec"
              onClick={() => {
                setSearchQuery('');
                setSelectedCat('All');
              }}
            >
              Reset Filters
            </Btn>
          </div>
        )}
      </div>

      {/* Two Columns: Contact Support Form & Your Tickets */}
      <div className="nx-help-split-grid">
        {/* Contact Support */}
        <div className="nx-card-box">
          <div className="nx-box-head">
            <h3 className="nx-box-title">Contact Support Team</h3>
            <span className="nx-box-badge">Priority SLA</span>
          </div>

          <form onSubmit={handleSubmit} noValidate className="nx-support-form">
            <div className="nx-form-group">
              <label className="nx-form-label" htmlFor="ticket-subject">
                Subject
              </label>
              <input
                id="ticket-subject"
                type="text"
                className={`nx-form-input ${errors.subject ? 'has-error' : ''}`}
                placeholder="e.g. Question regarding Slack webhook integration"
                value={form.subject}
                onChange={(e) => {
                  setForm({ ...form, subject: e.target.value });
                  if (errors.subject) setErrors({ ...errors, subject: '' });
                }}
              />
              {errors.subject && <span className="nx-form-error">{errors.subject}</span>}
            </div>

            <div className="nx-form-group">
              <label className="nx-form-label" htmlFor="ticket-category">
                Category
              </label>
              <select
                id="ticket-category"
                className="nx-form-input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Technical Support">Technical Support</option>
                <option value="Workflow Configuration">Workflow Configuration</option>
                <option value="Billing & Invoicing">Billing & Invoicing</option>
                <option value="Feature Request">Feature Request</option>
              </select>
            </div>

            <div className="nx-form-group">
              <label className="nx-form-label" htmlFor="ticket-message">
                How can we assist you?
              </label>
              <textarea
                id="ticket-message"
                className={`nx-form-input nx-form-textarea ${errors.message ? 'has-error' : ''}`}
                rows={4}
                placeholder="Provide details about your query or incident…"
                value={form.message}
                onChange={(e) => {
                  setForm({ ...form, message: e.target.value });
                  if (errors.message) setErrors({ ...errors, message: '' });
                }}
              />
              {errors.message && <span className="nx-form-error">{errors.message}</span>}
            </div>

            <Btn type="submit">Submit Support Ticket →</Btn>
          </form>
        </div>

        {/* Your Tickets */}
        <div className="nx-card-box">
          <div className="nx-box-head">
            <h3 className="nx-box-title">Your Submitted Requests</h3>
            <span className="nx-box-badge cyan">{tickets.length} Saved</span>
          </div>

          {tickets.length > 0 ? (
            <div className="nx-table-wrap">
              <table className="nx-data-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <strong>{t.id}</strong>
                      </td>
                      <td>{t.subject}</td>
                      <td>
                        <span className="nx-status-chip-open">● {t.status}</span>
                      </td>
                      <td>{ago(t.at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="nx-empty-tickets-msg">
              <p>No active support tickets. When you submit a request, you can monitor its status here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
