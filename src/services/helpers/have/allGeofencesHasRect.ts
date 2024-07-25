import type { geofence } from '@/types/geofence/geofence'
import type { group } from '@/types/regular/group'

const allGeofencesHasRect = (group: group<geofence>): boolean => {
	if (group.data.length > 0 || group.groups.length > 0) {
		if (group.data.every((geo) => geo.rect)) {
			return group.groups.every((group) => allGeofencesHasRect(group))
		} else {
			return false
		}
	}
	return true
}
export default allGeofencesHasRect
