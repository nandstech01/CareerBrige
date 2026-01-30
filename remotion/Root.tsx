import React from 'react'
import { Composition } from 'remotion'
import { HeroAnimation } from './compositions/HeroAnimation'
import { JobCardAnimation } from './compositions/JobCardAnimation'
import { StatsAnimation } from './compositions/StatsAnimation'
import { LogoIntro } from './compositions/LogoIntro'
import { ResumeGraphAnimation } from './compositions/ResumeGraphAnimation'
import { HeroTextAnimation } from './compositions/HeroTextAnimation'

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Hero Animation - Full HD */}
      <Composition
        id="HeroAnimation"
        component={HeroAnimation as React.ComponentType}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'CareerBridge',
          subtitle: '500,000+ 件の求人',
        }}
      />

      {/* Job Card Showcase */}
      <Composition
        id="JobCardAnimation"
        component={JobCardAnimation as React.ComponentType}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          jobTitle: 'シニアエンジニア',
          company: 'TechCorp',
          salary: '1000万円 - 1500万円',
        }}
      />

      {/* Stats Counter Animation */}
      <Composition
        id="StatsAnimation"
        component={StatsAnimation as React.ComponentType}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          jobCount: 524301,
          companies: 2000,
          salaryIncrease: 120,
        }}
      />

      {/* Logo Intro */}
      <Composition
        id="LogoIntro"
        component={LogoIntro}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Resume Graph Animation */}
      <Composition
        id="ResumeGraphAnimation"
        component={ResumeGraphAnimation}
        durationInFrames={300}
        fps={30}
        width={960}
        height={1080}
      />

      {/* Hero Text Animation */}
      <Composition
        id="HeroTextAnimation"
        component={HeroTextAnimation}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={600}
      />
    </>
  )
}
