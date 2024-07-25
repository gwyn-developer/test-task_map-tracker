<template>
	<ul class="transport-list border-right">
		<li v-for="schema in schemas" :key="schema.id">
			<div class="transport-list__schema">
				<i class="fas fa-folder transport-list__schema-ico"></i>
				<div class="transport-list__schema-name">{{ schema.name }}</div>
			</div>
			<ul class="transport-list__schema-groups">
				<TransportListGroup v-for="group in schema.groups" :group="group" :key="group.id" />
			</ul>
		</li>
	</ul>
</template>

<script lang="ts">
import { PropType } from 'vue'

import type { schema } from '@/types/regular/schema'
import type { transport } from '@/types/transport/transport'

import TransportListGroup from '@/app/components/TransportListGroup.vue'

export default {
	name: 'TransportList',

	props: {
		schemas: {
			type: Array as PropType<schema<transport>[]>,
			required: true
		}
	},
	components: {
		TransportListGroup
	}
}
</script>

<style scoped lang="scss">
.transport-list {
	width: 100%;
	height: 100%;
	padding: 10px;
	overflow: auto;
	box-sizing: border-box;

	&__schema {
		width: 100%;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		gap: 5px;

		&-ico {
			color: $yellow;
			font-size: 20px;
		}

		&-name {
			line-height: normal;
			font-weight: 700;
			margin-left: 5px;
		}

		&-groups {
			margin-left: 5px;
			display: flex;
			flex-direction: column;
		}
	}
}

.border-right {
	border-right: 2px solid $black;
}
</style>
