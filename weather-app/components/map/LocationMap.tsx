'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon issue in Next.js
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface LocationMapProps {
  lat: number
  lon: number
  label?: string
}

export function LocationMap({ lat, lon, label }: LocationMapProps) {
  // Suppress "window is not defined" on server
  if (typeof window === 'undefined') return null

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden shadow border border-gray-200">
      <MapContainer
        center={[lat, lon]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]}>
          {label && <Popup>{label}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  )
}

// Re-center map when coords change
export function LocationMapWrapper({ lat, lon, label }: LocationMapProps) {
  return <LocationMap key={`${lat}-${lon}`} lat={lat} lon={lon} label={label} />
}
