/**
 * @system email
 * @status handwritten
 * @edit edit directly
 */

import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { getEmailSenderBaseUrl, getInternalApiKey } from "./configure.ts";
import type { EmailSendParams, EmailSendResult } from "./types.ts";

export interface EmailClient {
	send(params: EmailSendParams): Promise<EmailSendResult>;
}

export interface CreateEmailClientOptions {
	baseURL?: string;
}

export function createEmailClient(opts: CreateEmailClientOptions = {}): EmailClient {
	// The base URL is injected by the bootloader (configured-primitives) from the
	// `email-client` config row. Resolve it lazily on first use so the boot-time
	// configure() is always applied before the first send — even when a consumer
	// constructs the client at module-load time.
	let client: EmailClient | undefined;
	function getClient(): EmailClient {
		if (client) return client;
		const baseURL = opts.baseURL ?? getEmailSenderBaseUrl();
		// Internal-surface authentication: the email API enforces a shared secret
		// (x-scala-internal-key) because its tunnel hostname is publicly reachable.
		// Read per-request via the configure getter (bootloader-injected).
		const link = new RPCLink({
			url: `${baseURL}/api/rpc/fn/email`,
			headers: () => {
				const key = getInternalApiKey();
				return key ? { "x-scala-internal-key": key } : {};
			},
		});
		client = createORPCClient(link) as unknown as EmailClient;
		return client;
	}

	return {
		send(params: EmailSendParams) {
			return getClient().send(params) as Promise<EmailSendResult>;
		},
	};
}
