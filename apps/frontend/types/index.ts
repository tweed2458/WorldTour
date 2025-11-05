export interface Location {
  lat: number
  lng: number
}

export interface PointOfInterest {
  id: number
  name: string
  description: string
  photos: string[]
  audioGuide?: string
}

export interface Place {
  id: number
  name: string
  type: 'museum' | 'monument' | 'poi' | 'church' | 'castle' | 'park'
  location: Location
  rating: number
  ratingsCount: number
  description: string
  mustSee: string[]
  visitTimes: string
  bestTime?: string
  pointsOfInterest: PointOfInterest[]
  badge: Badge
  photos: string[]
  distance?: number
}

export interface Badge {
  id: string
  name: string
  icon: string
  description: string
  placeId: number
  earnedAt?: Date
}

export interface User {
  id: number
  name: string
  email: string
  interests: Interest[]
  visitedPlaces: number[]
  badges: Badge[]
  ratings: Rating[]
}

export type Interest = 'art' | 'history' | 'architecture' | 'science' | 'nature' | 'culture'

export interface Rating {
  id: number
  placeId: number
  userId: number
  rating: number
  comment?: string
  createdAt: Date
}

export interface Tour {
  id: number
  name: string
  places: Place[]
  duration: number
  distance: number
  userPreferences: Interest[]
  description?: string
}

export interface SearchFilters {
  query?: string
  type?: Place['type']
  minRating?: number
  maxDistance?: number
  interests?: Interest[]
}
