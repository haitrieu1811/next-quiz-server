import { config } from 'dotenv'
config()

export const ENV_CONFIG = {
  HOST: process.env.PORT as string
} as const
