import { Config } from '@remotion/cli/config'

Config.setVideoImageFormat('jpeg')
Config.setOverwriteOutput(true)

// Set the output codec
Config.setCodec('h264')

// Enable caching for faster renders
Config.setCachingEnabled(true)
