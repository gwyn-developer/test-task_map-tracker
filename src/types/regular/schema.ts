import type { group } from '@/types/regular/group'

export type schema<T> = {
	id: string
	name: string
	group: string
	groupID: string
	groups: group<T>[]
}
