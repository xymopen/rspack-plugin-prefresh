import type { Compiler, ProvidePluginOptions } from "@rspack/core";
import { normalizeOptions, type PluginOptions } from "./options";

export type { PluginOptions };

const prefreshPath = require.resolve("./client/prefresh.js") as string;
const prefreshUtils = require.resolve("./client/prefreshUtils.js") as string;
const prefreshRuntimePath = require.resolve("@prefresh/core") as string;

const runtimePaths = [
	prefreshPath,
	prefreshUtils,
	prefreshRuntimePath
];

class ReactRefreshRspackPlugin {
	options: PluginOptions;

	declare static deprecated_runtimePaths: string[];

	constructor(options: PluginOptions = {}) {
		this.options = normalizeOptions(options);
	}

	apply(compiler: Compiler) {
		if (
			// Webpack do not set process.env.NODE_ENV, so we need to check for mode.
			// Ref: https://github.com/webpack/webpack/issues/7074
			(compiler.options.mode !== "development" ||
				// We also check for production process.env.NODE_ENV,
				// in case it was set and mode is non-development (e.g. "none")
				(process.env.NODE_ENV && process.env.NODE_ENV === "production"))
		) {
			return;
		}

		let provide: ProvidePluginOptions = {
			/**
			 * We are injecting `$RefreshReg$` and `$RefreshSig$` here.
			 *
			 * In rspack they are injected by the following `builtin:react-refresh-loader`
			 * and further forward to `$ReactRefreshRuntime$.register` and
			 * `$ReactRefreshRuntime$.createSignatureFunctionForTransform`
			 *
			 * It would also call `$ReactRefreshRuntime$.refresh` during module resolution
			 *
			 * See {@link https://github.com/web-infra-dev/rspack/tree/v0.6.5/crates/rspack_loader_react_refresh/src/lib.rs}
			 */
			$ReactRefreshRuntime$: prefreshPath,
		};

		if (this.options.overlay) {
			provide.__prefresh_errors__ = require.resolve(
				this.options.overlay.module
			) as string;
		}

		new compiler.webpack.ProvidePlugin(provide).apply(compiler);
		new compiler.webpack.EntryPlugin(compiler.context, prefreshRuntimePath, {
			name: undefined
		}).apply(compiler);

		compiler.options.module.rules.unshift({
			include: this.options.include!,
			exclude: {
				or: [this.options.exclude!, [...runtimePaths]].filter(value => value !== null)
			},
			use: "builtin:react-refresh-loader"
		});
	}
}

ReactRefreshRspackPlugin.deprecated_runtimePaths = runtimePaths;

// @ts-expect-error output module.exports
export = ReactRefreshRspackPlugin;
