import { TOKEN } from "./vars/vars.js";

export const getBaseFetchQueryOptions = (method, body) => {
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
      "Authorization": `Token ${TOKEN}`,
    },
    body: JSON.stringify(body),
  };
}