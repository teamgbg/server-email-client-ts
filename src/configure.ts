/**
 * @system email
 * @status handwritten
 * @edit directly
 */
let _baseURL: string | undefined;
let _internalApiKey: string | undefined;

export function configure(opts: {
	emailConfig?: { baseURL?: string };
	internalApiKey?: string;
}): void {
	const baseURL = opts.emailConfig?.baseURL;
	if (baseURL !== undefined) _baseURL = baseURL;
	if (opts.internalApiKey !== undefined) _internalApiKey = opts.internalApiKey;
}

export function getEmailSenderBaseUrl(): string {
	if (!_baseURL) {
		throw new Error(
			"email-client baseURL is not configured — the 'email-client' configurable_primitive must inject it from config/email-client (configured-primitives)",
		);
	}
	return _baseURL;
}

export function getInternalApiKey(): string | undefined {
	return _internalApiKey;
}
