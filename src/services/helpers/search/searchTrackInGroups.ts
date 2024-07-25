import type { transport } from '@/types/transport/transport'
import type { group } from '@/types/regular/group'

const searchTrackInGroups = (
	groups: group<transport>[],
	id: string
): group<transport> | transport | undefined => {
	for (const group of groups) {
		if (group.id === id) {
			return group
		}
		const transport = searchTrackInGroups(group.groups, id)
		if (transport) {
			return transport
		}
		for (const object of group.data) {
			if (object.id === id) {
				return object
			}
		}
	}

	return undefined
}
export default searchTrackInGroups
