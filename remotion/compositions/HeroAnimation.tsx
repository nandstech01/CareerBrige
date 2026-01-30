import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from 'remotion'

// Animated particle
const Particle = ({
  x,
  y,
  delay,
  color,
}: {
  x: number
  y: number
  delay: number
  color: string
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const animatedY = interpolate(
    frame - delay,
    [0, 60, 120],
    [y, y - 50, y],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  )

  const opacity = interpolate(
    frame - delay,
    [0, 30, 90, 120],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  )

  const scale = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 10,
      stiffness: 100,
    },
  })

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${animatedY}%`,
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: color,
        boxShadow: `0 0 20px ${color}`,
        opacity,
        transform: `scale(${scale})`,
      }}
    />
  )
}

// Animated wave path
const AnimatedWave = ({ delay, color }: { delay: number; color: string }) => {
  const frame = useCurrentFrame()

  const pathOffset = interpolate(frame - delay, [0, 300], [0, 1000], {
    extrapolateRight: 'clamp',
  })

  return (
    <svg
      viewBox="0 0 1920 200"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 200,
        opacity: 0.5,
      }}
    >
      <defs>
        <linearGradient id={`waveGrad-${delay}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d={`M0,100 C480,${50 + Math.sin(frame * 0.05) * 30} 960,${150 - Math.sin(frame * 0.05) * 30} 1440,100 L1440,200 L0,200 Z`}
        fill="none"
        stroke={`url(#waveGrad-${delay})`}
        strokeWidth="3"
        style={{
          filter: `drop-shadow(0 0 10px ${color})`,
        }}
      />
    </svg>
  )
}

interface HeroAnimationProps {
  title: string
  subtitle: string
}

export const HeroAnimation: React.FC<HeroAnimationProps> = ({
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  // Title animation
  const titleProgress = spring({
    frame,
    fps,
    config: {
      damping: 15,
      stiffness: 80,
    },
  })

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  })

  const titleY = interpolate(titleProgress, [0, 1], [50, 0])

  // Subtitle animation
  const subtitleOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const subtitleY = interpolate(frame, [30, 60], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Background gradient animation
  const gradientOffset = interpolate(frame, [0, durationInFrames], [0, 100])

  // Particles
  const particles = [
    { x: 20, y: 30, delay: 0, color: '#38bdf8' },
    { x: 80, y: 40, delay: 15, color: '#f97316' },
    { x: 40, y: 60, delay: 30, color: '#38bdf8' },
    { x: 70, y: 25, delay: 45, color: '#3b82f6' },
    { x: 30, y: 70, delay: 60, color: '#f97316' },
    { x: 60, y: 50, delay: 75, color: '#38bdf8' },
    { x: 85, y: 65, delay: 90, color: '#3b82f6' },
    { x: 15, y: 45, delay: 105, color: '#f97316' },
  ]

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #0b1120 0%, #0f172a ${50 + Math.sin(frame * 0.02) * 10}%, #0b1120 100%)`,
      }}
    >
      {/* Grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundSize: '50px 50px',
          backgroundImage:
            'linear-gradient(to right, rgba(56, 189, 248, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.3) 1px, transparent 1px)',
        }}
      />

      {/* Animated gradient orbs */}
      <div
        style={{
          position: 'absolute',
          left: `${20 + Math.sin(frame * 0.02) * 10}%`,
          top: `${30 + Math.cos(frame * 0.02) * 10}%`,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: `${20 + Math.cos(frame * 0.02) * 10}%`,
          bottom: `${20 + Math.sin(frame * 0.02) * 10}%`,
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.25) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Particles */}
      {particles.map((particle, index) => (
        <Particle key={index} {...particle} />
      ))}

      {/* Animated waves */}
      <AnimatedWave delay={0} color="#38bdf8" />
      <AnimatedWave delay={10} color="#f97316" />

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: 80,
        }}
      >
        {/* Title */}
        <Sequence from={0}>
          <div
            style={{
              fontSize: 140,
              fontWeight: 900,
              color: 'white',
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              textShadow: '0 0 60px rgba(56, 189, 248, 0.5)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
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
        </Sequence>

        {/* Subtitle */}
        <Sequence from={30}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              marginTop: 40,
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleY}px)`,
            }}
          >
            <div
              style={{
                width: 100,
                height: 2,
                background: 'linear-gradient(90deg, transparent, #f97316)',
              }}
            />
            <div
              style={{
                fontSize: 48,
                color: '#94a3b8',
                fontWeight: 300,
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              <span
                style={{
                  fontSize: 64,
                  fontWeight: 700,
                  color: '#38bdf8',
                  textShadow: '0 0 30px rgba(56, 189, 248, 0.5)',
                }}
              >
                {subtitle.split(' ')[0]}
              </span>{' '}
              {subtitle.split(' ').slice(1).join(' ')}
            </div>
            <div
              style={{
                width: 100,
                height: 2,
                background: 'linear-gradient(90deg, #f97316, transparent)',
              }}
            />
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  )
}
