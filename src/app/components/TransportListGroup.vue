<template>
	<li class="transport-list-group">
		<div class="transport-list-group__title">
			<CustomCheckbox :state="curCheckboxState" @click="toggleAllTransport" />
			<div
				class="transport-list-group__title-wrap"
				:class="{
					'transport-list-group__title-wrap_selected': isCheck
				}"
			>
				<i class="fas fa-folder transport-list-group__title-ico"></i>
				<span class="transport-list-group__title-name">{{ group.name }}</span>
				<div v-if="group?.serial" class="transport-list-group__serial">
					{{ group.serial }}
				</div>
				<div v-if="group?.vehicleRegNumber" class="transport-list-group__reg-number">
					{{ group.vehicleRegNumber }}
				</div>
			</div>
		</div>
		<ul class="transport-list-group__subgroups">
			<TransportListGroup
				v-for="subgroup in group.groups"
				:group="subgroup"
				:key="subgroup.id"
			/>
			<TransportListItem
				v-for="transport in group.data"
				:transport="transport"
				:key="transport.id"
			/>
		</ul>
	</li>
</template>

<script lang="ts">
import { mapActions } from 'pinia'
import { useRootStore } from '@/stores/store'

import { PropType } from 'vue'

import type { transport } from '@/types/transport/transport'
import type { group } from '@/types/regular/group'
import { checkboxState } from '@/types/regular/checkboxState'

import allTransportsHasPoints from '@/services/helpers/have/allTransportsHasPoints'
import someTransportsHasPoints from '@/services/helpers/have/someTransportsHasPoints'

import TransportListItem from '@/app/components/TransportListItem.vue'
import CustomCheckbox from '@/app/components/CustomCheckbox.vue'

export default {
	name: 'TransportListGroup',

	props: {
		group: {
			type: Object as PropType<group<transport>>,
			required: true
		}
	},

	components: {
		TransportListItem,
		CustomCheckbox
	},

	data() {
		return {
			isCheck: false
		}
	},

	computed: {
		curCheckboxState() {
			if (allTransportsHasPoints(this.group)) {
				return checkboxState.checked
			} else if (someTransportsHasPoints(this.group)) {
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
			'getSchemasOfTrack',
			'getLastDayTrackCoord',
			'removeTransportPoints',
			'setIsLoading'
		]),

		async toggleAllTransport() {
			this.setIsLoading(true)

			if (
				this.curCheckboxState === checkboxState.unchecked ||
				this.curCheckboxState === checkboxState.indeterminate
			) {
				const schemaId = this.getSchemasOfTrack(this.group.id)
				if (schemaId) {
					await this.getLastDayTrackCoord(this.group.id, schemaId)
				}
			} else {
				await this.removeTransportPoints(this.group.id)
			}
		}
	}
}
</script>

<style scoped lang="scss">
.transport-list-group {
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

		&__serial {
			margin-left: 5px;
			font-size: 10px;
			line-height: 10px;
			background-color: $gray-3;
			padding: 2px;
			align-self: center;
		}

		&__reg-number {
			margin-left: auto;
			font-size: 10px;
			line-height: 10px;
			padding: 5px;
		}
	}

	&__subgroups {
		margin-left: 5px;
		display: flex;
		flex-direction: column;
	}
}
</style>
