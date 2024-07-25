import type { point } from '@/types/regular/point'

export type transport = {
	id: string
	parentID: string | null
	name: string
	serial: number
	points: point[] | undefined
	vehicleRegNumber: string
}
