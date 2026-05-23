// services/guestId.ts

function generateUUID(): string {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

// Gerado uma vez por sessão, vive em memória
let sessionGuestId: string | null = null;

export function getOrCreateGuestId(): string {
	if (!sessionGuestId) {
		sessionGuestId = generateUUID();
	}
	return sessionGuestId;
}
