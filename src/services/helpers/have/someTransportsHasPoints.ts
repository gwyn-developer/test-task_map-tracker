import type { transport } from '@/types/transport/transport'
import type { group } from '@/types/regular/group'

const someTransportsHasPoints = (group: group<transport>): boolean => {
	if (group.data.length > 0 || group.groups.length > 0) {
		if (group.data.some((geo) => geo.points)) {
			return true
		} else {
			return group.groups.some((group) => someTransportsHasPoints(group))
		}
	}
	return false
}
export default someTransportsHasPoints
