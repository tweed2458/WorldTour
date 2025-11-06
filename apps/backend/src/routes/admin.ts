import { FastifyInstance } from 'fastify'

interface UpdatePlaceBody {
  name?: string
  type?: string
  latitude?: number
  longitude?: number
  description?: string
  mustSee?: string[]
  visitTimes?: string
  bestTime?: string | null
  photos?: string[]
}

interface CreatePOIBody {
  name: string
  description: string
  photos?: string[]
  audioGuide?: string
}

interface UpdatePOIBody {
  name?: string
  description?: string
  photos?: string[]
  audioGuide?: string | null
}

export default async function adminRoutes(fastify: FastifyInstance) {
  // Middleware to check if user is admin
  const checkAdmin = async (request: any, reply: any) => {
    await fastify.authenticate(request, reply)

    const user = await fastify.prisma.user.findUnique({
      where: { id: request.user.id }
    })

    if (!user || user.role !== 'admin') {
      return reply.status(403).send({ error: 'Access denied. Admin role required.' })
    }
  }

  // Check if admin owns/manages a place
  const checkPlaceOwnership = async (placeId: number, adminId: number) => {
    const place = await fastify.prisma.place.findUnique({
      where: { id: placeId }
    })

    if (!place) {
      return { error: 'Place not found', status: 404 }
    }

    if (place.adminId !== adminId) {
      return { error: 'You do not have permission to manage this place', status: 403 }
    }

    return { place }
  }

  // Get all places managed by the admin
  fastify.get('/my-places', {
    onRequest: [checkAdmin]
  }, async (request) => {
    const adminId = request.user!.id

    const places = await fastify.prisma.place.findMany({
      where: { adminId },
      include: {
        pointsOfInterest: true,
        badge: true,
        _count: {
          select: {
            ratings: true,
            pointsOfInterest: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

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
      badge: place.badge,
      pointsOfInterestCount: place._count.pointsOfInterest,
      createdAt: place.createdAt,
      updatedAt: place.updatedAt
    }))
  })

  // Get a specific place (if admin owns it)
  fastify.get<{ Params: { id: string } }>('/places/:id', {
    onRequest: [checkAdmin]
  }, async (request, reply) => {
    const placeId = parseInt(request.params.id)
    const adminId = request.user!.id

    const checkResult = await checkPlaceOwnership(placeId, adminId)
    if (checkResult.error) {
      return reply.status(checkResult.status!).send({ error: checkResult.error })
    }

    const place = await fastify.prisma.place.findUnique({
      where: { id: placeId },
      include: {
        pointsOfInterest: {
          orderBy: { createdAt: 'asc' }
        },
        badge: true
      }
    })

    return {
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
    }
  })

  // Update a place
  fastify.put<{ Params: { id: string }, Body: UpdatePlaceBody }>('/places/:id', {
    onRequest: [checkAdmin]
  }, async (request, reply) => {
    const placeId = parseInt(request.params.id)
    const adminId = request.user!.id

    const checkResult = await checkPlaceOwnership(placeId, adminId)
    if (checkResult.error) {
      return reply.status(checkResult.status!).send({ error: checkResult.error })
    }

    const updateData: any = {}

    if (request.body.name !== undefined) updateData.name = request.body.name
    if (request.body.type !== undefined) updateData.type = request.body.type
    if (request.body.latitude !== undefined) updateData.latitude = request.body.latitude
    if (request.body.longitude !== undefined) updateData.longitude = request.body.longitude
    if (request.body.description !== undefined) updateData.description = request.body.description
    if (request.body.mustSee !== undefined) updateData.mustSee = request.body.mustSee
    if (request.body.visitTimes !== undefined) updateData.visitTimes = request.body.visitTimes
    if (request.body.bestTime !== undefined) updateData.bestTime = request.body.bestTime
    if (request.body.photos !== undefined) updateData.photos = request.body.photos

    const updatedPlace = await fastify.prisma.place.update({
      where: { id: placeId },
      data: updateData,
      include: {
        pointsOfInterest: true,
        badge: true
      }
    })

    return {
      id: updatedPlace.id,
      name: updatedPlace.name,
      type: updatedPlace.type,
      location: {
        lat: updatedPlace.latitude,
        lng: updatedPlace.longitude
      },
      rating: updatedPlace.rating,
      ratingsCount: updatedPlace.ratingsCount,
      description: updatedPlace.description,
      mustSee: updatedPlace.mustSee,
      visitTimes: updatedPlace.visitTimes,
      bestTime: updatedPlace.bestTime,
      photos: updatedPlace.photos,
      pointsOfInterest: updatedPlace.pointsOfInterest,
      badge: updatedPlace.badge,
      updatedAt: updatedPlace.updatedAt
    }
  })

  // Create a Point of Interest
  fastify.post<{ Params: { placeId: string }, Body: CreatePOIBody }>(
    '/places/:placeId/poi',
    { onRequest: [checkAdmin] },
    async (request, reply) => {
      const placeId = parseInt(request.params.placeId)
      const adminId = request.user!.id

      const checkResult = await checkPlaceOwnership(placeId, adminId)
      if (checkResult.error) {
        return reply.status(checkResult.status!).send({ error: checkResult.error })
      }

      const { name, description, photos, audioGuide } = request.body

      const poi = await fastify.prisma.pointOfInterest.create({
        data: {
          name,
          description,
          photos: photos || [],
          audioGuide,
          placeId
        }
      })

      return poi
    }
  )

  // Update a Point of Interest
  fastify.put<{ Params: { placeId: string, poiId: string }, Body: UpdatePOIBody }>(
    '/places/:placeId/poi/:poiId',
    { onRequest: [checkAdmin] },
    async (request, reply) => {
      const placeId = parseInt(request.params.placeId)
      const poiId = parseInt(request.params.poiId)
      const adminId = request.user!.id

      const checkResult = await checkPlaceOwnership(placeId, adminId)
      if (checkResult.error) {
        return reply.status(checkResult.status!).send({ error: checkResult.error })
      }

      // Verify POI belongs to this place
      const poi = await fastify.prisma.pointOfInterest.findUnique({
        where: { id: poiId }
      })

      if (!poi || poi.placeId !== placeId) {
        return reply.status(404).send({ error: 'Point of interest not found' })
      }

      const updateData: any = {}

      if (request.body.name !== undefined) updateData.name = request.body.name
      if (request.body.description !== undefined) updateData.description = request.body.description
      if (request.body.photos !== undefined) updateData.photos = request.body.photos
      if (request.body.audioGuide !== undefined) updateData.audioGuide = request.body.audioGuide

      const updatedPOI = await fastify.prisma.pointOfInterest.update({
        where: { id: poiId },
        data: updateData
      })

      return updatedPOI
    }
  )

  // Delete a Point of Interest
  fastify.delete<{ Params: { placeId: string, poiId: string } }>(
    '/places/:placeId/poi/:poiId',
    { onRequest: [checkAdmin] },
    async (request, reply) => {
      const placeId = parseInt(request.params.placeId)
      const poiId = parseInt(request.params.poiId)
      const adminId = request.user!.id

      const checkResult = await checkPlaceOwnership(placeId, adminId)
      if (checkResult.error) {
        return reply.status(checkResult.status!).send({ error: checkResult.error })
      }

      // Verify POI belongs to this place
      const poi = await fastify.prisma.pointOfInterest.findUnique({
        where: { id: poiId }
      })

      if (!poi || poi.placeId !== placeId) {
        return reply.status(404).send({ error: 'Point of interest not found' })
      }

      await fastify.prisma.pointOfInterest.delete({
        where: { id: poiId }
      })

      return { message: 'Point of interest deleted successfully' }
    }
  )
}
