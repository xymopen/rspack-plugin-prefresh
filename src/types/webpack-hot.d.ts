import "";

declare global {
	namespace __WebpackModuleApi {
		interface Hot {
			/** https://webpack.js.org/api/hot-module-replacement/#invalidate */
			invalidate: () => void;
		}
	}
}
