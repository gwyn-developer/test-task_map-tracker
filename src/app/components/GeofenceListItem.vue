<template>
	<div class="geofence-list-item">
		<CustomCheckbox :state="curCheckboxState" @click="displayGeofence" />
		<div
			class="geofence-list-item__wrap"
			:class="{
				'geofence-list-item__wrap_selected': isCheck
			}"
		>
			<i class="fad fa-thumbtack geofence-list-item__ico"></i>
			<div class="geofence-list-item__name">{{ geofence.name }}</div>
		</div>
	</div>
</template>

<script lang="ts">
import { mapActions } from 'pinia'
import { useRootStore } from '@/stores/store'

import { PropType } from 'vue'

import type { geofence } from '@/types/geofence/geofence'
import { checkboxState } from '@/types/regular/checkboxState'

import CustomCheckbox from '@/app/components/CustomCheckbox.vue'

export default {
	name: 'geofenceListItem',

	props: {
		geofence: {
			type: Object as PropType<geofence>,
			required: true
		}
	},

	components: {
		CustomCheckbox
	},

	data() {
		return {
			isCheck: false
		}
	},

	computed: {
		curCheckboxState() {
			if (this.geofence.rect) {
				return checkboxState.checked
			} else {
				return checkboxState.unchecked
			}
		}
	},

	watch: {
		curCheckboxState(newVal) {
			if (newVal === checkboxState.checked) {
				this.isCheck = true
			}
			if (newVal === checkboxState.unchecked) {
				this.isCheck = false
			}
		}
	},

	methods: {
		...mapActions(useRootStore, [
			'getSchemasOfGeofence',
			'getGeofenceCoord',
			'removeGeofenceRect',
			'setIsLoading'
		]),

		async displayGeofence() {
			this.setIsLoading(true)

			if (this.curCheckboxState === checkboxState.unchecked) {
				const schemaId = this.getSchemasOfGeofence(this.geofence.id)
				if (schemaId) {
					await this.getGeofenceCoord(this.geofence.id, schemaId)
				}
			} else {
				await this.removeGeofenceRect(this.geofence.id)
			}
		}
	}
}
</script>

<style scoped lang="scss">
.geofence-list-item {
	display: flex;
	align-items: center;
	margin-top: 5px;

	&__wrap {
		display: flex;
		align-items: center;
		width: 100%;

		&_selected {
			background-color: $gray;
		}
	}

	&__name {
		margin-left: 5px;
	}

	&__ico {
		--fa-primary-color: #000000;
		--fa-secondary-color: #ffd43b;
		--fa-secondary-opacity: 1;
		font-size: 20px;
	}
}
</style>
