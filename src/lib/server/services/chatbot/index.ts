export async function chatbotSendMessage(msg: string, sessionId: string) {
	if (!process.env.N8N_CHATBOT_URL) {
		console.error('N8N_CHATBOT_URL is not set');
		return;
	}

	try {
		const res = await fetch(process.env.N8N_CHATBOT_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + process.env.N8N_CHATBOT_KEY
			},
			body: JSON.stringify({
				chatInput: msg,
				sessionId,
				action: 'sendMessage'
			})
		});

		if (!res.ok) {
			return `Chatbot API request failed with status ${res.status}`
		}

		const [json] = (await res.json()) as { output: string }[];

		if (!json?.output) {
			return 'Invalid response format from chatbot API'
		}

		return json.output;
	} catch (error) {
		return 'Failed to send message to chatbot: ' + error
	}
}