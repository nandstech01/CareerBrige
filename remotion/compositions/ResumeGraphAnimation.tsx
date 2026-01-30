import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion'

// --- Inline SVG Icon Components ---

const PersonIcon = ({ size = 48, color = '#22d3ee' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
    <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const BrainIcon = ({ size = 40, color = '#ef4444' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2C9.5 2 7.5 3.5 7 5.5C5.5 5.5 4 7 4 9c0 1.5.8 2.8 2 3.5C6 14 6 16 7.5 17.5c1 1 2.5 1.5 4.5 1.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 2c2.5 0 4.5 1.5 5 3.5 1.5 0 3 1.5 3 3.5 0 1.5-.8 2.8-2 3.5 0 1.5 0 3.5-1.5 5-1 1-2.5 1.5-4.5 1.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 2v17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" />
  </svg>
)

const DocumentIcon = ({ size = 36, color = '#ec4899' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="14,2 14,8 20,8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="8" y1="13" x2="16" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="17" x2="13" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const TrophyIcon = ({ size = 36, color = '#3b82f6' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M6 4h12v4a6 6 0 0 1-12 0V4z" stroke={color} strokeWidth="1.8" />
    <path d="M6 6H4a2 2 0 0 0 0 4h2" stroke={color} strokeWidth="1.8" />
    <path d="M18 6h2a2 2 0 0 1 0 4h-2" stroke={color} strokeWidth="1.8" />
    <line x1="12" y1="14" x2="12" y2="18" stroke={color} strokeWidth="1.8" />
    <path d="M8 18h8v2H8z" stroke={color} strokeWidth="1.5" />
  </svg>
)

const GradCapIcon = ({ size = 36, color = '#94a3b8' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M5 13.18v4L12 21l7-3.82v-4" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
)

const VerifiedIcon = ({ size = 18, color = '#0f172a' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <polyline points="9,12 11,14 15,10" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// --- Node configurations ---

interface NodeConfig {
  label: string
  icon: React.ReactNode
  color: string
  glowColor: string
  badgeCount: string
  x: number
  y: number
}

const NODES: NodeConfig[] = [
  {
    label: 'スキル解析',
    icon: <BrainIcon size={100} />,
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.6)',
    badgeCount: '',
    x: 22,
    y: 22,
  },
  {
    label: '経歴データ',
    icon: <DocumentIcon size={95} />,
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.6)',
    badgeCount: '',
    x: 78,
    y: 22,
  },
  {
    label: '実績',
    icon: <TrophyIcon size={95} />,
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    badgeCount: '',
    x: 22,
    y: 78,
  },
  {
    label: '学歴',
    icon: <GradCapIcon size={95} />,
    color: '#94a3b8',
    glowColor: 'rgba(148, 163, 184, 0.4)',
    badgeCount: '',
    x: 78,
    y: 78,
  },
]

// --- Pulsing dot that travels along a line ---

const TravelingDot = ({
  fromX,
  fromY,
  toX,
  toY,
  delay,
  speed = 0.008,
  color = '#22d3ee',
}: {
  fromX: number
  fromY: number
  toX: number
  toY: number
  delay: number
  speed?: number
  color?: string
}) => {
  const frame = useCurrentFrame()
  const t = ((frame - delay) * speed) % 1
  const progress = t < 0 ? 0 : t

  const cx = fromX + (toX - fromX) * progress
  const cy = fromY + (toY - fromY) * progress

  const opacity = frame < 100 ? interpolate(frame, [100 - 20, 100], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0.9

  return (
    <circle
      cx={`${cx}%`}
      cy={`${cy}%`}
      r="4"
      fill={color}
      opacity={opacity}
      style={{ filter: `drop-shadow(0 0 8px ${color})` }}
    />
  )
}

// --- Main Composition ---

interface ResumeGraphAnimationProps {
  theme?: 'light' | 'dark'
}

export const ResumeGraphAnimation: React.FC<ResumeGraphAnimationProps> = ({ theme = 'dark' }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const isLight = theme === 'light'

  // Theme-dependent colors
  const nodeBg = isLight ? '#ffffff' : '#0f172a'
  const centerBorder = isLight ? '#3CC8E8' : '#22d3ee'
  const centerGlowBase = isLight ? 'rgba(8, 145, 178, 0.3)' : 'rgba(6, 182, 212, 0.4)'
  const centerShadow = isLight
    ? '0 4px 24px rgba(60, 200, 232, 0.3), 0 1px 4px rgba(0,0,0,0.06)'
    : '0 0 50px rgba(6, 182, 212, 0.6), inset 0 0 20px rgba(6, 182, 212, 0.3)'
  const labelBg = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)'
  const labelBorder = isLight ? 'rgba(60, 200, 232, 0.4)' : 'rgba(6, 182, 212, 0.3)'
  const labelColor = isLight ? '#0e7490' : '#22d3ee'
  const badgeBg = isLight ? '#3CC8E8' : '#22d3ee'
  const badgeTextColor = isLight ? 'white' : '#0f172a'
  const badgeBorder = isLight ? '#ffffff' : '#0f172a'
  const gridDotColor = isLight ? 'rgba(60,200,232,0.2)' : 'rgba(148,163,184,0.3)'
  const dotColor = isLight ? '#3CC8E8' : '#22d3ee'

  // --- Grid dot pattern fade in (0-15) ---
  const gridOpacity = interpolate(frame, [0, 15], [0, 0.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // --- Center glow bloom (5-25) ---
  const glowScale = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const glowPulse = frame > 25 ? 1 + Math.sin(frame * 0.06) * 0.15 : glowScale

  // --- Center node spring in (15-45) ---
  const centerScale = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 12, stiffness: 80 },
  })

  // --- Verified badge bounce in (25-40) ---
  const badgeScale = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 8, stiffness: 120 },
  })

  // --- Line drawing (40-75) with stagger ---
  const lineDrawProgress = NODES.map((_, i) => {
    const lineStart = 40 + i * 8
    return interpolate(frame, [lineStart, lineStart + 25], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  })

  // --- Corner nodes spring in (55-100) with stagger ---
  const nodeScales = NODES.map((_, i) => {
    const nodeStart = 55 + i * 8
    return spring({
      frame: Math.max(0, frame - nodeStart),
      fps,
      config: { damping: 10, stiffness: 90 },
    })
  })

  // --- Badge counts bounce in (80-120) with stagger ---
  const badgeCountScales = NODES.map((_, i) => {
    const badgeStart = 80 + i * 10
    return spring({
      frame: Math.max(0, frame - badgeStart),
      fps,
      config: { damping: 8, stiffness: 120 },
    })
  })

  // --- Continuous floating motion (100+) ---
  const getFloatY = (index: number) => {
    if (frame < 100) return 0
    const speed = 0.03 + index * 0.008
    const amplitude = 8 + index * 2
    return Math.sin((frame - 100) * speed + index * 1.5) * amplitude
  }

  // --- Center node label text ---
  const centerLabelOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Center glow breathing (continuous)
  const centerGlowIntensity = frame > 45
    ? 0.4 + Math.sin(frame * 0.04) * 0.15
    : interpolate(frame, [15, 45], [0, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      {/* Grid dot pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: gridOpacity,
          backgroundSize: '40px 40px',
          backgroundImage: `radial-gradient(circle, ${gridDotColor} 1px, transparent 1px)`,
        }}
      />

      {/* Cyan center glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${glowPulse})`,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: isLight
            ? 'radial-gradient(circle, rgba(8, 145, 178, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* SVG layer for lines and traveling dots */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {NODES.map((node, i) => (
            <linearGradient
              key={`grad-${i}`}
              id={`line-grad-${i}`}
              x1="50%"
              y1="50%"
              x2={`${node.x}%`}
              y2={`${node.y}%`}
            >
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="100%" stopColor={node.color} stopOpacity="0.8" />
            </linearGradient>
          ))}
        </defs>

        {/* Drawing lines from center to corners */}
        {NODES.map((node, i) => {
          const lineLen = 200 // approximate length for dashoffset
          const dashOffset = (1 - lineDrawProgress[i]) * lineLen

          return (
            <line
              key={`line-${i}`}
              x1="50%"
              y1="50%"
              x2={`${node.x}%`}
              y2={`${node.y}%`}
              stroke={`url(#line-grad-${i})`}
              strokeWidth="2"
              strokeDasharray={lineLen}
              strokeDashoffset={dashOffset}
            />
          )
        })}

        {/* Traveling dots along lines */}
        {frame >= 100 && NODES.map((node, i) => (
          <TravelingDot
            key={`dot-${i}`}
            fromX={50}
            fromY={50}
            toX={node.x}
            toY={node.y}
            delay={i * 30}
            speed={0.006 + i * 0.001}
            color={dotColor}
          />
        ))}
      </svg>

      {/* Center node - プロフィール */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${centerScale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 20,
        }}
      >
        <div style={{ position: 'relative' }}>
          {/* Center glow pulse */}
          <div
            style={{
              position: 'absolute',
              inset: -20,
              borderRadius: '50%',
              background: centerGlowBase,
              filter: 'blur(30px)',
              opacity: centerGlowIntensity,
            }}
          />
          {/* Circle */}
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              backgroundColor: nodeBg,
              border: `2.5px solid ${centerBorder}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 10,
              boxShadow: centerShadow,
            }}
          >
            <PersonIcon size={120} />
            {/* Verified badge */}
            <div
              style={{
                position: 'absolute',
                bottom: 14,
                right: 14,
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: badgeBg,
                border: `4px solid ${badgeBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${badgeScale})`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              <VerifiedIcon size={28} />
            </div>
          </div>
        </div>
        {/* Label */}
        <div
          style={{
            marginTop: 16,
            padding: '8px 24px',
            borderRadius: 999,
            backgroundColor: labelBg,
            border: `1px solid ${labelBorder}`,
            backdropFilter: 'blur(12px)',
            boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.1)' : '0 4px 12px rgba(0,0,0,0.5)',
            opacity: centerLabelOpacity,
          }}
        >
          <span
            style={{
              color: labelColor,
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: '0.05em',
              fontFamily: "'Noto Sans JP', system-ui, sans-serif",
            }}
          >
            プロフィール
          </span>
        </div>
      </div>

      {/* Corner nodes */}
      {NODES.map((node, i) => {
        const floatY = getFloatY(i)
        const isLeft = node.x < 50
        const isTop = node.y < 50
        const translateX = isLeft ? '-50%' : '50%'
        const translateY = isTop ? '-50%' : '50%'

        return (
          <div
            key={`node-${i}`}
            style={{
              position: 'absolute',
              top: isTop ? `${node.y}%` : undefined,
              bottom: !isTop ? `${100 - node.y}%` : undefined,
              left: isLeft ? `${node.x}%` : undefined,
              right: !isLeft ? `${100 - node.x}%` : undefined,
              transform: `translate(${translateX}, ${translateY}) scale(${nodeScales[i]}) translateY(${floatY}px)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 20,
            }}
          >
            <div style={{ position: 'relative' }}>
              {/* Node box */}
              <div
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 28,
                  backgroundColor: nodeBg,
                  border: isLight ? `2px solid ${node.color}` : `1px solid ${node.color}50`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isLight
                    ? `0 4px 20px ${node.color}30, 0 1px 4px rgba(0,0,0,0.08)`
                    : `0 0 30px ${node.glowColor}, inset 0 0 10px ${node.color}33`,
                }}
              >
                {node.icon}
              </div>
            </div>
            {/* Label */}
            {node.label && (
              <span
                style={{
                  marginTop: 14,
                  fontSize: 36,
                  fontWeight: 700,
                  color: isLight ? node.color : node.color,
                  letterSpacing: '0.04em',
                  opacity: 0.9,
                  fontFamily: "'Noto Sans JP', system-ui, sans-serif",
                }}
              >
                {node.label}
              </span>
            )}
          </div>
        )
      })}

      {/* Static pulsing dots on lines (midpoints) - continuous */}
      {frame >= 100 && (
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {NODES.map((node, i) => {
            const midX = (50 + node.x) / 2
            const midY = (50 + node.y) / 2
            const pulseOpacity = 0.5 + Math.sin(frame * 0.08 + i * 1.2) * 0.4
            return (
              <circle
                key={`pulse-${i}`}
                cx={`${midX}%`}
                cy={`${midY}%`}
                r="3.5"
                fill={dotColor}
                opacity={pulseOpacity}
                style={{ filter: `drop-shadow(0 0 6px ${dotColor})` }}
              />
            )
          })}
        </svg>
      )}
    </AbsoluteFill>
  )
}
