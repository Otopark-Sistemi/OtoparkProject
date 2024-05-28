// apiUrls.js

const API_BASE_URL = "http://172.20.10.7:8082"; // Replace with your API base URL

export const ApıUrl = {
  login: `${API_BASE_URL}/user/login`,
  signup: `${API_BASE_URL}/user/signup`,
  create: `${API_BASE_URL}/area/create`,
  get: `${API_BASE_URL}/area/getAll`,
  delete: `${API_BASE_URL}/area/delete`,
  statistic: `${API_BASE_URL}/statistic/getAll`,
  search: `${API_BASE_URL}/search`,

  // Add more endpoints as needed
};
