import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from 'remotion'

interface StatsAnimationProps {
  jobCount: number
  companies: number
  salaryIncrease: number
}

// Animated counter component
const AnimatedCounter = ({
  value,
  suffix,
  startFrame,
  color,
}: {
  value: number
  suffix: string
  startFrame: number
  color: string
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const progress = interpolate(
    frame - startFrame,
    [0, 60],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  )

  const displayValue = Math.floor(value * progress)

  const scale = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 10,
      stiffness: 100,
    },
  })

  const opacity = interpolate(frame - startFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <span
        style={{
          fontSize: 120,
          fontWeight: 900,
          color,
          textShadow: `0 0 40px ${color}`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {displayValue.toLocaleString()}
      </span>
      <span
        style={{
          fontSize: 48,
          fontWeight: 600,
          color: '#94a3b8',
          marginLeft: 16,
        }}
      >
        {suffix}
      </span>
    </div>
  )
}

// Stat card component
const StatCard = ({
  label,
  children,
  delay,
  accentColor,
}: {
  label: string
  children: React.ReactNode
  delay: number
  accentColor: string
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const cardScale = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 12,
      stiffness: 80,
    },
  })

  const cardOpacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        backgroundColor: 'rgba(19, 28, 42, 0.9)',
        borderRadius: 24,
        padding: 48,
        border: `2px solid ${accentColor}30`,
        boxShadow: `0 0 30px ${accentColor}20, 0 20px 40px rgba(0, 0, 0, 0.3)`,
        opacity: cardOpacity,
        transform: `scale(${cardScale})`,
        textAlign: 'center',
        minWidth: 350,
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontWeight: 600,
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: 4,
          marginBottom: 24,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  )
}

export const StatsAnimation: React.FC<StatsAnimationProps> = ({
  jobCount,
  companies,
  salaryIncrease,
}) => {
  const frame = useCurrentFrame()

  // Animated background gradient
  const gradientPosition = interpolate(frame, [0, 150], [0, 100])

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${135 + frame * 0.5}deg, #0b1120 0%, #1e293b 50%, #0b1120 100%)`,
      }}
    >
      {/* Animated grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundSize: '60px 60px',
          backgroundImage:
            'linear-gradient(to right, rgba(56, 189, 248, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.5) 1px, transparent 1px)',
          transform: `translateY(${frame * 0.5}px)`,
        }}
      />

      {/* Glowing orbs */}
      <div
        style={{
          position: 'absolute',
          left: '10%',
          top: '20%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
          transform: `translate(${Math.sin(frame * 0.05) * 30}px, ${Math.cos(frame * 0.05) * 30}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '10%',
          bottom: '20%',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
          transform: `translate(${Math.cos(frame * 0.05) * 30}px, ${Math.sin(frame * 0.05) * 30}px)`,
        }}
      />

      {/* Title */}
      <Sequence from={0}>
        <div
          style={{
            position: 'absolute',
            top: 80,
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: 'white',
              opacity: interpolate(frame, [0, 20], [0, 1]),
              transform: `translateY(${interpolate(frame, [0, 20], [20, 0])}px)`,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            CareerBridge の実績
          </div>
        </div>
      </Sequence>

      {/* Stats cards container */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 60,
          height: '100%',
          padding: '120px 80px 80px',
        }}
      >
        {/* Job count */}
        <StatCard label="求人数" delay={10} accentColor="#38bdf8">
          <AnimatedCounter
            value={jobCount}
            suffix="件+"
            startFrame={20}
            color="#38bdf8"
          />
        </StatCard>

        {/* Companies */}
        <StatCard label="提携企業" delay={25} accentColor="#f97316">
          <AnimatedCounter
            value={companies}
            suffix="社+"
            startFrame={35}
            color="#f97316"
          />
        </StatCard>

        {/* Salary increase */}
        <StatCard label="年収アップ平均" delay={40} accentColor="#10b981">
          <div
            style={{
              opacity: interpolate(frame - 50, [0, 20], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            <span
              style={{
                fontSize: 80,
                fontWeight: 900,
                color: '#10b981',
                textShadow: '0 0 40px #10b981',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              +{salaryIncrease}
            </span>
            <span
              style={{
                fontSize: 48,
                fontWeight: 600,
                color: '#94a3b8',
                marginLeft: 8,
              }}
            >
              万円
            </span>
          </div>
        </StatCard>
      </div>
    </AbsoluteFill>
  )
}
