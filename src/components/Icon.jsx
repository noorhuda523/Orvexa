import React from 'react';
import * as Lu from 'react-icons/lu';

/**
 * Nexora Centralized Icon System
 * Standardized Lucide outline icons via react-icons/lu
 * Sizes: sm (14-16px), md (18-20px), lg (22-24px), xl (32-48px)
 */

export const ICON_SIZES = {
  xs: 12,
  sm: 15,
  md: 18,
  lg: 22,
  xl: 32,
  xxl: 44,
};

export default function Icon({
  name,
  size = 'md',
  color,
  className = '',
  strokeWidth = 2,
  ariaHidden = true,
  ariaLabel,
  style = {},
  ...props
}) {
  const pixelSize = typeof size === 'number' ? size : ICON_SIZES[size] || 18;

  // Resolve Icon Component from Lucide
  // Supports both exact export ('LuWorkflow') and semantic shorthand ('workflow', 'Workflow')
  let IconComponent = null;

  if (typeof name === 'string') {
    if (Lu[name]) {
      IconComponent = Lu[name];
    } else {
      const pascal = name
        .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
        .replace(/^\w/, (c) => c.toUpperCase());
      const luName = 'Lu' + pascal;
      IconComponent = Lu[luName] || Lu[name] || Lu.LuCircle;
    }
  } else if (typeof name === 'function') {
    IconComponent = name;
  }

  if (!IconComponent) {
    IconComponent = Lu.LuCircle;
  }

  return (
    <IconComponent
      size={pixelSize}
      color={color}
      strokeWidth={strokeWidth}
      className={`nx-icon ${className}`}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        verticalAlign: 'middle',
        ...style,
      }}
      {...props}
    />
  );
}

// Re-export common Lucide icons directly for convenient standard usage
export {
  LuLayoutDashboard,
  LuWorkflow,
  LuListTodo,
  LuChartNoAxesCombined,
  LuSettings,
  LuBell,
  LuSearch,
  LuUserRound,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuPlay,
  LuPause,
  LuCircleCheck,
  LuCircleAlert,
  LuCircleX,
  LuClock3,
  LuZap,
  LuSparkles,
  LuBot,
  LuFileText,
  LuUsers,
  LuPlug,
  LuShieldCheck,
  LuActivity,
  LuLink,
  LuCopy,
  LuExternalLink,
  LuChevronDown,
  LuChevronRight,
  LuChevronUp,
  LuCheck,
  LuX,
  LuArrowRight,
  LuFilter,
  LuSlidersHorizontal,
  LuRefreshCw,
  LuSun,
  LuCircleHelp,
  LuLock,
  LuBriefcase,
  LuRocket,
  LuWrench,
  LuFolder,
  LuMessageSquare,
  LuGitBranch,
  LuEye,
  LuEyeOff,
  LuStar,
  LuMaximize2,
  LuZoomIn,
  LuZoomOut,
  LuUndo2,
  LuRedo2,
  LuMove,
  LuShare2,
  LuHistory,
  LuLayers,
  LuCpu,
  LuDatabase,
  LuGrid2X2,
  LuList,
  LuCalendar,
  LuCode,
  LuTarget,
  LuTrendingUp,
  LuTrendingDown,
  LuLightbulb,
  LuTimer,
  LuPalette,
  LuCheckCheck,
} from 'react-icons/lu';
