<template>
	<div class="checkbox">
		<vue-feather type="check" size="20" fill="white" v-if="this.state === 0" />
		<vue-feather type="square" size="15" fill="gray" stroke="none" v-if="this.state === 2" />
	</div>
</template>

<script scoped lang="ts">
export default {
	name: 'CustomCheckbox',

	props: {
		state: {
			type: Number,
			required: true
		}
	},

	data() {
		return {
			checked: false,
			checkboxState: {
				checked: 'checked',
				indeterminate: 'indeterminate',
				unchecked: 'unchecked'
			}
		}
	}
}
</script>

<style lang="scss">
.checkbox {
	transition: all 300ms ease-out;
	width: 20px;
	height: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	border: 1px solid $gray-2;
	border-radius: 2px;
	cursor: pointer;
	margin-right: 5px;

	&:hover {
		border-color: $blue;
	}

	&:active {
		border-color: $black;
	}
}
</style>
