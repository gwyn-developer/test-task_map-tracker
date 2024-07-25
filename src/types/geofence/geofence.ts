import { rect } from '@/types/geofence/rect'

export type geofence = {
	id: string
	name: string
	parentId: string | null
	rect?: rect
}
