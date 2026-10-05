/**
 * @system email
 * @status handwritten
 * @edit edit directly
 */

export interface EmailSendParams {
	to: string;
	template: string;
	vars?: Record<string, string>;
	from?: string;
	replyTo?: string;
}

export interface EmailSendResult {
	id: string;
	status: "queued" | "sent" | "failed";
}

export interface EmailTemplate {
	slug: string;
	name: string;
	subject: string;
	bodyText: string;
	bodyHtml: string;
	from: string;
	replyTo?: string;
}

export interface EmailProvider {
	send(params: {
		from: string;
		to: string;
		subject: string;
		html?: string;
		text?: string;
		replyTo?: string;
	}): Promise<{ id: string }>;
}

export type { EmailSendParams as SendParams };
