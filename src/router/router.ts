import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import MainView from '@/app/views/MainView.vue'

const routes: Array<RouteRecordRaw> = [
	//const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'main',
		component: MainView
	}
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
})

export default router
