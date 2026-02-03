import React from 'react'
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion'

interface FeaturesShowcaseMobileProps {
  theme?: 'light' | 'dark'
}

// ── Theme colors (shared with desktop) ──
const getThemeColors = (isLight: boolean) => ({
  cardBg: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(30,41,59,0.9)',
  titleColor: isLight ? '#0f172a' : '#f8fafc',
  descColor: isLight ? '#475569' : '#cbd5e1',
  sectionTitleColor: isLight ? '#0f172a' : '#f8fafc',
  subtitleColor: isLight ? '#64748b' : '#94a3b8',
  dotGridColor: isLight ? 'rgba(60,200,232,0.08)' : 'rgba(148,163,184,0.1)',
  connectionLineColor: isLight
    ? 'rgba(60,200,232,0.15)'
    : 'rgba(34,211,238,0.15)',
  orbCyan: isLight ? 'rgba(8,145,178,0.06)' : 'rgba(6,182,212,0.08)',
  orbPurple: isLight ? 'rgba(147,51,234,0.05)' : 'rgba(139,92,246,0.06)',
})

// ── Card data ──
const CARDS = [
  {
    title: 'AI自動生成',
    desc: '候補者の経歴情報から、AIが高品質な\n履歴書・職務経歴書を自動生成。\n添削・修正の工数を大幅に削減します。',
    color: '#22d3ee',
    glowColor: 'rgba(34,211,238,0.15)',
  },
  {
    title: '通過率アップ',
    desc: '採用トレンドを分析したAIが、\n通過率の高い表現・構成を自動提案。\n貴社の紹介実績向上に貢献します。',
    color: '#22c55e',
    glowColor: 'rgba(34,197,94,0.15)',
  },
  {
    title: '万全のセキュリティ',
    desc: '金融機関レベルのデータ暗号化を採用。\n候補者の個人情報を厳重に保護し、\nコンプライアンスにも対応しています。',
    color: '#a855f7',
    glowColor: 'rgba(168,85,247,0.15)',
  },
]

// ── Mobile layout: 400 x 1400, cards stacked vertically ──
const COMP_W = 400
const CARD_W = 340
const CARD_H = 340
const CARD_GAP = 28
const CARD_LEFT = (COMP_W - CARD_W) / 2
const TITLE_Y = 40
const SUBTITLE_Y = 105
const FIRST_CARD_Y = 165

// ── SVG Icons (same as desktop, frame-offset adjusted per card) ──

