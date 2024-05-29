// apiUrls.js

const API_BASE_URL = "http://192.168.159.210:8082"; // Replace with your API base URL
export const ApıUrl = {
  login: `${API_BASE_URL}/user/login`,
  signup: `${API_BASE_URL}/user/signup`,
  create: `${API_BASE_URL}/area/create`,
  get: `${API_BASE_URL}/area/getAll`,
  delete: `${API_BASE_URL}/area/delete`,
  statistic: `${API_BASE_URL}/statistic/getAll`,


  // Add more endpoints as needed
};
