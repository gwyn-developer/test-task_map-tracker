import type { transport } from '@/types/transport/transport'
import type { group } from '@/types/regular/group'

const allTransportsHasPoints = (group: group<transport>): boolean => {
	if (group.data.length > 0 || group.groups.length > 0) {
		if (group.data.every((geo) => geo.points)) {
			return group.groups.every((group) => allTransportsHasPoints(group))
		} else {
			return false
		}
	}
	return true
}
export default allTransportsHasPoints
