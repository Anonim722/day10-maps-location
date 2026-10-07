export interface Coordinates {
    latitude: number
    longitude: number
}

export interface PlacePin {
    id: string
    title: string
    coordinate: Coordinates
    createdAt: string
}