const DocumentIcon: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const docOutline = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const foldDraw = interpolate(frame, [10, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const line1 = interpolate(frame, [15, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const line2 = interpolate(frame, [18, 23], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const line3 = interpolate(frame, [21, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const sparkleProgress = interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const sparkleScale = interpolate(sparkleProgress, [0, 0.5, 0.7, 1], [0, 1.3, 0.9, 1])
  const sparkleRotate = interpolate(sparkleProgress, [0, 1], [0, 30])
  const sparkleGlow = frame >= 40 ? 0.5 + Math.sin(frame * 0.06) * 0.3 : interpolate(frame, [20, 35], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <svg viewBox="0 0 80 80" width="70" height="70">
      <path d="M20 10 L50 10 L60 20 L60 70 L20 70 Z" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={200} strokeDashoffset={200 * (1 - docOutline)} />
      <path d="M50 10 L50 20 L60 20" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={60} strokeDashoffset={60 * (1 - foldDraw)} />
      <line x1="28" y1="34" x2="52" y2="34" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={line1} />
      <line x1="28" y1="44" x2="48" y2="44" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={line2} />
      <line x1="28" y1="54" x2="44" y2="54" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={line3} />
      {[{ x: 62, y: 8, s: 0.8 }, { x: 16, y: 58, s: 0.6 }, { x: 64, y: 42, s: 0.7 }].map((sp, i) => (
        <g key={i} transform={`translate(${sp.x}, ${sp.y}) scale(${sparkleScale * sp.s}) rotate(${sparkleRotate})`} opacity={sparkleGlow}>
          <path d="M0 -6 L1.5 -1.5 L6 0 L1.5 1.5 L0 6 L-1.5 1.5 L-6 0 L-1.5 -1.5 Z" fill={color} />
        </g>
      ))}
    </svg>
  )
}

const ChartIcon: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const axisDraw = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const bar1H = interpolate(frame, [10, 20], [0, 28], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const bar2H = interpolate(frame, [13, 23], [0, 45], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const bar3H = interpolate(frame, [16, 26], [0, 62], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const arrowProgress = interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const arrowScale = interpolate(arrowProgress, [0, 0.5, 0.7, 1], [0, 1.2, 0.95, 1])
  const arrowOpacity = interpolate(arrowProgress, [0, 0.3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const sparkOpacity = interpolate(frame, [30, 35, 40, 50], [0, 1, 1, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const sparkScale = frame >= 40 ? 0.8 + Math.sin(frame * 0.05) * 0.2 : interpolate(frame, [30, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <svg viewBox="0 0 80 80" width="70" height="70">
      <path d="M15 15 L15 65 L65 65" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={120} strokeDashoffset={120 * (1 - axisDraw)} />
      <rect x="24" y={65 - bar1H} width="10" height={bar1H} rx="2" fill={color} opacity="0.6" />
      <rect x="38" y={65 - bar2H} width="10" height={bar2H} rx="2" fill={color} opacity="0.75" />
      <rect x="52" y={65 - bar3H} width="10" height={bar3H} rx="2" fill={color} opacity="0.9" />
      <g transform={`translate(58, ${65 - bar3H - 8}) scale(${arrowScale})`} opacity={arrowOpacity}>
        <path d="M-8 8 L0 -4 L8 8" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="0" y1="-4" x2="0" y2="14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <g transform={`translate(62, ${65 - bar3H - 18}) scale(${sparkScale})`} opacity={sparkOpacity}>
        <path d="M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2 Z" fill={color} />
      </g>
    </svg>
  )
}

const ShieldIcon: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const shieldDraw = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const shieldFill = interpolate(frame, [10, 20], [0, 0.15], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const lockProgress = interpolate(frame, [15, 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const lockScale = interpolate(lockProgress, [0, 0.5, 0.7, 1], [0, 1.2, 0.95, 1])
  const checkDraw = interpolate(frame, [25, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const orbitAngle1 = frame >= 40 ? (frame - 40) * 0.02 : 0
  const orbitAngle2 = orbitAngle1 + Math.PI
  const orbitOpacity = interpolate(frame, [40, 50], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <svg viewBox="0 0 80 80" width="70" height="70">
      <path d="M40 8 L62 18 C62 18 64 45 40 72 C16 45 18 18 18 18 Z" fill={color} fillOpacity={shieldFill} stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={220} strokeDashoffset={220 * (1 - shieldDraw)} />
      <g transform={`translate(40, 38) scale(${lockScale})`} opacity={lockProgress}>
        <rect x="-8" y="-2" width="16" height="13" rx="2" fill={color} opacity="0.8" />
        <path d="M-5 -2 L-5 -8 C-5 -13 5 -13 5 -8 L5 -2" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="0" cy="4" r="2" fill="white" opacity="0.9" />
      </g>
      <path d="M32 56 L38 62 L50 50" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={30} strokeDashoffset={30 * (1 - checkDraw)} opacity={checkDraw} />
      {frame >= 40 && (
        <>
          <circle cx={40 + Math.cos(orbitAngle1) * 32} cy={40 + Math.sin(orbitAngle1) * 32} r="2.5" fill={color} opacity={orbitOpacity} />
          <circle cx={40 + Math.cos(orbitAngle2) * 32} cy={40 + Math.sin(orbitAngle2) * 32} r="2.5" fill={color} opacity={orbitOpacity * 0.7} />
        </>
      )}
    </svg>
  )
}

const ICON_COMPONENTS = [DocumentIcon, ChartIcon, ShieldIcon]

// ── Single Mobile Card ──
const MobileCard: React.FC<{
  cardIndex: number
  frame: number
  fps: number
  isLight: boolean
  colors: ReturnType<typeof getThemeColors>
}> = ({ cardIndex, frame, fps, isLight, colors }) => {
  const card = CARDS[cardIndex]
  const y = FIRST_CARD_Y + cardIndex * (CARD_H + CARD_GAP)

  // Staggered entrance — each card starts 20 frames apart
  const cardStartFrame = 25 + cardIndex * 20
  const cardSpring = spring({
    frame: frame - cardStartFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  })
  const cardScale = interpolate(cardSpring, [0, 1], [0.88, 1])
  const cardTranslateY = interpolate(cardSpring, [0, 1], [50, 0])
  const cardOpacity = interpolate(frame, [cardStartFrame, cardStartFrame + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Icon animation — relative to card entrance
  const iconFrame = Math.max(0, frame - (cardStartFrame + 5))

  // Text fade-in
  const textStart = cardStartFrame + 15
  const titleOpacity = interpolate(frame, [textStart, textStart + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const titleTranslateY = interpolate(frame, [textStart, textStart + 12], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const descOpacity = interpolate(frame, [textStart + 5, textStart + 17], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Continuous float
  const steadyFrame = cardStartFrame + 50
  const floatY = frame >= steadyFrame ? Math.sin(frame * 0.03 + cardIndex) * 3 : 0
  const iconGlow = frame >= steadyFrame
    ? 0.3 + Math.sin(frame * 0.04 + cardIndex * 1.5) * 0.2
    : interpolate(frame, [cardStartFrame + 10, cardStartFrame + 30], [0, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Border glow
  const borderAngle = frame >= steadyFrame ? frame * 1.5 + cardIndex * 120 : 0
  const borderOpacity = frame >= steadyFrame
    ? 0.25 + Math.sin(frame * 0.02 + cardIndex) * 0.1
    : interpolate(frame, [cardStartFrame, cardStartFrame + 20], [0, 0.2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const borderColor = isLight ? `${card.color}50` : `${card.color}40`
  const IconComponent = ICON_COMPONENTS[cardIndex]

  return (
    <div
      style={{
        position: 'absolute',
        left: CARD_LEFT,
        top: y + cardTranslateY + floatY,
        width: CARD_W,
        height: CARD_H,
        opacity: cardOpacity,
        transform: `scale(${cardScale})`,
        transformOrigin: 'center top',
      }}
    >
      {/* Animated border glow */}
      <div
        style={{
          position: 'absolute',
          inset: -2,
          borderRadius: 26,
          background: `conic-gradient(from ${borderAngle}deg, ${card.color}00, ${card.color}, ${card.color}00, ${card.color}, ${card.color}00)`,
          opacity: borderOpacity,
          filter: 'blur(1px)',
        }}
      />

      {/* Card body */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 24,
          backgroundColor: colors.cardBg,
          border: `1.5px solid ${borderColor}`,
          boxShadow: `0 8px 32px rgba(0,0,0,${isLight ? 0.1 : 0.25})`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '0 24px',
          gap: 20,
        }}
      >
        {/* Left: icon with glow */}
        <div style={{ position: 'relative', flexShrink: 0, width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              position: 'absolute',
              inset: -20,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${card.glowColor} 0%, transparent 70%)`,
              filter: 'blur(20px)',
              opacity: iconGlow,
            }}
          />
          <IconComponent frame={iconFrame} color={card.color} />
        </div>

        {/* Right: text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: colors.titleColor,
              fontFamily: "'Noto Sans JP', system-ui, sans-serif",
              marginBottom: 8,
              opacity: titleOpacity,
              transform: `translateY(${titleTranslateY}px)`,
            }}
          >
            {card.title}
          </div>
          <div
            style={{
              fontSize: 13,
              lineHeight: 1.7,
              color: colors.descColor,
              fontFamily: "'Noto Sans JP', system-ui, sans-serif",
              whiteSpace: 'pre-line',
              opacity: descOpacity,
            }}
          >
            {card.desc}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Vertical connection lines between cards ──
const MobileConnectionLines: React.FC<{
  frame: number
  connectionColor: string
}> = ({ frame, connectionColor }) => {
  const lineOpacity = interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const dashProgress = interpolate(frame, [80, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const cx = COMP_W / 2
  const lineLength = CARD_GAP

  return (
    <svg style={{ position: 'absolute', top: 0, left: 0, width: COMP_W, height: 1400, pointerEvents: 'none' }}>
      {[0, 1].map((i) => {
        const y1 = FIRST_CARD_Y + (i + 1) * CARD_H + i * CARD_GAP
        const y2 = y1 + CARD_GAP
        const t = frame >= 100 ? ((frame - 100) * 0.01 + i * 0.5) % 1 : 0
        const dotOpacity = interpolate(frame, [100, 110], [0, 0.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        return (
          <React.Fragment key={i}>
            <line
              x1={cx}
              y1={y1}
              x2={cx}
              y2={y2}
              stroke={connectionColor}
              strokeWidth="1.5"
              strokeDasharray="6 8"
              strokeDashoffset={lineLength * (1 - dashProgress)}
              opacity={lineOpacity}
            />
            {frame >= 100 && (
              <circle
                cx={cx}
                cy={y1 + (y2 - y1) * t}
                r="3"
                fill={connectionColor.replace('0.15', '0.6')}
                opacity={dotOpacity}
                style={{ filter: `drop-shadow(0 0 4px ${connectionColor.replace('0.15', '0.4')})` }}
              />
            )}
          </React.Fragment>
        )
      })}
    </svg>
  )
}

// ── Floating particles ──
const MobileParticles: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < 90) return null
  const opacity = interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const particles = [
    { cardIdx: 0, ox: -25, oy: -15, size: 3.5, phase: 0, speed: 0.025 },
    { cardIdx: 0, ox: 40, oy: 20, size: 2.5, phase: 2, speed: 0.03 },
    { cardIdx: 1, ox: -20, oy: 15, size: 3, phase: 1, speed: 0.028 },
    { cardIdx: 1, ox: 35, oy: -20, size: 2.5, phase: 3.5, speed: 0.032 },
    { cardIdx: 2, ox: 25, oy: -18, size: 3.5, phase: 0.8, speed: 0.026 },
    { cardIdx: 2, ox: -30, oy: 25, size: 2.5, phase: 2.5, speed: 0.03 },
  ]

  return (
    <>
      {particles.map((p, i) => {
        const cardCX = COMP_W / 2
        const cardCY = FIRST_CARD_Y + p.cardIdx * (CARD_H + CARD_GAP) + CARD_H / 2
        const x = cardCX + p.ox + Math.sin(frame * p.speed + p.phase) * 15
        const y = cardCY + p.oy + Math.cos(frame * p.speed * 0.8 + p.phase) * 12
        const breathe = 0.5 + Math.sin(frame * 0.04 + p.phase) * 0.3
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: p.size * 2,
              height: p.size * 2,
              borderRadius: '50%',
              backgroundColor: CARDS[p.cardIdx].color,
              opacity: opacity * breathe,
              filter: 'blur(1px)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        )
      })}
    </>
  )
}

// ── Main Mobile Composition ──
export const FeaturesShowcaseMobile: React.FC<FeaturesShowcaseMobileProps> = ({
  theme = 'dark',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const isLight = theme === 'light'
  const colors = getThemeColors(isLight)

  // Title spring
  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 80, mass: 0.8 } })
  const titleTranslateY = interpolate(titleSpring, [0, 1], [40, 0])
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Subtitle
  const subtitleOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const subtitleTranslateY = interpolate(frame, [10, 25], [25, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Dot grid
  const gridOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Gradient orbs
  const orb1Y = 30 + Math.cos(frame * 0.006) * 8
  const orb2Y = 70 + Math.cos(frame * 0.009 + 1) * 6
  const orbBreath = 0.8 + Math.sin(frame * 0.03) * 0.2
  const orbFadeIn = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', fontFamily: "'Noto Sans JP', system-ui, sans-serif" }}>
      {/* Dot Grid */}
      <div style={{ position: 'absolute', inset: 0, opacity: gridOpacity * 0.25, backgroundSize: '28px 28px', backgroundImage: `radial-gradient(circle, ${colors.dotGridColor} 1px, transparent 1px)` }} />

      {/* Gradient Orbs */}
      <div style={{ position: 'absolute', left: '30%', top: `${orb1Y}%`, width: 250, height: 250, borderRadius: '50%', background: `radial-gradient(circle, ${colors.orbCyan} 0%, transparent 70%)`, filter: 'blur(60px)', transform: `translate(-50%, -50%) scale(${orbBreath})`, opacity: orbFadeIn, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: '70%', top: `${orb2Y}%`, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${colors.orbPurple} 0%, transparent 70%)`, filter: 'blur(50px)', transform: `translate(-50%, -50%) scale(${orbBreath * 0.9})`, opacity: orbFadeIn, pointerEvents: 'none' }} />

      {/* Title */}
      <div style={{ position: 'absolute', top: TITLE_Y, left: 0, right: 0, textAlign: 'center', opacity: titleOpacity, transform: `translateY(${titleTranslateY}px)` }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: colors.sectionTitleColor, letterSpacing: '-0.02em' }}>
          CareerBridgeの3つの強み
        </div>
      </div>

      {/* Subtitle */}
      <div style={{ position: 'absolute', top: SUBTITLE_Y, left: 20, right: 20, textAlign: 'center', opacity: subtitleOpacity, transform: `translateY(${subtitleTranslateY}px)` }}>
        <div style={{ fontSize: 14, color: colors.subtitleColor, fontWeight: 400, lineHeight: 1.6 }}>
          AI自動生成と万全のセキュリティで、{'\n'}貴社の紹介業務を強力にサポートします。
        </div>
      </div>

      {/* Connection Lines */}
      <MobileConnectionLines frame={frame} connectionColor={colors.connectionLineColor} />

      {/* Cards */}
      {[0, 1, 2].map((i) => (
        <MobileCard key={i} cardIndex={i} frame={frame} fps={fps} isLight={isLight} colors={colors} />
      ))}

      {/* Particles */}
      <MobileParticles frame={frame} />
    </AbsoluteFill>
  )
}
