import { rect } from '@/types/geofence/rect'

class polygon extends rect {
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
export default polygon
