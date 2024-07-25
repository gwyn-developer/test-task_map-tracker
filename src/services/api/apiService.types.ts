import type { propertyTransportItem } from '@/types/transport/propertyTransportItem'

export type loginRequest = {
	UserName: string
	Password: string
	UTCOffset: number
}

export type schemaRequest = {
	session: string
}

export type deviceRequest = {
	session: string
	schemaId: string
}

export type geofenceCoordRequest = {
	session: string
	schemaID: string
	IDs: string
}

export type geofenceRequest = {
	session: string
	schemaId: string
}

export type trackCoordRequest = {
	session: string
	schemaID: string
	IDs: string
	SD: string
	ED: string
}

export type schemaResponse = [
	{
		ID: string
		Name: string
		Group: string
		GroupID: string
	}
]

export type deviceResponse = {
	ID: string
	Groups: [
		{
			ID: string
			ParentID: string | null
			Name: string
		}
	]
	Items: [
		{
			ID: string
			ParentID: string | null
			Name: string
			Serial: number
			Properties: propertyTransportItem[]
		}
	]
}

export type geofenceResponse = {
	ID: string
	Groups: [
		{
			ID: string
			ParentID: string | null
			Name: string
		}
	]
	Items: [
		{
			ID: string
			ParentID: string | null
			Name: string
		}
	]
}

export type trackCoordResponse = {
	[key: string]: [
		{
			DT: Date[]
			Lat: number[]
			Lng: number[]
		}
	]
}

export type geofenceCoordResponse = {
	[key: string]: {
		IsPolygon: boolean
		R: number
		Lat: number[]
		Lng: number[]
	}
}
