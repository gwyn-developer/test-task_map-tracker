<template>
	<li class="geofence-list-group">
		<div class="geofence-list-group__title">
			<CustomCheckbox :state="curCheckboxState" @click="toggleAllGeofence" />
			<div
				class="geofence-list-group__title-wrap"
				:class="{
					'geofence-list-group__title-wrap_selected': isCheck
				}"
			>
				<i class="fas fa-folder geofence-list-group__title-ico"></i>
				<span class="geofence-list-group__title-name">{{ group.name }}</span>
			</div>
		</div>
		<ul class="geofence-list-group__subgroups">
			<GeofenceListGroup
				v-for="subgroup in group.groups"
				:group="subgroup"
				:key="subgroup.id"
			/>
			<GeofenceListItem
				v-for="geofence in group.data"
				:geofence="geofence"
				:key="geofence.id"
			/>
		</ul>
	</li>
</template>

<script lang="ts">
import { mapActions } from 'pinia'
import { useRootStore } from '@/stores/store'

import { PropType } from 'vue'

import type { geofence } from '@/types/geofence/geofence'
import type { group } from '@/types/regular/group'
import { checkboxState } from '@/types/regular/checkboxState'

import allGeofencesHasRect from '@/services/helpers/have/allGeofencesHasRect'
import someGeofencesHasRect from '@/services/helpers/have/someGeofencesHasRect'

import GeofenceListItem from '@/app/components/GeofenceListItem.vue'
import CustomCheckbox from '@/app/components/CustomCheckbox.vue'

export default {
	name: 'GeofenceListGroup',

	props: {
		group: {
			type: Object as PropType<group<geofence>>,
			required: true
		}
	},

	components: {
		GeofenceListItem,
		CustomCheckbox
	},

	data() {
		return {
			isCheck: false
		}
	},

	computed: {
		curCheckboxState() {
			if (allGeofencesHasRect(this.group)) {
				return checkboxState.checked
			} else if (someGeofencesHasRect(this.group)) {
				return checkboxState.indeterminate
			}
			return checkboxState.unchecked
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

		async toggleAllGeofence() {
			this.setIsLoading(true)

			if (
				this.curCheckboxState === checkboxState.unchecked ||
				this.curCheckboxState === checkboxState.indeterminate
			) {
				const schemaId = this.getSchemasOfGeofence(this.group.id)
				if (schemaId) {
					await this.getGeofenceCoord(this.group.id, schemaId)
				}
			} else {
				await this.removeGeofenceRect(this.group.id)
			}
		}
	}
}
</script>

<style scoped lang="scss">
.geofence-list-group {
	margin-top: 5px;
	width: 100%;

	&__title {
		display: flex;
		align-items: center;

		&-wrap {
			display: flex;
			align-items: center;
			width: 100%;

			&_selected {
				background-color: $gray;
			}
		}

		&-name {
			margin-left: 5px;
			line-height: normal;
			font-weight: 600;
		}

		&-ico {
			color: $yellow;
			font-size: 20px;
		}
	}

	&__subgroups {
		margin-left: 5px;
		display: flex;
		flex-direction: column;
	}
}
</style>
