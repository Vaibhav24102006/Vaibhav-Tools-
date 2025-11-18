// Form validation and sanitization utilities
import DOMPurify from 'dompurify';

// Validation patterns
const PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  NAME: /^[a-zA-Z\s]{2,50}$/,
  ADDRESS: /^[a-zA-Z0-9\s,.-]{10,200}$/,
  ZIPCODE: /^[0-9]{5,10}$/,
  PRICE: /^\d+(\.\d{1,2})?$/,
  QUANTITY: /^[1-9]\d*$/
};

// Error messages
const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  INVALID_NAME: 'Name must be 2-50 characters with only letters and spaces',
  INVALID_ADDRESS: 'Address must be 10-200 characters',
  INVALID_ZIPCODE: 'Please enter a valid zip code',
  INVALID_PRICE: 'Please enter a valid price',
  INVALID_QUANTITY: 'Quantity must be a positive number',
  MIN_LENGTH: (min) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max) => `Must be no more than ${max} characters`,
  MIN_VALUE: (min) => `Must be at least ${min}`,
  MAX_VALUE: (max) => `Must be no more than ${max}`,
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload an image (JPG, PNG, GIF)',
  FILE_TOO_LARGE: 'File size must be less than 5MB'
};

class ValidationService {
  // Sanitize input to prevent XSS
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return DOMPurify.sanitize(input.trim());
  }

  // Validate required field
  static isRequired(value) {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  }

  // Validate email
  static isValidEmail(email) {
    return PATTERNS.EMAIL.test(email);
  }

  // Validate phone number
  static isValidPhone(phone) {
    return PATTERNS.PHONE.test(phone.replace(/\s/g, ''));
  }

  // Validate password strength
  static isValidPassword(password) {
    return PATTERNS.PASSWORD.test(password);
  }

  // Validate name
  static isValidName(name) {
    return PATTERNS.NAME.test(name);
  }

  // Validate address
  static isValidAddress(address) {
    return PATTERNS.ADDRESS.test(address);
  }

  // Validate zip code
  static isValidZipCode(zipCode) {
    return PATTERNS.ZIPCODE.test(zipCode);
  }

  // Validate price
  static isValidPrice(price) {
    return PATTERNS.PRICE.test(price.toString()) && parseFloat(price) > 0;
  }

  // Validate quantity
  static isValidQuantity(quantity) {
    return PATTERNS.QUANTITY.test(quantity.toString());
  }

  // Validate string length
  static isValidLength(value, min, max) {
    const length = value.toString().length;
    return length >= min && length <= max;
  }

  // Validate numeric range
  static isValidRange(value, min, max) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
  }

  // Validate file type
  static isValidFileType(file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif']) {
    return allowedTypes.includes(file.type);
  }

  // Validate file size (in MB)
  static isValidFileSize(file, maxSizeMB = 5) {
    return file.size <= maxSizeMB * 1024 * 1024;
  }

  // Validate passwords match
  static doPasswordsMatch(password, confirmPassword) {
    return password === confirmPassword;
  }

  // Comprehensive validation function
  static validateField(value, rules) {
    const errors = [];
    const sanitizedValue = this.sanitizeInput(value);

    // Required validation
    if (rules.required && !this.isRequired(sanitizedValue)) {
      errors.push(ERROR_MESSAGES.REQUIRED);
      return errors; // Stop validation if required field is empty
    }

    // Skip other validations if field is empty and not required
    if (!this.isRequired(sanitizedValue)) {
      return errors;
    }

    // Email validation
    if (rules.email && !this.isValidEmail(sanitizedValue)) {
      errors.push(ERROR_MESSAGES.INVALID_EMAIL);
    }

    // Phone validation
    if (rules.phone && !this.isValidPhone(sanitizedValue)) {
      errors.push(ERROR_MESSAGES.INVALID_PHONE);
    }

    // Password validation
    if (rules.password && !this.isValidPassword(sanitizedValue)) {
      errors.push(ERROR_MESSAGES.INVALID_PASSWORD);
    }

    // Name validation
    if (rules.name && !this.isValidName(sanitizedValue)) {
      errors.push(ERROR_MESSAGES.INVALID_NAME);
    }

    // Address validation
    if (rules.address && !this.isValidAddress(sanitizedValue)) {
      errors.push(ERROR_MESSAGES.INVALID_ADDRESS);
    }

    // Zip code validation
    if (rules.zipCode && !this.isValidZipCode(sanitizedValue)) {
      errors.push(ERROR_MESSAGES.INVALID_ZIPCODE);
    }

    // Price validation
    if (rules.price && !this.isValidPrice(sanitizedValue)) {
      errors.push(ERROR_MESSAGES.INVALID_PRICE);
    }

    // Quantity validation
    if (rules.quantity && !this.isValidQuantity(sanitizedValue)) {
      errors.push(ERROR_MESSAGES.INVALID_QUANTITY);
    }

    // Length validation
    if (rules.minLength && !this.isValidLength(sanitizedValue, rules.minLength)) {
      errors.push(ERROR_MESSAGES.MIN_LENGTH(rules.minLength));
    }

    if (rules.maxLength && !this.isValidLength(sanitizedValue, rules.maxLength)) {
      errors.push(ERROR_MESSAGES.MAX_LENGTH(rules.maxLength));
    }

    // Range validation
    if (rules.minValue && !this.isValidRange(sanitizedValue, rules.minValue, Infinity)) {
      errors.push(ERROR_MESSAGES.MIN_VALUE(rules.minValue));
    }

    if (rules.maxValue && !this.isValidRange(sanitizedValue, -Infinity, rules.maxValue)) {
      errors.push(ERROR_MESSAGES.MAX_VALUE(rules.maxValue));
    }

    return errors;
  }

  // Validate form data
  static validateForm(formData, validationSchema) {
    const errors = {};
    let isValid = true;

    Object.keys(validationSchema).forEach(fieldName => {
      const fieldValue = formData[fieldName];
      const fieldRules = validationSchema[fieldName];
      
      const fieldErrors = this.validateField(fieldValue, fieldRules);
      
      if (fieldErrors.length > 0) {
        errors[fieldName] = fieldErrors;
        isValid = false;
      }
    });

    return { isValid, errors };
  }

  // Validate file upload
  static validateFile(file, options = {}) {
    const errors = [];
    const {
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
      maxSizeMB = 5
    } = options;

    if (!this.isValidFileType(file, allowedTypes)) {
      errors.push(ERROR_MESSAGES.INVALID_FILE_TYPE);
    }

    if (!this.isValidFileSize(file, maxSizeMB)) {
      errors.push(ERROR_MESSAGES.FILE_TOO_LARGE);
    }

    return errors;
  }

  // Sanitize form data
  static sanitizeFormData(formData) {
    const sanitized = {};
    
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeInput(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'string' ? this.sanitizeInput(item) : item
        );
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeFormData(value);
      } else {
        sanitized[key] = value;
      }
    });

    return sanitized;
  }

  // Common validation schemas
  static getValidationSchemas() {
    return {
      login: {
        email: { required: true, email: true },
        password: { required: true, minLength: 6 }
      },
      
      register: {
        name: { required: true, name: true },
        email: { required: true, email: true },
        password: { required: true, password: true },
        confirmPassword: { required: true }
      },
      
      profile: {
        name: { required: true, name: true },
        email: { required: true, email: true },
        phone: { phone: true },
        address: { address: true },
        zipCode: { zipCode: true }
      },
      
      product: {
        name: { required: true, minLength: 3, maxLength: 100 },
        description: { required: true, minLength: 10, maxLength: 1000 },
        price: { required: true, price: true, minValue: 0.01 },
        category: { required: true },
        brand: { required: true }
      },
      
      order: {
        name: { required: true, name: true },
        email: { required: true, email: true },
        phone: { required: true, phone: true },
        address: { required: true, address: true },
        city: { required: true, minLength: 2, maxLength: 50 },
        zipCode: { required: true, zipCode: true }
      }
    };
  }

  // Get error message for a specific field
  static getFieldErrorMessage(fieldName, errorType, params = {}) {
    const messages = {
      email: {
        required: ERROR_MESSAGES.REQUIRED,
        invalid: ERROR_MESSAGES.INVALID_EMAIL
      },
      password: {
        required: ERROR_MESSAGES.REQUIRED,
        invalid: ERROR_MESSAGES.INVALID_PASSWORD,
        mismatch: ERROR_MESSAGES.PASSWORD_MISMATCH
      },
      name: {
        required: ERROR_MESSAGES.REQUIRED,
        invalid: ERROR_MESSAGES.INVALID_NAME
      },
      phone: {
        required: ERROR_MESSAGES.REQUIRED,
        invalid: ERROR_MESSAGES.INVALID_PHONE
      },
      address: {
        required: ERROR_MESSAGES.REQUIRED,
        invalid: ERROR_MESSAGES.INVALID_ADDRESS
      },
      zipCode: {
        required: ERROR_MESSAGES.REQUIRED,
        invalid: ERROR_MESSAGES.INVALID_ZIPCODE
      },
      price: {
        required: ERROR_MESSAGES.REQUIRED,
        invalid: ERROR_MESSAGES.INVALID_PRICE
      },
      quantity: {
        required: ERROR_MESSAGES.REQUIRED,
        invalid: ERROR_MESSAGES.INVALID_QUANTITY
      }
    };

    return messages[fieldName]?.[errorType] || 'Invalid field';
  }
}

export default ValidationService; 