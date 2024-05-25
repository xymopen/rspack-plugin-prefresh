// Thanks https://github.com/pmmmwh/react-refresh-webpack-plugin
import * as RefreshUtils from "./refreshUtils.js";

// Port from https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/main/loader/utils/getRefreshModuleRuntime.js#L29
export function refresh(moduleId, webpackHot) {
	const currentExports = RefreshUtils.getModuleExports(moduleId);
	const fn = exports => {
		RefreshUtils.executeRuntime(exports, moduleId, webpackHot);
	};
	if (typeof Promise !== "undefined" && currentExports instanceof Promise) {
		currentExports.then(fn);
	} else {
		fn(currentExports);
	}
}

export {
	register,
	createSignatureFunctionForTransform
} from "react-refresh/runtime";
