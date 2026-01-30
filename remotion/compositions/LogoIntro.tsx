import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from 'remotion'

export const LogoIntro: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Logo icon animation
  const iconScale = spring({
    frame,
    fps,
    config: {
      damping: 8,
      stiffness: 100,
    },
  })

  const iconRotation = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 80,
    },
  })

  // Text reveal
  const textOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const textX = interpolate(frame, [20, 40], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Glow pulse
  const glowIntensity = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [30, 60]
  )

  // Ring animations
  const ring1Scale = spring({
    frame: frame - 5,
    fps,
    config: {
      damping: 15,
      stiffness: 60,
    },
  })

  const ring2Scale = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 15,
      stiffness: 60,
    },
  })

  const ring1Opacity = interpolate(frame - 5, [0, 30, 60], [0, 0.5, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const ring2Opacity = interpolate(frame - 10, [0, 30, 60], [0, 0.3, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0b1120 0%, #0f172a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Animated background particles */}
      {[...Array(30)].map((_, i) => {
        const angle = (i / 30) * Math.PI * 2
        const radius = 200 + Math.sin(frame * 0.05 + i) * 50
        const x = Math.cos(angle + frame * 0.02) * radius
        const y = Math.sin(angle + frame * 0.02) * radius

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: i % 2 === 0 ? '#38bdf8' : '#f97316',
              opacity: 0.4,
              boxShadow: `0 0 15px ${i % 2 === 0 ? '#38bdf8' : '#f97316'}`,
            }}
          />
        )
      })}

      {/* Expanding rings */}
      <div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          border: '2px solid #38bdf8',
          opacity: ring1Opacity,
          transform: `scale(${ring1Scale * 2})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          border: '2px solid #f97316',
          opacity: ring2Opacity,
          transform: `scale(${ring2Scale * 2.5})`,
        }}
      />

      {/* Logo container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 40,
        }}
      >
        {/* Logo icon */}
        <Sequence from={0}>
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: 32,
              background: 'linear-gradient(135deg, #38bdf8, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${iconScale}) rotate(${(1 - iconRotation) * 180}deg)`,
              boxShadow: `0 0 ${glowIntensity}px rgba(56, 189, 248, 0.6), 0 20px 40px rgba(0, 0, 0, 0.3)`,
            }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
        </Sequence>

        {/* Text */}
        <Sequence from={20}>
          <div
            style={{
              opacity: textOpacity,
              transform: `translateX(${textX}px)`,
            }}
          >
            <div
              style={{
                fontSize: 96,
                fontWeight: 900,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: -2,
              }}
            >
              <span style={{ color: 'white' }}>Career</span>
              <span
                style={{
                  background: 'linear-gradient(90deg, #38bdf8, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Bridge
              </span>
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 500,
                color: '#64748b',
                marginTop: 8,
                letterSpacing: 8,
                textTransform: 'uppercase',
              }}
            >
              あなたのキャリアを、次のステージへ
            </div>
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  )
}
