import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { hashPassword, verifyPassword } from '../utils/auth.js'

interface LoginBody {
  email: string
  password: string
}

interface RegisterBody {
  name: string
  email: string
  password: string
}

export default async function authRoutes(fastify: FastifyInstance) {
  // Register
  fastify.post<{ Body: RegisterBody }>('/register', async (request, reply) => {
    const { name, email, password } = request.body

    // Check if user exists
    const existingUser = await fastify.prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return reply.status(400).send({ error: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await fastify.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        interests: true,
        visitedPlaces: true,
        createdAt: true
      }
    })

    // Generate JWT
    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email
    })

    return { user, token }
  })

  // Login
  fastify.post<{ Body: LoginBody }>('/login', async (request, reply) => {
    const { email, password } = request.body

    // Find user
    const user = await fastify.prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' })
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      return reply.status(401).send({ error: 'Invalid credentials' })
    }

    // Generate JWT
    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email
    })

    // Get user badges
    const badges = await fastify.prisma.userBadge.findMany({
      where: { userId: user.id },
      include: { badge: true }
    })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        interests: user.interests,
        visitedPlaces: user.visitedPlaces,
        badges: badges.map(ub => ({
          ...ub.badge,
          earnedAt: ub.earnedAt
        })),
        ratings: []
      },
      token
    }
  })

  // Verify token
  fastify.get('/verify', {
    onRequest: [fastify.authenticate]
  }, async (request) => {
    return { user: request.user }
  })
}
