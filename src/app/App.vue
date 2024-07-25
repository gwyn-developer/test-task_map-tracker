<template>
	<RouterView />
</template>

<script lang="ts">
import { mapActions } from 'pinia'
import { useRootStore } from '@/stores/store'

import { RouterView } from 'vue-router'

export default {
	name: 'app',

	components: {
		RouterView
	},

	methods: {
		...mapActions(useRootStore, [
			'login',
			'getSchemas',
			'getTransports',
			'getGeofences',
			'setIsLoading'
		])
	},

	async created() {
		this.setIsLoading(true)

		await this.login()
		await this.getSchemas()

		/** параллельный вызов getTransports() и getGeofences() приводил к ошибке:
		 * "Количество одновременных запросов от пользователей ограничено до 1, слишком много запросов."
		 * и выполнялся только один из запросов, поэтому сделан последовательный вызов
		 */
		await this.getTransports()
		await this.getGeofences()

		this.setIsLoading(false)
	}
}
</script>
