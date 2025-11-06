import { FastifyInstance } from 'fastify'
import { calculateDistance } from '../utils/distance.js'

interface PlacesQuery {
  q?: string
  type?: string
  minRating?: string
  maxDistance?: string
  interests?: string
}

interface NearbyQuery {
  lat: string
  lng: string
  radius?: string
}

interface RatingBody {
  rating: number
  comment?: string
}

export default async function placesRoutes(fastify: FastifyInstance) {
  // Get all places with filters
  fastify.get<{ Querystring: PlacesQuery }>('/', async (request) => {
    const { q, type, minRating, maxDistance, interests } = request.query

    const where: any = {}

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ]
    }

    if (type) {
      where.type = type
    }

    if (minRating) {
      where.rating = { gte: parseFloat(minRating) }
    }

    const places = await fastify.prisma.place.findMany({
      where,
      include: {
        pointsOfInterest: true,
        badge: true
      },
      orderBy: {
        rating: 'desc'
      }
    })

    // Format response
    return places.map(place => ({
      id: place.id,
      name: place.name,
      type: place.type,
      location: {
        lat: place.latitude,
        lng: place.longitude
      },
      rating: place.rating,
      ratingsCount: place.ratingsCount,
      description: place.description,
      mustSee: place.mustSee,
      visitTimes: place.visitTimes,
      bestTime: place.bestTime,
      photos: place.photos,
      pointsOfInterest: place.pointsOfInterest,
      badge: place.badge
    }))
  })

  // Get place by ID
  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const placeId = parseInt(request.params.id)

    const place = await fastify.prisma.place.findUnique({
      where: { id: placeId },
      include: {
        pointsOfInterest: true,
        badge: true
      }
    })

    if (!place) {
      return reply.status(404).send({ error: 'Place not found' })
    }

    return {
      id: place.id,
      name: place.name,
      type: place.type,
      location: {
        lat: place.latitude,
        lng: place.longitude
      },
      rating: place.rating,
      ratingsCount: place.ratingsCount,
      description: place.description,
      mustSee: place.mustSee,
      visitTimes: place.visitTimes,
      bestTime: place.bestTime,
      photos: place.photos,
      pointsOfInterest: place.pointsOfInterest,
      badge: place.badge
    }
  })

  // Get nearby places
  fastify.get<{ Querystring: NearbyQuery }>('/nearby', async (request) => {
    const { lat, lng, radius = '5000' } = request.query

    const userLat = parseFloat(lat)
    const userLng = parseFloat(lng)
    const maxRadius = parseInt(radius)

    const places = await fastify.prisma.place.findMany({
      include: {
        pointsOfInterest: true,
        badge: true
      }
    })

    // Calculate distances and filter
    const nearbyPlaces = places
      .map(place => {
        const distance = calculateDistance(
          userLat,
          userLng,
          place.latitude,
          place.longitude
        )

        return {
          ...place,
          distance
        }
      })
      .filter(place => place.distance <= maxRadius)
      .sort((a, b) => a.distance - b.distance)

    return nearbyPlaces.map(place => ({
      id: place.id,
      name: place.name,
      type: place.type,
      location: {
        lat: place.latitude,
        lng: place.longitude
      },
      rating: place.rating,
      ratingsCount: place.ratingsCount,
      description: place.description,
      mustSee: place.mustSee,
      visitTimes: place.visitTimes,
      bestTime: place.bestTime,
      photos: place.photos,
      pointsOfInterest: place.pointsOfInterest,
      badge: place.badge,
      distance: place.distance
    }))
  })

  // Rate a place
  fastify.post<{ Params: { id: string }, Body: RatingBody }>(
    '/:id/ratings',
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const placeId = parseInt(request.params.id)
      const { rating, comment } = request.body
      const userId = request.user!.id

      // Validate rating
      if (rating < 1 || rating > 5) {
        return reply.status(400).send({ error: 'Rating must be between 1 and 5' })
      }

      // Check if place exists
      const place = await fastify.prisma.place.findUnique({
        where: { id: placeId }
      })

      if (!place) {
        return reply.status(404).send({ error: 'Place not found' })
      }

      // Upsert rating
      const newRating = await fastify.prisma.rating.upsert({
        where: {
          userId_placeId: {
            userId,
            placeId
          }
        },
        update: {
          rating,
          comment
        },
        create: {
          userId,
          placeId,
          rating,
          comment
        }
      })

      // Recalculate place rating
      const ratings = await fastify.prisma.rating.findMany({
        where: { placeId }
      })

      const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length

      await fastify.prisma.place.update({
        where: { id: placeId },
        data: {
          rating: avgRating,
          ratingsCount: ratings.length
        }
      })

      return newRating
    }
  )
}
