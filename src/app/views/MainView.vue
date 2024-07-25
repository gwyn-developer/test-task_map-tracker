<template>
	<div class="main-view">
		<SpinnerViewer v-show="isLoading" />

		<div class="pick-container">
			<TransportList :schemas="schemasTransport" class="pick-container__item" />

			<GeofenceList :schemas="schemasGeofence" class="pick-container__item" />
		</div>

		<MapViewer class="map" :allPoints="allPoints" :allRects="allRects" />
	</div>
</template>

<script lang="ts">
import { mapState, mapGetters } from 'pinia'
import { useRootStore } from '@/stores/store'

import MapViewer from '@/app/components/MapViewer.vue'
import TransportList from '@/app/components/TransportList.vue'
import GeofenceList from '@/app/components/GeofenceList.vue'
import SpinnerViewer from '@/app/components/SpinnerViewer.vue'

export default {
	name: 'MainView',

	components: {
		MapViewer,
		TransportList,
		GeofenceList,
		SpinnerViewer
	},

	data() {
		return {}
	},

	computed: {
		...mapState(useRootStore, ['isLoading', 'schemasTransport', 'schemasGeofence']),
		...mapGetters(useRootStore, ['getAllPoints', 'getAllRects']),

		allRects() {
			return this.getAllRects
		},
		allPoints() {
			return this.getAllPoints
		}
	}
}
</script>

<style scoped lang="scss">
.main-view {
	overflow: hidden;
	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: column;

	.pick-container {
		display: flex;
		height: 50%;
		width: 100%;

		box-sizing: border-box;

		background: $white;
		border: 2px solid $black;

		&__item {
			max-width: 50%;
			max-height: 100%;
			overflow: auto;
		}
	}

	.map {
		height: 50%;
		width: 100%;
	}
}
</style>
