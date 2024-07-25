<template>
	<div class="transport-list-item">
		<CustomCheckbox :state="curCheckboxState" @click="displayTransport" />
		<div
			class="transport-list-item__wrap"
			:class="{
				'transport-list-item__wrap_selected': isCheck
			}"
		>
			<i class="fad fa-truck-monster transport-list-item__ico"></i>
			<div class="transport-list-item__name">{{ transport.name }}</div>
			<div v-if="transport?.serial" class="transport-list-item__serial">
				{{ transport.serial }}
			</div>
			<div v-if="transport?.vehicleRegNumber" class="transport-list-item__reg-number">
				{{ transport.vehicleRegNumber }}
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { mapActions } from 'pinia'
import { useRootStore } from '@/stores/store'

import { PropType } from 'vue'

import type { transport } from '@/types/transport/transport'
import { checkboxState } from '@/types/regular/checkboxState'

import CustomCheckbox from '@/app/components/CustomCheckbox.vue'

export default {
	name: 'TransportListItem',

	props: {
		transport: {
			type: Object as PropType<transport>,
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
			if (this.transport.points) {
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
			'getSchemasOfTrack',
			'getLastDayTrackCoord',
			'removeTransportPoints',
			'setIsLoading'
		]),

		async displayTransport() {
			this.setIsLoading(true)

			if (this.curCheckboxState === checkboxState.unchecked) {
				const schemaId = this.getSchemasOfTrack(this.transport.id)

				if (schemaId) {
					await this.getLastDayTrackCoord(this.transport.id, schemaId)
				}
			} else {
				await this.removeTransportPoints(this.transport.id)
			}
		}
	}
}
</script>

<style scoped lang="scss">
.transport-list-item {
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

	&__ico {
		--fa-primary-color: #b197fc;
		--fa-secondary-color: #000000;
		--fa-secondary-opacity: 1;
		font-size: 20px;
	}
}
</style>
