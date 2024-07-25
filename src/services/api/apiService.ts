import axios from 'axios'
import type { AxiosResponse } from 'axios'

import type {
	loginRequest,
	schemaRequest,
	schemaResponse,
	deviceRequest,
	deviceResponse,
	trackCoordRequest,
	trackCoordResponse,
	geofenceRequest,
	geofenceResponse,
	geofenceCoordRequest,
	geofenceCoordResponse
} from '@/services/api/apiService.types'

export default class apiService {
	private api = import.meta.env.VITE_API_URL

	login(request: loginRequest): Promise<AxiosResponse<string, loginRequest>> {
		return axios.post<string>(this.api + 'ServiceJSON/Login', request)
	}

	getSchemas(request: schemaRequest): Promise<AxiosResponse<schemaResponse, schemaRequest>> {
		return axios.post<schemaResponse>(this.api + 'ServiceJSON/EnumSchemas', request)
	}

	getTransports(request: deviceRequest): Promise<AxiosResponse<deviceResponse, deviceRequest>> {
		return axios.post<deviceResponse>(this.api + 'ServiceJSON/EnumDevices', request)
	}

	getTrackCoord(
		request: trackCoordRequest
	): Promise<AxiosResponse<trackCoordResponse, trackCoordRequest>> {
		return axios.post<trackCoordResponse>(this.api + 'ServiceJSON/GetTrack', request)
	}

	getGeofences(
		request: geofenceRequest
	): Promise<AxiosResponse<geofenceResponse, geofenceRequest>> {
		return axios.post<geofenceResponse>(this.api + 'ServiceJSON/EnumGeoFences', request)
	}

	getGeofencesCoord(
		request: geofenceCoordRequest
	): Promise<AxiosResponse<geofenceCoordResponse, geofenceCoordRequest>> {
		return axios.post<geofenceCoordResponse>(this.api + 'ServiceJSON/GetGeofences', request)
	}
}
