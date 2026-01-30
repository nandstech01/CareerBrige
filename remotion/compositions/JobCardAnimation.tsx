import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from 'remotion'

interface JobCardAnimationProps {
  jobTitle: string
  company: string
  salary: string
}

export const JobCardAnimation: React.FC<JobCardAnimationProps> = ({
  jobTitle,
  company,
  salary,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Card entrance animation
  const cardScale = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
    },
  })

  const cardOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  })

  // Content stagger animations
  const titleOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const titleY = interpolate(frame, [15, 35], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const companyOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const salaryOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const salaryScale = spring({
    frame: frame - 35,
    fps,
    config: {
      damping: 10,
      stiffness: 150,
    },
  })

  // Glow pulse
  const glowIntensity = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [20, 40]
  )

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0b1120 0%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background particles */}
      {[...Array(20)].map((_, i) => {
        const particleY = interpolate(
          frame,
          [0, 180],
          [100, -20],
          { extrapolateRight: 'clamp' }
        )
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${(i * 17) % 100}%`,
              top: `${particleY + (i * 7) % 50}%`,
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: i % 2 === 0 ? '#38bdf8' : '#f97316',
              opacity: 0.3,
              boxShadow: `0 0 10px ${i % 2 === 0 ? '#38bdf8' : '#f97316'}`,
            }}
          />
        )
      })}

      {/* Card */}
      <div
        style={{
          width: 800,
          padding: 60,
          backgroundColor: 'rgba(19, 28, 42, 0.95)',
          borderRadius: 32,
          border: '2px solid rgba(56, 189, 248, 0.3)',
          boxShadow: `0 0 ${glowIntensity}px rgba(56, 189, 248, 0.3), 0 25px 50px rgba(0, 0, 0, 0.5)`,
          opacity: cardOpacity,
          transform: `scale(${cardScale})`,
        }}
      >
        {/* Top accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #38bdf8, #f97316, #38bdf8)',
            borderRadius: '32px 32px 0 0',
          }}
        />

        {/* Icon */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 24,
            background: 'linear-gradient(135deg, #38bdf8, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
            boxShadow: '0 0 30px rgba(56, 189, 248, 0.4)',
          }}
        >
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>

        {/* Job Title */}
        <Sequence from={15}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: 'white',
              marginBottom: 16,
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {jobTitle}
          </div>
        </Sequence>

        {/* Company */}
        <Sequence from={25}>
          <div
            style={{
              fontSize: 32,
              color: '#94a3b8',
              marginBottom: 40,
              opacity: companyOpacity,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {company}
          </div>
        </Sequence>

        {/* Tags */}
        <Sequence from={30}>
          <div
            style={{
              display: 'flex',
              gap: 16,
              marginBottom: 40,
              opacity: companyOpacity,
            }}
          >
            {['正社員', 'リモート可', 'フレックス'].map((tag, i) => (
              <span
                key={i}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: 12,
                  color: '#38bdf8',
                  fontSize: 20,
                  fontWeight: 600,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </Sequence>

        {/* Salary */}
        <Sequence from={35}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: '#38bdf8',
              opacity: salaryOpacity,
              transform: `scale(${salaryScale})`,
              textShadow: '0 0 20px rgba(56, 189, 248, 0.5)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {salary}
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  )
}
