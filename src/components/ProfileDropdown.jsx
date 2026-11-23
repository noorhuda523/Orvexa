import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from './ui';
import { LuUser, LuSettings, LuLogOut } from 'react-icons/lu';

export default function ProfileDropdown({ user, profile, onSignOut }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const userName = user?.name || 'Noor-Ul-Huda';
  const userEmail = user?.email || 'noorulhuda@orvexa.dev';
  const userPlan = user?.plan ? `${user.plan} Workspace` : 'Pro Workspace';
  const avatarSrc = profile?.avatar || '';

  // Close dropdown whenever route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Click outside and Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setIsOpen(false);
    if (onSignOut) {
      onSignOut();
    }
  };

  return (
    <div className="nx-profile-dropdown-container" ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Profile Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        className="nx-tb-avatar-btn"
        onClick={toggleDropdown}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Account profile and settings menu"
        title="Account & Settings"
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          borderRadius: '50%',
          outline: 'none',
        }}
      >
        <Avatar
          name={userName}
          size={32}
          color="#7047EB"
          src={avatarSrc}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            aria-label="User Account Menu"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: 0,
              width: 270,
              maxWidth: 'calc(100vw - 32px)',
              background: '#FFFFFF',
              borderRadius: 12,
              border: '1px solid #E9E8F1',
              boxShadow: '0 12px 32px rgba(25, 24, 43, 0.1)',
              padding: '6px',
              zIndex: 9999,
              transformOrigin: 'top right',
              overflow: 'hidden',
            }}
          >
            {/* ── 1. User Information Card ── */}
            <div
              style={{
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: '#FAFAFD',
                borderRadius: 8,
                marginBottom: 4,
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <Avatar
                  name={userName}
                  size={38}
                  color="#7047EB"
                  src={avatarSrc}
                />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: '#19182B',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.25,
                  }}
                  title={userName}
                >
                  {userName}
                </div>
                <div
                  style={{
                    fontSize: '0.74rem',
                    color: '#74758A',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginTop: 2,
                  }}
                  title={userEmail}
                >
                  {userEmail}
                </div>
                <div style={{ marginTop: 5 }}>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: '#7047EB',
                      background: '#EDE7FF',
                      padding: '1px 7px',
                      borderRadius: 4,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {userPlan}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: '#F1F0FA', margin: '4px 0' }} />

            {/* ── 2. Profile Option ── */}
            <button
              type="button"
              role="menuitem"
              onClick={() => handleNavigate('/app/profile')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 8,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#F8F9FC'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  background: '#F1F0FA',
                  color: '#7047EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <LuUser size={15} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#19182B' }}>
                  My Profile
                </div>
                <div style={{ fontSize: '0.72rem', color: '#74758A' }}>
                  Account details & identity
                </div>
              </div>
            </button>

            {/* ── 3. Settings Option ── */}
            <button
              type="button"
              role="menuitem"
              onClick={() => handleNavigate('/app/settings')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 8,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#F8F9FC'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  background: '#F1F0FA',
                  color: '#7047EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <LuSettings size={15} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#19182B' }}>
                  Settings
                </div>
                <div style={{ fontSize: '0.72rem', color: '#74758A' }}>
                  Workspace, preferences & security
                </div>
              </div>
            </button>

            <div style={{ height: 1, background: '#F1F0FA', margin: '4px 0' }} />

            {/* ── 4. Logout Option (Semantic Danger Styling) ── */}
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 8,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FEECEE';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  background: '#FEECEE',
                  color: '#E5484D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <LuLogOut size={15} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#E5484D' }}>
                  Log Out
                </div>
                <div style={{ fontSize: '0.72rem', color: '#74758A' }}>
                  End session and return to Sign In
                </div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
