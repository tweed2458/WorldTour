import { FastifyInstance } from 'fastify'
import { calculateDistance } from '../utils/distance.js'

interface GenerateTourBody {
  duration: number
  interests: string[]
  location?: {
    lat: number
    lng: number
  }
}

export default async function toursRoutes(fastify: FastifyInstance) {
  // Get all tours
  fastify.get('/', async () => {
    const tours = await fastify.prisma.tour.findMany({
      orderBy: { createdAt: 'desc' }
    })

    // Fetch places for each tour
    const toursWithPlaces = await Promise.all(
      tours.map(async (tour) => {
        const places = await fastify.prisma.place.findMany({
          where: {
            id: { in: tour.placeIds }
          },
          include: {
            badge: true,
            pointsOfInterest: true
          }
        })

        // Maintain order from placeIds
        const orderedPlaces = tour.placeIds.map(id =>
          places.find(p => p.id === id)
        ).filter(Boolean)

        return {
          id: tour.id,
          name: tour.name,
          description: tour.description,
          duration: tour.duration,
          distance: tour.distance,
          userPreferences: tour.userPreferences,
          places: orderedPlaces.map(place => ({
            id: place!.id,
            name: place!.name,
            type: place!.type,
            location: {
              lat: place!.latitude,
              lng: place!.longitude
            },
            rating: place!.rating,
            ratingsCount: place!.ratingsCount,
            description: place!.description,
            mustSee: place!.mustSee,
            visitTimes: place!.visitTimes,
            bestTime: place!.bestTime,
            photos: place!.photos,
            pointsOfInterest: place!.pointsOfInterest,
            badge: place!.badge
          }))
        }
      })
    )

    return toursWithPlaces
  })

  // Get tour by ID
  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const tourId = parseInt(request.params.id)

    const tour = await fastify.prisma.tour.findUnique({
      where: { id: tourId }
    })

    if (!tour) {
      return reply.status(404).send({ error: 'Tour not found' })
    }

    // Fetch places
    const places = await fastify.prisma.place.findMany({
      where: {
        id: { in: tour.placeIds }
      },
      include: {
        badge: true,
        pointsOfInterest: true
      }
    })

    // Maintain order from placeIds
    const orderedPlaces = tour.placeIds.map(id =>
      places.find(p => p.id === id)
    ).filter(Boolean)

    return {
      id: tour.id,
      name: tour.name,
      description: tour.description,
      duration: tour.duration,
      distance: tour.distance,
      userPreferences: tour.userPreferences,
      places: orderedPlaces.map(place => ({
        id: place!.id,
        name: place!.name,
        type: place!.type,
        location: {
          lat: place!.latitude,
          lng: place!.longitude
        },
        rating: place!.rating,
        ratingsCount: place!.ratingsCount,
        description: place!.description,
        mustSee: place!.mustSee,
        visitTimes: place!.visitTimes,
        bestTime: place!.bestTime,
        photos: place!.photos,
        pointsOfInterest: place!.pointsOfInterest,
        badge: place!.badge
      }))
    }
  })

  // Generate a tour
  fastify.post<{ Body: GenerateTourBody }>('/generate', async (request) => {
    const { duration, interests, location } = request.body

    // Get all places
    let places = await fastify.prisma.place.findMany({
      include: {
        badge: true,
        pointsOfInterest: true
      }
    })

    // If location provided, calculate distances and sort by proximity
    if (location) {
      places = places
        .map(place => ({
          ...place,
          distance: calculateDistance(
            location.lat,
            location.lng,
            place.latitude,
            place.longitude
          )
        }))
        .sort((a, b) => a.distance - b.distance)
    } else {
      // Otherwise sort by rating
      places.sort((a, b) => b.rating - a.rating)
    }

    // Filter by interests if provided (simplified logic)
    // In a real app, you'd have tags or categories on places
    const filteredPlaces = places.slice(0, Math.ceil(duration / 40))

    // Calculate total distance
    let totalDistance = 0
    if (location && filteredPlaces.length > 1) {
      for (let i = 0; i < filteredPlaces.length - 1; i++) {
        totalDistance += calculateDistance(
          filteredPlaces[i].latitude,
          filteredPlaces[i].longitude,
          filteredPlaces[i + 1].latitude,
          filteredPlaces[i + 1].longitude
        )
      }
    }

    // Create tour
    const tour = await fastify.prisma.tour.create({
      data: {
        name: `Parcours ${interests.join(', ')} - ${duration}min`,
        description: `Un parcours de ${duration} minutes couvrant ${filteredPlaces.length} lieux`,
        placeIds: filteredPlaces.map(p => p.id),
        duration,
        distance: totalDistance,
        userPreferences: interests
      }
    })

    return {
      id: tour.id,
      name: tour.name,
      description: tour.description,
      duration: tour.duration,
      distance: tour.distance,
      userPreferences: tour.userPreferences,
      places: filteredPlaces.map(place => ({
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
    }
  })
}
