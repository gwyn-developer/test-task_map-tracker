import type { group } from '@/types/regular/group'

const searchParent = <T>(groups: group<T>[], parentId: string): group<T> | undefined => {
	if (groups.length > 0) {
		const parent = groups.find((x) => x.id === parentId)
		if (parent) {
			return parent
		} else {
			for (const group of groups) {
				const parent = searchParent(group.groups, parentId)
				if (parent) {
					return parent
				}
			}
		}
	}
	return undefined
}
export default searchParent
