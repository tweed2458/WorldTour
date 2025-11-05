import { PrismaClient } from '@prisma/client'
import { FastifyRequest } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }

  interface FastifyRequest {
    user?: {
      id: number
      email: string
    }
  }
}

export interface AuthRequest extends FastifyRequest {
  user: {
    id: number
    email: string
  }
}
