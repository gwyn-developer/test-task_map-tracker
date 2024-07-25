import type { group } from '@/types/regular/group'
import type { geofence } from '@/types/geofence/geofence'

const searchGeofenceInGroups = (
	groups: group<geofence>[],
	id: string
): group<geofence> | geofence | undefined => {
	for (const group of groups) {
		if (group.id === id) {
			return group
		}
		const geofence = searchGeofenceInGroups(group.groups, id)
		if (geofence) {
			return geofence
		}
		for (const object of group.data) {
			if (object.id === id) {
				return object
			}
		}
	}
	return undefined
}
export default searchGeofenceInGroups
