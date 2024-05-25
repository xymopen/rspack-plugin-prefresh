import * as PrefreshUtils from "./prefreshUtils.js"

declare const error: any;
declare const __prefresh_errors__: {
	clearRuntimeErrors?: () => void;
	handleRuntimeError?: (error: any) => void;
} | undefined;

/**
 * We are providing `$RefreshReg$` and `$RefreshSig$` here.
 *
 * They are derived from
 * {@link https://github.com/preactjs/prefresh/tree/%40prefresh/webpack%404.0.1/packages/webpack/src/loader/runtime.js}
 *
 * See {@link ./index.ts} for more information.
*/

export function register(type: SignatureType, id: string) {
	/**
	 * rspack's `builtin:react-refresh-loader` behave differently from `@preace/core`
	 * in that `@preace/core` creates `id` as `${currentModuleId} ${id}` while
	 * `builtin:react-refresh-loader` creates `id` as `${currentModuleId}_${id}`
	 *
	 * See {@link https://github.com/web-infra-dev/rspack/tree/v0.6.5/crates/rspack_loader_react_refresh/src/lib.rs#L37}
	 * See {@link https://github.com/preactjs/prefresh/tree/%40prefresh/webpack%404.0.1/packages/webpack/src/utils/Runtime.js#L41}
	 */
	self["__PREFRESH__"].register(type, id);
}

export function createSignatureFunctionForTransform() {
	var status: SignatureStatus = "begin";
	var savedType: SignatureType | undefined;

	return function (type: SignatureType, key: string, forceReset: boolean, getCustomHooks: Signature["getCustomHooks"] | undefined) {
		if (!savedType) savedType = type;
		// @ts-expect-error overload mismatch
		status = self["__PREFRESH__"].sign(type || savedType, key, forceReset, getCustomHooks, status);
		return type;
	}
}

/** Derived from {@link https://github.com/preactjs/prefresh/tree/%40prefresh/webpack%404.0.1/packages/webpack/src/loader/runtime.js} */
export function refresh(moduleId: string, webpackHot: ImportMeta["webpackHot"]) {
	/** See {@link https://github.com/pmmmwh/react-refresh-webpack-plugin/tree/0ea5af1/lib/runtime/RefreshUtils.js#L18-L25} */
	var maybeModule = __webpack_require__.c[moduleId];
	if (typeof maybeModule === "undefined") {
		// `moduleId` is available but the module in cache is unavailable,
		// which indicates the module is somehow corrupted (e.g. broken Webpacak `module` globals).
		// We will warn the user (as this is likely a mistake) and assume they cannot be refreshed.
		console.warn(
			"[Prefresh] Failed to get module: " + moduleId + "."
		);
		return;
	}
	const module = maybeModule;

	const isPrefreshComponent = PrefreshUtils.shouldBind(module);

	if (webpackHot) {
		const currentExports = PrefreshUtils.getExports(module);
		const previousHotModuleExports =
			webpackHot.data && webpackHot.data.moduleExports;

		PrefreshUtils.registerExports(currentExports, moduleId);

		if (isPrefreshComponent) {
			if (previousHotModuleExports) {
				try {
					PrefreshUtils.flush();
					if (
						typeof __prefresh_errors__ !== "undefined" &&
						__prefresh_errors__ &&
						__prefresh_errors__.clearRuntimeErrors
					) {
						__prefresh_errors__.clearRuntimeErrors();
					}
				} catch (e) {
					// Only available in newer webpack versions.
					if (webpackHot.invalidate) {
						webpackHot.invalidate();
					} else {
						self.location.reload();
					}
				}
			}

			webpackHot.dispose(data => {
				data.moduleExports = PrefreshUtils.getExports(module);
			});

			webpackHot.accept(function errorRecovery() {
				if (
					typeof __prefresh_errors__ !== "undefined" &&
					__prefresh_errors__ &&
					__prefresh_errors__.handleRuntimeError
				) {
					__prefresh_errors__.handleRuntimeError(error);
				}

				__webpack_require__.c[moduleId].hot.accept(errorRecovery);
			});
		}
	}

}
