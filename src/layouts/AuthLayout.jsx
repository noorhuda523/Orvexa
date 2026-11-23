import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SkipLink from '../components/SkipLink';
import { Logo } from '../components/ui';
import { Btn } from '../components/Button';
import { useApp } from '../context/AppContext';
import usePageMeta from '../hooks/usePageMeta';
import {
  LuCheck,
  LuBot,
  LuZap,
  LuSparkles,
  LuWorkflow,
  LuArrowRight,
  LuShieldCheck,
  LuActivity,
} from 'react-icons/lu';

export default function AuthLayout() {
  const { user, go } = useApp();
  const location = useLocation();
  const mainRef = usePageMeta();

  // Mode: Sign In (false) vs Sign Up (true)
  const isSignUp = location.pathname.startsWith('/signup');

  // Track desktop viewport for side-by-side sliding transition
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Butter-smooth hardware-accelerated slide transition
  const slideTransition = {
    duration: 0.55,
    ease: [0.16, 1, 0.3, 1], // easeOutExpo
  };

  return (
    <>
      <SkipLink />
      <div className="nx-auth-page-root">
        {/* ── Form Panel (Left on Sign In, Glides to Right on Sign Up) ── */}
        <motion.div
          className="nx-auth-form-side"
          initial={false}
          animate={{
            x: isDesktop ? (isSignUp ? '100%' : '0%') : '0%',
          }}
          transition={slideTransition}
          style={{
            flex: isDesktop ? '0 0 50%' : '1 1 100%',
            width: isDesktop ? '50%' : '100%',
            minWidth: 0,
            zIndex: 2,
            position: 'relative',
          }}
        >
          {/* Top Brand & Navigation */}
          <header className="nx-auth-header">
            <Logo go={go} />
            <button className="nx-auth-back-link" onClick={() => go('home')}>
              ← Back to website
            </button>
          </header>

          <main ref={mainRef} tabIndex={-1} className="nx-auth-card-wrapper">
            <div className="nx-auth-card">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSignUp ? 'signup-form' : 'signin-form'}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  style={{ width: '100%' }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          {/* Footer Fineprint */}
          <footer className="nx-auth-footer">
            <span>© 2026 Orvexa Technologies Inc.</span>
            <div className="nx-auth-footer-links">
              <button onClick={() => go('privacy')}>Privacy</button>
              <span>·</span>
              <button onClick={() => go('terms')}>Terms</button>
              <span>·</span>
              <button onClick={() => go('contact')}>Support</button>
            </div>
          </footer>
        </motion.div>

        {/* ── Visual Branding Panel (Right on Sign In, Glides to Left on Sign Up) ── */}
        <motion.div
          className="nx-auth-showcase-side"
          initial={false}
          animate={{
            x: isDesktop ? (isSignUp ? '-100%' : '0%') : '0%',
          }}
          transition={slideTransition}
          style={{
            flex: isDesktop ? '0 0 50%' : '1 1 100%',
            width: isDesktop ? '50%' : '100%',
            minWidth: 0,
            overflow: 'hidden',
            zIndex: 1,
            position: 'relative',
          }}
          aria-hidden="true"
        >
          {/* Animated Ambient Floating Shapes */}
          <motion.div
            className="nx-auth-showcase-ambient"
            animate={{
              x: [0, 24, -18, 0],
              y: [0, -32, 16, 0],
              scale: [1, 1.08, 0.96, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <motion.div
            style={{
              position: 'absolute',
              width: 380,
              height: 380,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(101, 213, 202, 0.22) 0%, rgba(112, 71, 235, 0.12) 50%, transparent 70%)',
              bottom: '10%',
              right: isSignUp ? '10%' : '15%',
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }}
            animate={{
              x: [0, -20, 20, 0],
              y: [0, 25, -15, 0],
              scale: [1, 1.12, 0.95, 1],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <div className="nx-auth-showcase-grid" />

          {/* Foreground Visual Showcase Content */}
          <div className="nx-auth-showcase-content">
            {/* Orvexa Brand Header */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ marginBottom: 4 }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#65D5CA',
                  background: 'rgba(101, 213, 202, 0.12)',
                  border: '1px solid rgba(101, 213, 202, 0.25)',
                  padding: '4px 12px',
                  borderRadius: 999,
                  marginBottom: 12,
                }}
              >
                <LuSparkles size={12} />
                <span>ORVEXA WORKSPACE</span>
              </div>

              <h2
                style={{
                  fontSize: '30px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-0.025em',
                  margin: '0 0 8px 0',
                  lineHeight: 1.25,
                }}
              >
                Orchestrate. Automate. Accelerate.
              </h2>
              <p
                style={{
                  fontSize: '13.5px',
                  color: '#A0A3BD',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {isSignUp
                  ? 'Join high-velocity teams using autonomous AI agents and resilient workflows.'
                  : 'Welcome back. Your tasks, pipelines, and AI orchestrators are ready.'}
              </p>
            </motion.div>

            {/* Live Pipeline Flow Card with Connected Animated Nodes */}
            <motion.div
              className="nx-auth-pipeline-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="nx-apc-top">
                <span className="nx-apc-badge">
                  <LuZap size={12} style={{ marginRight: 6 }} />
                  Autonomous Incident Pipeline
                </span>
                <span className="nx-apc-status">● Live Active</span>
              </div>

              <div className="nx-apc-body">
                {/* Step 1: Trigger */}
                <div className="nx-apc-step done">
                  <span className="nx-apc-dot">
                    <LuCheck size={11} strokeWidth={3} />
                  </span>
                  <div>
                    <strong>P0 Webhook Event Ingested</strong>
                    <span>GitHub Issue #342 · Automated alert received</span>
                  </div>
                </div>

                {/* Animated Workflow Connector Line */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 11,
                    margin: '3px 0',
                  }}
                >
                  <div
                    style={{
                      width: 2,
                      height: 18,
                      background: 'linear-gradient(180deg, #10B981 0%, #7047EB 100%)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 8,
                        background: '#65D5CA',
                      }}
                      animate={{ y: [0, 18] }}
                      transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
                    />
                  </div>
                </div>

                {/* Step 2: AI Agent Decision */}
                <div className="nx-apc-step active">
                  <span className="nx-apc-dot active">
                    <LuBot size={13} />
                  </span>
                  <div>
                    <strong>AI Diagnostic & Workflow Triage</strong>
                    <span>Root cause: API Gateway timeout · P1 Assigned</span>
                  </div>
                </div>

                {/* Animated Connector Line */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 11,
                    margin: '3px 0',
                  }}
                >
                  <div
                    style={{
                      width: 2,
                      height: 18,
                      background: 'linear-gradient(180deg, #7047EB 0%, rgba(255,255,255,0.3) 100%)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 8,
                        background: '#A78BFA',
                      }}
                      animate={{ y: [0, 18] }}
                      transition={{ repeat: Infinity, duration: 1.4, ease: 'linear', delay: 0.7 }}
                    />
                  </div>
                </div>

                {/* Step 3: Resolution */}
                <div className="nx-apc-step pending">
                  <span className="nx-apc-dot">
                    <LuZap size={12} />
                  </span>
                  <div>
                    <strong>Dispatched Resolution</strong>
                    <span>Slack #eng-ops, Jira ticket, on-call alert</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Testimonial Quote Card with Floating Parallax */}
            <motion.div
              className="nx-auth-testimonial-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <div className="nx-atc-quote">
                "Orvexa cut our team's incident triage time by 60% and eliminated our manual release coordination. It feels like having an extra engineering lead on the squad."
              </div>
              <div className="nx-atc-author">
                <div className="nx-atc-avatar">NH</div>
                <div>
                  <strong>Noor-Ul-Huda</strong>
                  <span>Lead DevOps Engineer · Orvexa Workspace</span>
                </div>
              </div>
            </motion.div>

            {/* Live Telemetry Ribbon */}
            <motion.div
              className="nx-auth-stats-strip"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="nx-astat">
                <strong>18.4 hrs</strong>
                <span>Weekly Time Saved</span>
              </div>
              <div className="nx-astat-sep" />
              <div className="nx-astat">
                <strong>99.98%</strong>
                <span>Run Reliability</span>
              </div>
              <div className="nx-astat-sep" />
              <div className="nx-astat">
                <strong>1,420+</strong>
                <span>Autonomous Flows</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
