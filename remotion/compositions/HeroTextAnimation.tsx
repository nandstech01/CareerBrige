import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion'

const HEADING_LINES = ['書類作成を自動化し', '紹介効率を最大化']

const DESCRIPTION_LINES = [
  'AI × プロのノウハウで、候補者の応募書類を高品質に自動生成。',
  '書類作成の工数を削減し、',
  '紹介業務に集中できる環境を提供します。',
]

interface HeroTextAnimationProps {
  theme?: 'light' | 'dark'
}

export const HeroTextAnimation: React.FC<HeroTextAnimationProps> = ({ theme = 'dark' }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const isLight = theme === 'light'

  // --- Theme colors ---
  const headingColor = isLight ? '#0f172a' : 'white'
  const descColor = isLight ? '#475569' : '#cbd5e1'
  const glowColor = isLight
    ? 'rgba(18, 105, 226, 0.3)'
    : 'rgba(56, 189, 248, 0.5)'

  // --- Heading line animations ---
  const headingAnimations = HEADING_LINES.map((_, i) => {
    const delay = 5 + i * 18
    const progress = spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { damping: 14, stiffness: 70, mass: 1.2 },
    })
    const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
    const translateY = interpolate(progress, [0, 1], [60, 0])
    return { opacity, translateY }
  })

  // --- Description line animations ---
  const descAnimations = DESCRIPTION_LINES.map((_, i) => {
    const delay = 50 + i * 12
    const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
    const translateY = interpolate(frame, [delay, delay + 25], [30, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
    return { opacity, translateY }
  })

  // --- Subtle heading glow breathing (after entrance) ---
  const glowOpacity =
    frame > 60
      ? 0.4 + Math.sin((frame - 60) * 0.04) * 0.2
      : interpolate(frame, [30, 60], [0, 0.4], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
          padding: '40px 0',
        }}
      >
        {/* Heading */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {HEADING_LINES.map((line, i) => (
            <div
              key={i}
              style={{
                opacity: headingAnimations[i].opacity,
                transform: `translateY(${headingAnimations[i].translateY}px)`,
              }}
            >
              <span
                style={{
                  fontSize: 92,
                  fontWeight: 900,
                  color: headingColor,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  fontFamily: "'Manrope', 'Noto Sans JP', system-ui, sans-serif",
                  textShadow: isLight
                    ? 'none'
                    : `0 0 ${40 * glowOpacity}px ${glowColor}`,
                }}
              >
                {line}
              </span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            marginTop: 48,
          }}
        >
          {DESCRIPTION_LINES.map((line, i) => (
            <div
              key={i}
              style={{
                opacity: descAnimations[i].opacity,
                transform: `translateY(${descAnimations[i].translateY}px)`,
              }}
            >
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 500,
                  color: descColor,
                  lineHeight: 1.7,
                  fontFamily: "'Manrope', 'Noto Sans JP', system-ui, sans-serif",
                }}
              >
                {line}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  )
}
