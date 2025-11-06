<template>
  <div class="map-container">
    <div ref="mapElement" class="map-element"></div>
  </div>
</template>

<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Place {
  id: number
  name: string
  type: string
  location: {
    lat: number
    lng: number
  }
  rating: number
  distance?: number
}

const props = defineProps<{
  places: Place[]
  center?: { lat: number; lng: number }
  zoom?: number
  radius?: number
  userLocation?: { lat: number; lng: number } | null
}>()

const emit = defineEmits<{
  'place-click': [place: Place]
}>()

const mapElement = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let markers: L.Marker[] = []
let radiusCircle: L.Circle | null = null
let userMarker: L.Marker | null = null

// Fix Leaflet default icon issue with Webpack/Vite
const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

const initMap = () => {
  if (!mapElement.value || map) return

  fixLeafletIcons()

  // Initialize map
  const defaultCenter = props.center || { lat: 48.8566, lng: 2.3522 } // Paris
  const defaultZoom = props.zoom || 13

  map = L.map(mapElement.value).setView([defaultCenter.lat, defaultCenter.lng], defaultZoom)

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map)
}

const clearMarkers = () => {
  markers.forEach(marker => marker.remove())
  markers = []
}

const clearRadiusCircle = () => {
  if (radiusCircle) {
    radiusCircle.remove()
    radiusCircle = null
  }
}

const clearUserMarker = () => {
  if (userMarker) {
    userMarker.remove()
    userMarker = null
  }
}

const addMarkers = () => {
  if (!map) return

  clearMarkers()

  // Create custom icon for places
  const placeIcon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-pin">
        <div class="marker-icon">📍</div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  })

  props.places.forEach(place => {
    const marker = L.marker([place.location.lat, place.location.lng], { icon: placeIcon })
      .addTo(map!)

    // Create popup content
    const popupContent = `
      <div class="custom-popup">
        <h3 class="popup-title">${place.name}</h3>
        <p class="popup-type">${place.type}</p>
        <div class="popup-rating">⭐ ${place.rating.toFixed(1)}</div>
        ${place.distance ? `<p class="popup-distance">${(place.distance / 1000).toFixed(1)} km</p>` : ''}
      </div>
    `

    marker.bindPopup(popupContent)

    marker.on('click', () => {
      emit('place-click', place)
    })

    markers.push(marker)
  })

  // Fit bounds to show all markers
  if (markers.length > 0) {
    const group = L.featureGroup(markers)
    map.fitBounds(group.getBounds().pad(0.1))
  }
}

const updateUserLocation = () => {
  if (!map || !props.userLocation) return

  clearUserMarker()
  clearRadiusCircle()

  // Create custom icon for user location
  const userIcon = L.divIcon({
    className: 'user-location-marker',
    html: `
      <div class="user-marker-pin">
        <div class="user-marker-icon">📌</div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  })

  // Add user location marker
  userMarker = L.marker([props.userLocation.lat, props.userLocation.lng], { icon: userIcon })
    .addTo(map)
    .bindPopup('Votre position')

  // Add radius circle if radius is provided
  if (props.radius) {
    radiusCircle = L.circle([props.userLocation.lat, props.userLocation.lng], {
      radius: props.radius,
      color: '#3b82f6',
      fillColor: '#3b82f6',
      fillOpacity: 0.1,
      weight: 2
    }).addTo(map)
  }

  // Center map on user location
  map.setView([props.userLocation.lat, props.userLocation.lng], 13)
}

// Watch for changes
watch(() => props.places, () => {
  if (map) {
    addMarkers()
  }
}, { deep: true })

watch(() => props.userLocation, () => {
  if (map) {
    updateUserLocation()
  }
}, { deep: true })

watch(() => props.radius, () => {
  if (map && props.userLocation) {
    updateUserLocation()
  }
})

onMounted(() => {
  initMap()
  if (map) {
    addMarkers()
    if (props.userLocation) {
      updateUserLocation()
    }
  }
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.map-element {
  width: 100%;
  height: 100%;
  z-index: 0;
}

:deep(.custom-marker) {
  background: none;
  border: none;
}

:deep(.marker-pin) {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

:deep(.marker-icon) {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  animation: bounce 1s ease-in-out infinite;
}

:deep(.user-location-marker) {
  background: none;
  border: none;
}

:deep(.user-marker-pin) {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

:deep(.user-marker-icon) {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  animation: pulse 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

:deep(.custom-popup) {
  padding: 8px;
  min-width: 200px;
}

:deep(.popup-title) {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1f2937;
}

:deep(.popup-type) {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

:deep(.popup-rating) {
  font-size: 14px;
  font-weight: 500;
  color: #f59e0b;
  margin: 0 0 4px 0;
}

:deep(.popup-distance) {
  font-size: 14px;
  color: #3b82f6;
  margin: 0;
  font-weight: 500;
}

/* Leaflet popup styling */
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

:deep(.leaflet-popup-tip) {
  background: white;
}
</style>
