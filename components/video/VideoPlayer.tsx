'use client'

import { Player } from '@remotion/player'
import { HeroAnimation } from '@/remotion/compositions/HeroAnimation'
import { JobCardAnimation } from '@/remotion/compositions/JobCardAnimation'
import { StatsAnimation } from '@/remotion/compositions/StatsAnimation'
import { LogoIntro } from '@/remotion/compositions/LogoIntro'
import { ResumeGraphAnimation } from '@/remotion/compositions/ResumeGraphAnimation'
import { HeroTextAnimation } from '@/remotion/compositions/HeroTextAnimation'

type CompositionType = 'hero' | 'job-card' | 'stats' | 'logo' | 'resume-graph' | 'hero-text'

interface VideoPlayerProps {
  composition: CompositionType
  className?: string
  autoPlay?: boolean
  loop?: boolean
  showControls?: boolean
  theme?: 'light' | 'dark'
  // Props for each composition
  heroProps?: {
    title: string
    subtitle: string
  }
  jobProps?: {
    jobTitle: string
    company: string
    salary: string
  }
  statsProps?: {
    jobCount: number
    companies: number
    salaryIncrease: number
  }
}

const compositionConfig = {
  hero: {
    component: HeroAnimation,
    durationInFrames: 300,
    width: 1920,
    height: 1080,
    defaultProps: {
      title: 'CareerBridge',
      subtitle: '500,000+ 件の求人',
    },
  },
  'job-card': {
    component: JobCardAnimation,
    durationInFrames: 180,
    width: 1080,
    height: 1080,
    defaultProps: {
      jobTitle: 'シニアエンジニア',
      company: 'TechCorp',
      salary: '1000万円 - 1500万円',
    },
  },
  stats: {
    component: StatsAnimation,
    durationInFrames: 150,
    width: 1920,
    height: 1080,
    defaultProps: {
      jobCount: 524301,
      companies: 2000,
      salaryIncrease: 120,
    },
  },
  logo: {
    component: LogoIntro,
    durationInFrames: 90,
    width: 1920,
    height: 1080,
    defaultProps: {},
  },
  'resume-graph': {
    component: ResumeGraphAnimation,
    durationInFrames: 300,
    width: 960,
    height: 1080,
    defaultProps: {},
  },
  'hero-text': {
    component: HeroTextAnimation,
    durationInFrames: 300,
    width: 1080,
    height: 600,
    defaultProps: {},
  },
}

export default function VideoPlayer({
  composition,
  className,
  autoPlay = true,
  loop = true,
  showControls = false,
  theme,
  heroProps,
  jobProps,
  statsProps,
}: VideoPlayerProps) {
  const config = compositionConfig[composition]

  // Determine the input props based on composition type
  const getInputProps = () => {
    const themeProps = theme ? { theme } : {}
    switch (composition) {
      case 'hero':
        return { ...(heroProps || config.defaultProps), ...themeProps }
      case 'job-card':
        return { ...(jobProps || config.defaultProps), ...themeProps }
      case 'stats':
        return { ...(statsProps || config.defaultProps), ...themeProps }
      case 'logo':
        return { ...config.defaultProps, ...themeProps }
      case 'resume-graph':
        return { ...config.defaultProps, ...themeProps }
      case 'hero-text':
        return { ...config.defaultProps, ...themeProps }
      default:
        return { ...config.defaultProps, ...themeProps }
    }
  }

  return (
    <div className={className}>
      <Player
        component={config.component as React.ComponentType<Record<string, unknown>>}
        inputProps={getInputProps()}
        durationInFrames={config.durationInFrames}
        compositionWidth={config.width}
        compositionHeight={config.height}
        fps={30}
        style={{
          width: '100%',
          height: '100%',
        }}
        autoPlay={autoPlay}
        loop={loop}
        controls={showControls}
      />
    </div>
  )
}
