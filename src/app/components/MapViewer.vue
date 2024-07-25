<template>
	<div class="map border-top-none" id="map"></div>
</template>

<script lang="ts">
import { mapActions } from 'pinia'
import { useRootStore } from '@/stores/store'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import { format } from 'date-fns'

import rectangle from '@/types/geofence/rectangle'
import circle from '@/types/geofence/circle'
import polygon from '@/types/geofence/polygon'

import type { rect } from '@/types/geofence/rect'
import type { point } from '@/types/regular/point'

export default {
	name: 'MapViewer',

	props: {
		allPoints: {
			type: Array
		},
		allRects: {
			type: Array
		}
	},

	components: {},

	data() {
		return {
			map: null as Map | null,
			rectsLayer: undefined,
			pointsLayer: undefined,
			canvasRenderer: null
		}
	},

	computed: {
		iconFlag() {
			return L.icon({
				iconUrl: 'flag-16x16.png',
				iconSize: [16, 16]
			})
		}
	},

	watch: {
		allRects: {
			handler(newRects: rect[]) {
				this.drawNewRects(newRects)
			},
			immediate: false
		},

		allPoints: {
			handler(newPoints: point[][]) {
				this.drawNewPoints(newPoints)
			},
			immediate: false
		}
	},

	methods: {
		...mapActions(useRootStore, ['pause', 'setIsLoading']),

		initMap() {
			let options = {
				attributionControl: false,
				zoomControl: true
			}
			this.map = L.map('map', options).setView([55.15402, 61.42915], 9)
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 28,
				tileSize: 512,
				zoomOffset: -1
			}).addTo(this.map)
		},

		async drawNewRects(newRects) {
			await this.processNewRects(newRects).then(() => {
				this.setIsLoading(false)
			})
		},

		async processNewRects(newRects) {
			if (this.map) {
				if (this.rectsLayer) {
					this.rectsLayer.clearLayers()
				} else {
					this.rectsLayer = L.layerGroup().addTo(this.map)
				}

				if (!newRects.length) {
					this.rectsLayer.clearLayers()
				}

				for (let i = 0; i < newRects.length; i++) {
					const rect = newRects[i]

					if (i % 100 === 0) {
						await this.pause(0)
					}

					if (rect instanceof polygon) {
						const polygon = rect as polygon
						const mapPolygon = L.polygon(polygon.coordinates, {
							color: 'purple',
							weight: 3
						}).addTo(this.rectsLayer)
						this.map.fitBounds(mapPolygon.getBounds())
					} else if (rect instanceof circle) {
						const circle = rect as circle
						const mapCircle = L.circle(
							[circle.coordinate.lat, circle.coordinate.lng],
							circle.radius,
							{ color: 'orange', weight: 3 }
						).addTo(this.rectsLayer)
						this.map.fitBounds(mapCircle.getBounds())
					} else if (rect instanceof rectangle) {
						const rectangle = rect as rectangle
						const bounds = L.latLngBounds(
							rectangle.coordinates.map((x) => L.latLng(x.lat, x.lng))
						)
						const mapRect = L.rectangle(bounds, {
							color: 'yellow',
							weight: 3
						}).addTo(this.rectsLayer)
						this.map.fitBounds(mapRect.getBounds())
					}
				}
			}
		},

		async drawNewPoints(newPoints) {
			await this.processNewPoints(newPoints).then(() => {
				this.setIsLoading(false)
			})
		},

		async processNewPoints(newPoints) {
			if (this.map) {
				if (this.pointsLayer) {
					this.pointsLayer.clearLayers()
				} else {
					this.pointsLayer = L.layerGroup().addTo(this.map)
				}

				if (!newPoints.length) {
					this.pointsLayer.clearLayers()
				}

				let k = 0

				for (const point of newPoints) {
					if (k % 20 === 0) {
						await this.pause(0)
					}

					for (let i = 0; i < point.length; i++) {
						const currentPoint = point[i]

						if (i % 20 === 0) {
							await this.pause(0)
						}

						const marker = L.marker([currentPoint.lat, currentPoint.lng], {
							icon: this.iconFlag
						}).addTo(this.pointsLayer)

						marker.on('click', () => {
							marker
								.bindPopup(
									`Время прибытия: ${format(new Date(currentPoint.date), 'HH:mm-dd.MM.yyyy')}`
								)
								.openPopup()
						})
					}

					this.map.fitBounds(point.map((x) => [x.lat, x.lng]))
				}
			}
		}
	},

	mounted() {
		this.initMap()
	}
}
</script>

<style scoped lang="scss">
.map {
	width: 100%;
	height: 100%;

	box-sizing: border-box;
	border: 2px solid $black;
}

.border-top-none {
	border-top: none;
}
</style>
