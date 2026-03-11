// Auth Service for managing user authentication and localStorage
const AUTH_KEY = "sagacity_user";
const USERS_REGISTRY_KEY = "sagacity_users_registry";

export const authService = {
  // Save user data to localStorage
  saveUser: (userData) => {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Error saving user to localStorage:", error);
    }
  },

  // Get user data from localStorage
  getUser: () => {
    try {
      const userData = localStorage.getItem(AUTH_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error retrieving user from localStorage:", error);
      return null;
    }
  },

  // Clear user data from localStorage
  clearUser: () => {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (error) {
      console.error("Error clearing user from localStorage:", error);
    }
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return authService.getUser() !== null;
  },

  // Register new user (store credentials)
  register: (email, password, userData) => {
    try {
      const users = authService.getAllRegisteredUsers();
      
      // Check if user already exists
      if (users.find(u => u.email === email)) {
        return {
          success: false,
          error: "User with this email already exists",
        };
      }

      // Add new user to registry
      const newRegisteredUser = {
        email,
        password, // In production, this should be hashed
        ...userData,
      };
      users.push(newRegisteredUser);
      
      try {
        localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(users));
      } catch (error) {
        console.error("Error saving users registry:", error);
        return {
          success: false,
          error: "Failed to register user",
        };
      }

      return {
        success: true,
        user: newRegisteredUser,
      };
    } catch (error) {
      console.error("Error during registration:", error);
      return {
        success: false,
        error: "Registration failed",
      };
    }
  },

  // Get all registered users
  getAllRegisteredUsers: () => {
    try {
      const users = localStorage.getItem(USERS_REGISTRY_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error("Error retrieving users registry:", error);
      return [];
    }
  },

  // Find user by email
  findUserByEmail: (email) => {
    try {
      const users = authService.getAllRegisteredUsers();
      return users.find(u => u.email === email) || null;
    } catch (error) {
      console.error("Error finding user:", error);
      return null;
    }
  },

  // Sign in user with email and password
  signInWithCredentials: (email, password) => {
    try {
      const registeredUser = authService.findUserByEmail(email);

      if (!registeredUser) {
        return {
          success: false,
          error: "User does not exist. Please sign up first.",
        };
      }

      if (registeredUser.password !== password) {
        return {
          success: false,
          error: "Invalid password. Please try again.",
        };
      }

      const signedInUser = {
        email: registeredUser.email,
        fullName: registeredUser.fullName,
        username: registeredUser.username,
        age: registeredUser.age,
        phone: registeredUser.phone,
        signedInAt: new Date().toISOString(),
      };

      authService.saveUser(signedInUser);
      return {
        success: true,
        user: signedInUser,
      };
    } catch (error) {
      console.error("Error during sign in:", error);
      return {
        success: false,
        error: "Sign in failed",
      };
    }
  },

  // Sign in user (store data) - used for simple sign in after signup
  signIn: (userData) => {
    const signedInUser = {
      ...userData,
      signedInAt: new Date().toISOString(),
    };
    authService.saveUser(signedInUser);
    return signedInUser;
  },

  // Sign out user
  signOut: () => {
    authService.clearUser();
  },
};
