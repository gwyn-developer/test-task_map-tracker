import type { geofence } from '@/types/geofence/geofence'
import type { group } from '@/types/regular/group'

const someGeofencesHasRect = (group: group<geofence>): boolean => {
	if (group.data.length > 0 || group.groups.length > 0) {
		if (group.data.some((geo) => geo.rect)) {
			return true
		} else {
			return group.groups.some((group) => someGeofencesHasRect(group))
		}
	}
	return false
}
export default someGeofencesHasRect
