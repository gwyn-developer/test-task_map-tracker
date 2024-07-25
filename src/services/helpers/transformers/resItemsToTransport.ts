import type { transport } from '@/types/transport/transport'
import type { propertyTransportItem } from '@/types/transport/propertyTransportItem'

const resItemsToTransport = (
	value: {
		ID: string
		ParentID: string | null
		Name: string
		Serial: number
		Properties: propertyTransportItem[]
	}[]
): transport[] => {
	return value.map((value) => {
		let vehicleRegNumber = ''
		if (value?.Properties.length > 0) {
			value?.Properties.forEach((property) => {
				if (property.Name === 'VehicleRegNumber') {
					vehicleRegNumber = property?.Value
				}
			})
		}

		return {
			parentID: value.ParentID,
			id: value.ID,
			name: value.Name,
			serial: value.Serial,
			points: undefined,
			vehicleRegNumber: vehicleRegNumber
		}
	})
}
export default resItemsToTransport
