import type { geofence } from '@/types/geofence/geofence'

const resItemsToGeofence = (
	value: { ID: string; ParentID: string | null; Name: string }[]
): geofence[] => {
	return value.map((value) => {
		return {
			parentId: value.ParentID,
			id: value.ID,
			name: value.Name,
			rect: undefined
		}
	})
}
export default resItemsToGeofence
