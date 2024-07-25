import { defineStore } from 'pinia'

import { format } from 'date-fns'

import type { storeState } from '@/types/states/storeState'
import type { transport } from '@/types/transport/transport'
import type { geofence } from '@/types/geofence/geofence'
import type { rect } from '@/types/geofence/rect'
import type { group } from '@/types/regular/group'
import type { point } from '@/types/regular/point'
import type { fillGroupsParam } from '@/types/params/fillGroupsParam'
import type { pointsParam } from '@/types/params/pointsParam'
import type { rectParam } from '@/types/params/rectParam'

import apiService from '@/services/api/apiService'
import rectangle from '@/types/geofence/rectangle'
import circle from '@/types/geofence/circle'
import polygon from '@/types/geofence/polygon'

import groupBy from '@/services/helpers/groupBy'
import searchParent from '@/services/helpers/search/searchParent'
import resGroupToGroup from '@/services/helpers/transformers/resGroupToGroup'
import resItemsToTransport from '@/services/helpers/transformers/resItemsToTransport'
import resItemsToGeofence from '@/services/helpers/transformers/resItemsToGeofence'
import searchTrackInGroups from '@/services/helpers/search/searchTrackInGroups'
import searchGeofenceInGroups from '@/services/helpers/search/searchGeofenceInGroups'

