module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@wordpress/eslint-plugin/esnext',
		'plugin:prettier/recommended',
	],
	parserOptions: {
		ecmaVersion: 2017,
		sourceType: 'module',
	},
	plugins: ['prettier'],
	rules: {
		'space-before-function-paren': [
			'error',
			{
				anonymous: 'always',
				named: 'never',
				asyncArrow: 'always',
			},
		],
		'linebreak-style': ['error', 'unix'],
		'prettier/prettier': [
			'error',
			{
				trailingComma: 'es5',
				singleQuote: true,
				printWidth: 80,
				useTabs: true,
				tabWidth: 4,
			},
		],
	},
	settings: {
		jsdoc: {
			mode: 'closure',
		},
	},
};
