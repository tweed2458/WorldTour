import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { PrismaClient } from '@prisma/client'

import authRoutes from './routes/auth.js'
import placesRoutes from './routes/places.js'
import usersRoutes from './routes/users.js'
import toursRoutes from './routes/tours.js'
import adminRoutes from './routes/admin.js'

const prisma = new PrismaClient()
const fastify = Fastify({
  logger: true
})

// Register plugins
await fastify.register(cors, {
  origin: true,
  credentials: true
})

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-this'
})

// Add Prisma to fastify instance
fastify.decorate('prisma', prisma)

// Add authentication decorator
fastify.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' })
  }
})

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// Register routes
fastify.register(authRoutes, { prefix: '/api/auth' })
fastify.register(placesRoutes, { prefix: '/api/places' })
fastify.register(usersRoutes, { prefix: '/api/users' })
fastify.register(toursRoutes, { prefix: '/api/tours' })
fastify.register(adminRoutes, { prefix: '/api/admin' })

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error)
  reply.status(error.statusCode || 500).send({
    error: error.message || 'Internal Server Error',
    statusCode: error.statusCode || 500
  })
})

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001')
    const host = process.env.HOST || '0.0.0.0'

    await fastify.listen({ port, host })
    console.log(`Server listening on ${host}:${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  await fastify.close()
  process.exit(0)
})
