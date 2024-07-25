import { rect } from '@/types/geofence/rect'

class circle extends rect {
	radius: number
	coordinate: {
		lat: number
		lng: number
	}

	constructor(
		radius: number,
		point: {
			lat: number
			lng: number
		}
	) {
		super()
		this.radius = radius
		this.coordinate = point
	}
}

export default circle
