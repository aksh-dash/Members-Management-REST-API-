/**
 * Validation middleware for form inputs.
 * Enforces the specified validation rules before reaching controllers.
 */

const validateRegistration = (req, res, next) => {
  const { name, email, password, address } = req.body;
  const errors = [];

  // Name: Min 20 characters, Max 60 characters
  if (!name) {
    errors.push('Name is required.');
  } else if (name.length < 20 || name.length > 60) {
    errors.push('Name must be between 20 and 60 characters.');
  }

  // Email: Standard email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.push('Email is required.');
  } else if (!emailRegex.test(email)) {
    errors.push('Please provide a valid email address.');
  }

  // Password: 8-16 characters, at least one uppercase, one special character
  if (!password) {
    errors.push('Password is required.');
  } else {
    if (password.length < 8 || password.length > 16) {
      errors.push('Password must be between 8 and 16 characters.');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter.');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character.');
    }
  }

  // Address: Max 400 characters
  if (!address) {
    errors.push('Address is required.');
  } else if (address.length > 400) {
    errors.push('Address must not exceed 400 characters.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

const validatePassword = (req, res, next) => {
  const { newPassword } = req.body;
  const errors = [];

  if (!newPassword) {
    errors.push('New password is required.');
  } else {
    if (newPassword.length < 8 || newPassword.length > 16) {
      errors.push('Password must be between 8 and 16 characters.');
    }
    if (!/[A-Z]/.test(newPassword)) {
      errors.push('Password must contain at least one uppercase letter.');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      errors.push('Password must contain at least one special character.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

const validateStore = (req, res, next) => {
  const { name, email, address } = req.body;
  const errors = [];

  // Name: Min 20 characters, Max 60 characters
  if (!name) {
    errors.push('Store name is required.');
  } else if (name.length < 20 || name.length > 60) {
    errors.push('Store name must be between 20 and 60 characters.');
  }

  // Email: Standard email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.push('Email is required.');
  } else if (!emailRegex.test(email)) {
    errors.push('Please provide a valid email address.');
  }

  // Address: Max 400 characters
  if (!address) {
    errors.push('Address is required.');
  } else if (address.length > 400) {
    errors.push('Address must not exceed 400 characters.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

module.exports = { validateRegistration, validatePassword, validateStore };
