import API from './api';

const userService = {
  // Get all users with a specific role
  getUsersByRole: async (role) => {
    try {
      const response = await API.get(`/auth/users/role/${role}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching users with role ${role}:`, error);
      throw error;
    }
  },

  // Get all collectors
  getCollectors: async () => {
    return userService.getUsersByRole('Collector');
  },

  // Get all dispatchers
  getDispatchers: async () => {
    return userService.getUsersByRole('Dispatcher');
  },

  // Get all residents
  getResidents: async () => {
    return userService.getUsersByRole('Resident');
  },

  // Get all users (if needed for admin purposes)
  getAllUsers: async () => {
    try {
      const response = await API.get('/auth/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }
};

export default userService;