export const useRootStore = defineStore({
	id: 'rootStore',

	state(): storeState {
		return {
			isLoading: false,
			token: null,
			schemas: [],
			schemasTransport: [],
			schemasGeofence: [],
			api: new apiService()
		}
	},

	getters: {
		getAllPoints: (state) => {
			const getPointFromGroups = (groups: group<transport>[]): point[][] => {
				let points: point[][] = []

				groups.forEach((group) => {
					if (group.groups) {
						points = points.concat(
							group.data
								.filter((x) => x.points && x.points.length > 0)
								.map((x) => x.points!)
						)
						points = points.concat(getPointFromGroups(group.groups))
					} else {
						points = points.concat([])
					}
				})

				return points
			}

			let points: point[][] = []

			state.schemasTransport.forEach((schema) => {
				points = points.concat(getPointFromGroups(schema.groups))
			})
			return points
		},

		getAllRects: (state) => {
			const getPointFromGroups = (groups: group<geofence>[]): rect[] => {
				let rects: rect[] = []

				groups.forEach((group) => {
					rects = rects.concat(group.data.filter((x) => x.rect).map((x) => x.rect))
					rects = rects.concat(getPointFromGroups(group.groups))
				})

				return rects
			}

			let rects: rect[] = []

			state.schemasGeofence.forEach((schema) => {
				rects = rects.concat(getPointFromGroups(schema.groups))
			})

			return rects
		}
	},

	actions: {
		setIsLoading(value: boolean) {
			this.isLoading = value
		},

		async login() {
			try {
				const res = await this.api.login({
					UserName: import.meta.env.VITE_API_USERNAME,
					Password: import.meta.env.VITE_API_PASSWORD,
					UTCOffset: import.meta.env.VITE_API_UTC_OFFSET
				})

				if (res.status === 200) {
					this.token = res.data ?? null
				}
			} catch (e) {
				alert('Ошибка авторизации входа')
				console.error('Ошибка авторизации входа: ', e)
			}
		},

		async getSchemas() {
			if (!this.checkToken()) return

			try {
				const res = await this.api.getSchemas({
					session: this.token as string
				})

				if (res.status === 200) {
					if (res.data.length > 0) {
						res.data.forEach((schema) => {
							this.schemas.push({
								id: schema.ID,
								name: schema.Name,
								group: schema.Group,
								groupID: schema.GroupID,
								groups: []
							})
						})
					} else {
						this.schemas = []
					}
				}
			} catch (e) {
				alert('Ошибка получения доступных схем')
				console.error('Ошибка получения доступных схем: ', e)
			}
		},

		async getTransports() {
			if (!this.checkToken()) return

			if (!this.checkSchemas()) return

			this.schemasTransport = JSON.parse(JSON.stringify(this.schemas))

			try {
				for (const schema of this.schemasTransport) {
					const res = await this.api.getTransports({
						schemaId: schema.id,
						session: this.token as string
					})

					if (res.status === 200) {
						const value = res.data
						const groups = groupBy(value.Groups, (x) => x.ParentID)
						const devices = groupBy(value.Items, (x) => x.ParentID)
						const head: group<transport>[] = resGroupToGroup(
							(groups.get(null) ?? []).concat(devices.get(null) ?? [])
						)

						groups.forEach((value, key) => {
							if (key) {
								const parent = searchParent(head, key)
								if (parent) {
									parent.groups = parent.groups.concat(resGroupToGroup(value))
								}
							}
						})
						devices.forEach((value, key) => {
							if (key) {
								const parent = searchParent(head, key)
								if (parent) {
									parent.data = parent.data.concat(resItemsToTransport(value))
								}
							}
						})

						this.fillGroupsForSchemaTransport({ schemaId: schema.id, groups: head })
					}
				}
			} catch (e) {
				alert('Ошибка получения доступных приборов и групп')
				console.error('Ошибка получения доступных приборов и групп: ', e)
			}
		},

		async getGeofences() {
			if (!this.checkToken()) return

			if (!this.checkSchemas()) return

			this.schemasGeofence = JSON.parse(JSON.stringify(this.schemas))

			try {
				for (const schema of this.schemasGeofence) {
					const res = await this.api.getGeofences({
						schemaId: schema.id,
						session: this.token as string
					})

					if (res.status === 200) {
						const value = res.data

						const groups = groupBy(value.Groups, (x) => x.ParentID)
						const geofences = groupBy(value.Items, (x) => x.ParentID)
						const head: group<geofence>[] = resGroupToGroup(
							(groups.get(null) ?? []).concat(geofences.get(null) ?? [])
						)

						groups.forEach((value, key) => {
							if (key) {
								const parent = searchParent(head, key)
								if (parent) {
									parent.groups = parent.groups.concat(resGroupToGroup(value))
								}
							}
						})

						geofences.forEach((value, key) => {
							if (key) {
								const parent = searchParent(head, key)
								if (parent) {
									parent.data = parent.data.concat(resItemsToGeofence(value))
								}
							}
						})

						this.fillGroupsForSchemaGeofence({ schemaId: schema.id, groups: head })
					}
				}
			} catch (e) {
				alert('Ошибка получения доступных геозон и групп')
				console.error('Ошибка получения доступных геозон и групп: ', e)
			}
		},

		fillGroupsForSchemaTransport({ schemaId, groups }: fillGroupsParam<transport>) {
			const schema = this.schemasTransport.find((x) => x.id === schemaId)
			if (schema) {
				schema.groups = groups
			}
		},

		fillGroupsForSchemaGeofence({ schemaId, groups }: fillGroupsParam<geofence>) {
			const schema = this.schemasGeofence.find((x) => x.id === schemaId)
			if (schema) {
				schema.groups = groups
			}
		},

		getSchemasOfTrack(trackId: string) {
			for (const schema of this.schemasTransport) {
				if (searchTrackInGroups(schema.groups, trackId)) {
					return schema.id
				}
			}

			return undefined
		},

		async getLastDayTrackCoord(trackId: string, schemaId: string) {
			if (!trackId) {
				alert(
					'При запросе получения доступных координат транспорта за последний день отсутствует id трека'
				)
				console.warn('Отсутствует trackId')

				return
			}

			if (!this.checkSchemaId(schemaId)) return

			if (!this.checkToken()) return

			try {
				const now = new Date()
				const startDate = new Date()
				const endDate = new Date()
				startDate.setHours(5)
				startDate.setMinutes(0)
				endDate.setHours(5)
				endDate.setMinutes(0)
				endDate.setDate(now.getDate() + 1)

				const res = await this.api.getTrackCoord({
					session: this.token as string,
					schemaID: schemaId,
					IDs: trackId,
					SD: format(new Date(startDate), 'yyyyMMdd-HHmm'),
					ED: format(new Date(endDate), 'yyyyMMdd-HHmm')
				})

				const data = res.data

				Object.keys(data).forEach((key) => {
					const value = data[key]
					const points: point[] = []

					value.forEach((point) => {
						points.push(
							...point.DT.map((date, i) => {
								return {
									date: date,
									lat: point.Lat[i],
									lng: point.Lng[i]
								}
							})
						)
					})

					this.addPointsToTrack({ points: points, transportId: key })
				})
			} catch (e) {
				alert('Ошибка получения доступных координат транспорта за последний день')
				console.error(
					'Ошибка получения доступных координат транспорта за последний день: ',
					e
				)
			}
		},

		addPointsToTrack(pointsParam: pointsParam) {
			this.schemasTransport.forEach((schema) => {
				const object = searchTrackInGroups(schema.groups, pointsParam.transportId)
				const transport = object as transport

				if (transport) {
					transport.points = pointsParam.points
				}
			})
		},

		async removeTransportPoints(transportId: string) {
			const removeGroupPoint = (group: group<transport>) => {
				group.data.forEach((geofence) => {
					geofence.points = undefined
				})

				group.groups.forEach((group) => {
					removeGroupPoint(group)
				})
			}

			this.schemasTransport.forEach((schema) => {
				const object = searchTrackInGroups(schema.groups, transportId)
				const geofence = object as transport
				const group = object as group<transport>

				if ((geofence as transport).points) {
					geofence.points = undefined
				} else if (group.data) {
					removeGroupPoint(group)
				}
			})
		},

		getSchemasOfGeofence(geofenceId: string) {
			for (const schema of this.schemasGeofence) {
				if (searchGeofenceInGroups(schema.groups, geofenceId)) {
					return schema.id
				}
			}

			return undefined
		},

		async getGeofenceCoord(geofenceId: string, schemaId: string) {
			if (!geofenceId) {
				alert(
					'При запросе получения доступных координат транспорта за последний день отсутствует id геозоны'
				)
				console.warn('Отсутствует geofenceId')

				return
			}

			if (!this.checkSchemaId(schemaId)) return

			if (!this.checkToken()) return

			try {
				const res = await this.api.getGeofencesCoord({
					session: this.token as string,
					schemaID: schemaId,
					IDs: geofenceId
				})

				const data = res.data

				Object.keys(data).forEach((key) => {
					const point = data[key]
					let rect: rect

					if (point.R > 0) {
						rect = new circle(point.R, {
							lat: point.Lat[0],
							lng: point.Lng[0]
						})
					} else if (point.IsPolygon) {
						rect = new polygon(
							point.Lng.map((lng, i) => {
								return {
									lng: lng,
									lat: point.Lat[i]
								}
							})
						)
					} else {
						rect = new rectangle(
							point.Lng.map((lng, i) => {
								return {
									lng: lng,
									lat: point.Lat[i]
								}
							})
						)
					}

					this.addRectForGeofence({ rect: rect, geofenceId: key })
				})
			} catch (e) {
				alert('Ошибка получения доступных координат геозоны')
				console.error('Ошибка получения доступных координат геозоны: ', e)
			}
		},

		addRectForGeofence(rectParam: rectParam) {
			this.schemasGeofence.forEach((schema) => {
				const geofence = searchGeofenceInGroups(
					schema.groups,
					rectParam.geofenceId
				) as geofence

				if (geofence) {
					geofence.rect = rectParam.rect
				}
			})
		},

		async removeGeofenceRect(geofenceId: string) {
			const removeGroupRect = (group: group<geofence>) => {
				group.data.forEach((geofence) => {
					geofence.rect = undefined
				})

				group.groups.forEach((group) => {
					removeGroupRect(group)
				})
			}
			this.schemasGeofence.forEach((schema) => {
				const object = searchGeofenceInGroups(schema.groups, geofenceId)
				const geofence = object as geofence
				const group = object as group<geofence>

				if ((geofence as geofence).rect) {
					geofence.rect = undefined
				} else if (group.data) {
					removeGroupRect(group)
				}
			})
		},

		checkToken() {
			if (!this.token) {
				alert('Токен авторизации не был получен')
				console.warn('Токен авторизации не был получен')
				return false
			}
			return true
		},

		checkSchemas() {
			if (!this.schemas.length) {
				alert('Доступные схемы не были получены')
				console.warn('Доступные схемы не были получены')
				return false
			}
			return true
		},

		checkSchemaId(schemaId: string) {
			if (!schemaId) {
				alert('В запросе отсутствует id схемы')
				console.warn('В запросе отсутствует id схемы')
				return false
			}
			return true
		},

		async pause(duration = 500, call?: Function) {
			return new Promise((resolve) => {
				setTimeout(() => {
					if (call) call()
					resolve(true)
				}, duration)
			})
		}
	}
})
