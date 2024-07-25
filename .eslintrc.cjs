/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
	root: true,
	extends: [
		'plugin:vue/vue3-essential',
		'eslint:recommended',
		'@vue/eslint-config-typescript',
		'@vue/eslint-config-prettier/skip-formatting'
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	env: {
		browser: true,
		es2021: true
	},
	rules: {
		'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
		'no-undef': 'warn',
		'no-unsafe-optional-chaining': 'warn',
		'no-useless-escape': 'off',
		indent: ['error', 'tab', { SwitchCase: 1, MemberExpression: 1 }]
	}
}
