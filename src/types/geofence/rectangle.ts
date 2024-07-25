import { rect } from '@/types/geofence/rect'

class rectangle extends rect {
	coordinates: {
		lat: number
		lng: number
	}[]

	constructor(
		points: {
			lat: number
			lng: number
		}[]
	) {
		super()
		this.coordinates = points
	}
}

export default rectangle
