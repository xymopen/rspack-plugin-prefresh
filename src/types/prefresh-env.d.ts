import ""

declare global {
	/** See {@link https://github.com/preactjs/prefresh/tree/%40prefresh/webpack%404.0.1/packages/core/src/index.js} */
	type SignatureType = unknown;

	type Signature = {
		type: SignatureType;
		key?: boolean;
		forceReset?: boolean;
		getCustomHooks: () => ((...args: any) => any)[];
	};

	type SignatureStatus = "begin" | "needsHooks";

	var __PREFRESH__: {
		getSignature: (type: SignatureType) => Signature | undefined;
		register: (type: SignatureType, id: string) => void;
		getPendingUpdates: () => ([existing: SignatureType, type: SignatureType])[];
		flush: () => void;
		replaceComponent: (OldType: SignatureType, NewType: SignatureType, resetHookState: boolean) => void;
		sign: {
			(type: SignatureType, key: string, forceReset: Signature["forceReset"], getCustomHooks: Signature["getCustomHooks"] | undefined, status: "begin"): "needsHooks";
			(type: SignatureType, key: unknown, forceReset: unknown, getCustomHooks: unknown, status: "needsHooks"): void;
		};
		computeKey: (signature: string) => string;
	};
}
