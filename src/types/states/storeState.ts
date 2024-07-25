import type { schema } from '@/types/regular/schema'
import type { transport } from '@/types/transport/transport'
import type { geofence } from '@/types/geofence/geofence'
import type apiService from '@/services/api/apiService'

export type storeState = {
	isLoading: boolean
	token: string | null
	schemas: schema<any>[]
	schemasTransport: schema<transport>[]
	schemasGeofence: schema<geofence>[]
	api: apiService
}
