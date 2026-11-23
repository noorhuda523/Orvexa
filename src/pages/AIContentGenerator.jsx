import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuSparkles,
  LuFileText,
  LuCopy,
  LuCheck,
  LuSave,
  LuTrash2,
  LuRefreshCw,
  LuBookOpen,
  LuSlidersHorizontal,
  LuArrowRight,
  LuClock,
} from 'react-icons/lu';
import {
  CONTENT_CATEGORIES,
  TEMPLATES_BY_CATEGORY,
  TONE_OPTIONS,
  LENGTH_OPTIONS,
  readDrafts,
  saveDraft,
  deleteDraft,
  generateContent,
} from '../services/ai/contentGeneratorService';

export default function AIContentGenerator() {
  const [category, setCategory] = useState('email');
  const [templateId, setTemplateId] = useState('');
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState(TONE_OPTIONS[0]);
  const [length, setLength] = useState('standard');
  const [creativity, setCreativity] = useState(0.5);

  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [draftsOpen, setDraftsOpen] = useState(false);
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    setDrafts(readDrafts());
    const handler = () => setDrafts(readDrafts());
    window.addEventListener('nx-drafts-updated', handler);
    return () => window.removeEventListener('nx-drafts-updated', handler);
  }, []);

  // Update default prompt when template changes
  const currentTemplates = TEMPLATES_BY_CATEGORY[category] || [];
  useEffect(() => {
    if (currentTemplates.length > 0) {
      setTemplateId(currentTemplates[0].id);
      setPrompt(currentTemplates[0].defaultPrompt);
    }
  }, [category]);

  const handleTemplateChange = (id) => {
    setTemplateId(id);
    const tmpl = currentTemplates.find((t) => t.id === id);
    if (tmpl) setPrompt(tmpl.defaultPrompt);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setSavedSuccess(false);

    try {
      const result = await generateContent({
        category,
        templateId,
        prompt,
        tone,
        length,
        creativity,
      });
      setGeneratedText(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard?.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSave = () => {
    if (!generatedText) return;
    const currentTemplate = currentTemplates.find((t) => t.id === templateId);
    saveDraft({
      title: currentTemplate ? currentTemplate.name : 'Generated Copy',
      category,
      templateId,
      tone,
      content: generatedText,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleLoadDraft = (d) => {
    setGeneratedText(d.content);
    setCategory(d.category);
    setTone(d.tone || TONE_OPTIONS[0]);
    setDraftsOpen(false);
  };

  const wordCount = generatedText ? generatedText.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div
      className="nx-page-container"
      style={{
        padding: '24px 32px',
        maxWidth: '1440px',
        margin: '0 auto',
      }}
    >
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="nx-hero-heading" style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#19182B' }}>
              AI Content & Copy Studio
            </h1>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: '#EDE7FF',
                color: '#7047EB',
              }}
            >
              Multi-Template
            </span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#74758A' }}>
            Generate executive emails, task specifications, SOPs, and strategy briefs with brand precision.
          </p>
        </div>

        {/* Saved Drafts Toggle Button */}
        <button
          type="button"
          onClick={() => setDraftsOpen(!draftsOpen)}
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
            gap: '8px',
            boxShadow: '0 1px 3px rgba(25, 24, 43, 0.04)',
          }}
        >
          <LuBookOpen size={14} color="#7047EB" />
          Saved Drafts ({drafts.length})
        </button>
      </div>

      {/* Main Grid: Left Config Panel, Right Output Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '440px 1fr',
          gap: '24px',
          alignItems: 'flex-start',
        }}
      >
        {/* LEFT PANEL: Generator Controls */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E9E8F1',
            boxShadow: '0 2px 8px rgba(25, 24, 43, 0.04)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Category Tabs */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#19182B', marginBottom: '8px' }}>
              Content Category
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {CONTENT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: category === cat.id ? 600 : 500,
                    color: category === cat.id ? '#7047EB' : '#74758A',
                    backgroundColor: category === cat.id ? '#EDE7FF' : '#F8F9FC',
                    border: '1px solid',
                    borderColor: category === cat.id ? '#8B75F5' : '#E9E8F1',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Template Dropdown */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#19182B', marginBottom: '6px' }}>
              Template Blueprint
            </label>
            <select
              value={templateId}
              onChange={(e) => handleTemplateChange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #E9E8F1',
                fontSize: '13px',
                color: '#19182B',
                backgroundColor: '#FFFFFF',
                outline: 'none',
              }}
            >
              {currentTemplates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Prompt Brief Textarea */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#19182B', marginBottom: '6px' }}>
              Topic / Key Requirements
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter context, details, or specific bullet points to include..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #E9E8F1',
                fontSize: '13px',
                color: '#19182B',
                outline: 'none',
                resize: 'vertical',
                lineHeight: 1.4,
              }}
            />
          </div>

          {/* Tone Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#19182B', marginBottom: '8px' }}>
              Writing Tone
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {TONE_OPTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: tone === t ? 600 : 400,
                    color: tone === t ? '#7047EB' : '#19182B',
                    backgroundColor: tone === t ? '#EDE7FF' : '#F8F9FC',
                    border: '1px solid',
                    borderColor: tone === t ? '#7047EB' : '#E9E8F1',
                    cursor: 'pointer',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Length Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#19182B', marginBottom: '8px' }}>
              Target Length
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {LENGTH_OPTIONS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLength(l.id)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: length === l.id ? 600 : 500,
                    color: length === l.id ? '#7047EB' : '#74758A',
                    backgroundColor: length === l.id ? '#EDE7FF' : '#FFFFFF',
                    border: '1px solid',
                    borderColor: length === l.id ? '#7047EB' : '#E9E8F1',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  {l.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            style={{
              padding: '12px',
              borderRadius: '10px',
              backgroundColor: '#7047EB',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: loading ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(112, 71, 235, 0.3)',
              marginTop: '8px',
              opacity: loading ? 0.8 : 1,
            }}
          >
            <LuSparkles size={16} />
            {loading ? 'Generating Content...' : 'Generate Content'}
          </button>
        </div>

        {/* RIGHT PANEL: Generated Content Display */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E9E8F1',
            boxShadow: '0 2px 8px rgba(25, 24, 43, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: '520px',
          }}
        >
          {/* Header Row */}
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid #E9E8F1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F8F9FC',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LuFileText size={18} color="#7047EB" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#19182B' }}>
                  Document Output
                </div>
                {generatedText && (
                  <div style={{ fontSize: '11px', color: '#74758A' }}>
                    {wordCount} words • ~{readingTime} min read
                  </div>
                )}
              </div>
            </div>

            {/* Actions: Copy & Save */}
            {generatedText && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleSave}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: savedSuccess ? '#ECFDF5' : '#FFFFFF',
                    color: savedSuccess ? '#16B890' : '#19182B',
                    border: '1px solid',
                    borderColor: savedSuccess ? '#16B890' : '#E9E8F1',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {savedSuccess ? <LuCheck size={13} color="#16B890" /> : <LuSave size={13} />}
                  {savedSuccess ? 'Saved to Drafts' : 'Save Draft'}
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#7047EB',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {copied ? <LuCheck size={13} /> : <LuCopy size={13} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </div>

          {/* Textarea / Document Canvas */}
          <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column' }}>
            {generatedText ? (
              <textarea
                value={generatedText}
                onChange={(e) => setGeneratedText(e.target.value)}
                style={{
                  width: '100%',
                  flex: 1,
                  minHeight: '440px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: '#19182B',
                  fontFamily: 'inherit',
                  resize: 'none',
                  backgroundColor: 'transparent',
                }}
              />
            ) : (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px',
                  textAlign: 'center',
                  color: '#74758A',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: '#EDE7FF',
                    color: '#7047EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    marginBottom: '16px',
                  }}
                >
                  <LuSparkles />
                </div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#19182B' }}>
                  Ready to Generate
                </h3>
                <p style={{ margin: '6px 0 0', fontSize: '13px', maxWidth: '360px', lineHeight: 1.5 }}>
                  Select a template blueprint, adjust tone and requirements on the left, and click <strong>Generate Content</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Saved Drafts Drawer / Modal */}
      <AnimatePresence>
        {draftsOpen && (
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
              if (e.target === e.currentTarget) setDraftsOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              style={{
                width: '100%',
                maxWidth: '680px',
                maxHeight: '80vh',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0 20px 48px rgba(25, 24, 43, 0.16)',
                border: '1px solid #E9E8F1',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid #E9E8F1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#F8F9FC',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <LuBookOpen size={18} color="#7047EB" />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#19182B' }}>
                    Saved Content Drafts ({drafts.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setDraftsOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#74758A',
                    fontSize: '13px',
                  }}
                >
                  Close
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {drafts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#74758A' }}>
                    No saved drafts yet. Generate content and click "Save Draft".
                  </div>
                ) : (
                  drafts.map((d) => (
                    <div
                      key={d.id}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '10px',
                        border: '1px solid #E9E8F1',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#19182B' }}>
                          {d.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#74758A', marginTop: '2px' }}>
                          Category: {d.category} • {d.tone || 'Professional'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleLoadDraft(d)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            backgroundColor: '#EDE7FF',
                            color: '#7047EB',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Load
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteDraft(d.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#EF6474',
                            padding: '4px',
                          }}
                        >
                          <LuTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
