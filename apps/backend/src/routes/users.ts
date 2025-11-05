import { FastifyInstance } from 'fastify'
import { authenticate } from '../utils/auth.js'

interface UpdateInterestsBody {
  interests: string[]
}

interface AddVisitedBody {
  placeId: number
}

interface AddBadgeBody {
  badgeId: string
}

export default async function usersRoutes(fastify: FastifyInstance) {
  // Get current user
  fastify.get('/me', {
    onRequest: [authenticate]
  }, async (request) => {
    const userId = request.user!.id

    const user = await fastify.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        interests: true,
        visitedPlaces: true,
        createdAt: true
      }
    })

    if (!user) {
      return { error: 'User not found' }
    }

    // Get badges
    const badges = await fastify.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true }
    })

    // Get ratings
    const ratings = await fastify.prisma.rating.findMany({
      where: { userId }
    })

    return {
      ...user,
      badges: badges.map(ub => ({
        ...ub.badge,
        earnedAt: ub.earnedAt
      })),
      ratings
    }
  })

  // Update user interests
  fastify.put<{ Body: UpdateInterestsBody }>('/me/interests', {
    onRequest: [authenticate]
  }, async (request) => {
    const userId = request.user!.id
    const { interests } = request.body

    const user = await fastify.prisma.user.update({
      where: { id: userId },
      data: { interests },
      select: {
        id: true,
        name: true,
        email: true,
        interests: true,
        visitedPlaces: true
      }
    })

    // Get badges
    const badges = await fastify.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true }
    })

    // Get ratings
    const ratings = await fastify.prisma.rating.findMany({
      where: { userId }
    })

    return {
      ...user,
      badges: badges.map(ub => ({
        ...ub.badge,
        earnedAt: ub.earnedAt
      })),
      ratings
    }
  })

  // Add visited place
  fastify.post<{ Body: AddVisitedBody }>('/me/visited', {
    onRequest: [authenticate]
  }, async (request, reply) => {
    const userId = request.user!.id
    const { placeId } = request.body

    const user = await fastify.prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return reply.status(404).send({ error: 'User not found' })
    }

    // Add place to visited if not already there
    if (!user.visitedPlaces.includes(placeId)) {
      const updatedUser = await fastify.prisma.user.update({
        where: { id: userId },
        data: {
          visitedPlaces: [...user.visitedPlaces, placeId]
        },
        select: {
          id: true,
          name: true,
          email: true,
          interests: true,
          visitedPlaces: true
        }
      })

      // Get badges
      const badges = await fastify.prisma.userBadge.findMany({
        where: { userId },
        include: { badge: true }
      })

      // Get ratings
      const ratings = await fastify.prisma.rating.findMany({
        where: { userId }
      })

      return {
        ...updatedUser,
        badges: badges.map(ub => ({
          ...ub.badge,
          earnedAt: ub.earnedAt
        })),
        ratings
      }
    }

    // Get current user data
    const badges = await fastify.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true }
    })

    const ratings = await fastify.prisma.rating.findMany({
      where: { userId }
    })

    return {
      ...user,
      badges: badges.map(ub => ({
        ...ub.badge,
        earnedAt: ub.earnedAt
      })),
      ratings
    }
  })

  // Add badge
  fastify.post<{ Body: AddBadgeBody }>('/me/badges', {
    onRequest: [authenticate]
  }, async (request, reply) => {
    const userId = request.user!.id
    const { badgeId } = request.body

    // Check if badge exists
    const badge = await fastify.prisma.badge.findUnique({
      where: { id: badgeId }
    })

    if (!badge) {
      return reply.status(404).send({ error: 'Badge not found' })
    }

    // Check if user already has the badge
    const existing = await fastify.prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId
        }
      }
    })

    if (existing) {
      return { message: 'Badge already earned' }
    }

    // Add badge to user
    await fastify.prisma.userBadge.create({
      data: {
        userId,
        badgeId
      }
    })

    return { message: 'Badge earned successfully' }
  })
}
