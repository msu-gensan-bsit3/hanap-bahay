import { env } from "$env/dynamic/private";

export async function listingHelp(propertyDetails: string, helpType: string) {
	if (!env.N8N_LISTING_HELP_URL) {
		console.error("N8N_LISTING_HELP_URL is not set");
		return { err: "N8N_LISTING_HELP_URL is not set" };
	}

	try {
		const res = await fetch(env.N8N_LISTING_HELP_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// Authorization: "Bearer " + env.N8N_KEY,
			},
			body: JSON.stringify({
					propertyDetails: propertyDetails,
					helpType: helpType
			}
			),
		});

		if (!res.ok) {
			return { err: `API request failed with status ${res.status}` };
		}

		const [json] = (await res.json()) as { output: string }[];

		if (!json?.output) {
			return { err: "Invalid response format from chatbot API" };
		}

		return { msg: json.output };
	} catch (error) {
		return { err: "Failed to send message to chatbot: " + error };
	}
}
