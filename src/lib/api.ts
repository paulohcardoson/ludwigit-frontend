import ky from "ky";

const api = ky.create({
	prefixUrl: import.meta.env.VITE_API_BASE_URL,
	headers: {
		accept: "text/html,application/json",
	},
});

export default api;
