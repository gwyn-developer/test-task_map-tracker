import type { group } from '@/types/regular/group'

export type fillGroupsParam<T> = {
	schemaId: string
	groups: group<T>[]
}
