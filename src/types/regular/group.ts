export type group<T> = {
	id: string
	name: string
	parentId: string | null
	groups: group<T>[]
	data: T[]
}
