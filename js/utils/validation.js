/**
 * Form Validation Utility Functions
 * 
 * This module provides utility functions for form validation,
 * including input validation, error handling, and form submission helpers.
 * 
 * @module utils/validation
 */

/**
 * Validate a form input
 * @function validateInput
 * @param {HTMLElement} input - Input element to validate
 * @param {Object} [rules={}] - Validation rules
 * @returns {Object} Validation result with isValid and message properties
 */
export function validateInput(input, rules = {}) {
  const value = input.value.trim();
  const type = input.type;
  let isValid = true;
  let message = '';
  
  // Required validation
  if (rules.required && value === '') {
    return {
      isValid: false,
      message: rules.requiredMessage || 'This field is required'
    };
  }
  
  // Skip other validations if empty and not required
  if (!rules.required && value === '') {
    return { isValid: true, message: '' };
  }
  
  // Minimum length validation
  if (rules.minLength && value.length < rules.minLength) {
    return {
      isValid: false,
      message: rules.minLengthMessage || `Minimum length is ${rules.minLength} characters`
    };
  }
  
  // Maximum length validation
  if (rules.maxLength && value.length > rules.maxLength) {
    return {
      isValid: false,
      message: rules.maxLengthMessage || `Maximum length is ${rules.maxLength} characters`
    };
  }
  
  // Email validation
  if (type === 'email' || rules.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return {
        isValid: false,
        message: rules.emailMessage || 'Please enter a valid email address'
      };
    }
  }
  
  // URL validation
  if (type === 'url' || rules.url) {
    try {
      new URL(value);
    } catch {
      return {
        isValid: false,
        message: rules.urlMessage || 'Please enter a valid URL'
      };
    }
  }
  
  // Number validation
  if (type === 'number' || rules.number) {
    const numberValue = Number(value);
    
    if (isNaN(numberValue)) {
      return {
        isValid: false,
        message: rules.numberMessage || 'Please enter a valid number'
      };
    }
    
    // Min value validation
    if (rules.min !== undefined && numberValue < rules.min) {
      return {
        isValid: false,
        message: rules.minMessage || `Value must be at least ${rules.min}`
      };
    }
    
    // Max value validation
    if (rules.max !== undefined && numberValue > rules.max) {
      return {
        isValid: false,
        message: rules.maxMessage || `Value must be at most ${rules.max}`
      };
    }
  }
  
  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    return {
      isValid: false,
      message: rules.patternMessage || 'Please enter a valid value'
    };
  }
  
  // Custom validation
  if (rules.validate && typeof rules.validate === 'function') {
    const customResult = rules.validate(value, input);
    
    if (customResult !== true) {
      return {
        isValid: false,
        message: typeof customResult === 'string' ? customResult : 'Invalid value'
      };
    }
  }
  
  return { isValid, message };
}

/**
 * Validate a complete form
 * @function validateForm
 * @param {HTMLFormElement} form - Form element to validate
 * @param {Object} validationRules - Validation rules by input name
 * @param {Object} [options={}] - Validation options
 * @param {boolean} [options.showErrors=true] - Whether to show error messages
 * @param {Function} [options.onError] - Callback on error
 * @returns {Object} Validation result with isValid, errors, and values properties
 */
export function validateForm(form, validationRules, options = {}) {
  const { showErrors = true, onError } = options;
  const inputs = form.querySelectorAll('input, select, textarea');
  const errors = {};
  const values = {};
  let isValid = true;
  
  inputs.forEach(input => {
    const name = input.name;
    if (!name) return;
    
    // Skip inputs without validation rules
    if (!validationRules[name]) {
      // Still collect the value
      if (input.type === 'checkbox') {
        values[name] = input.checked;
      } else if (input.type === 'radio') {
        if (input.checked) {
          values[name] = input.value;
        }
      } else {
        values[name] = input.value;
      }
      return;
    }
    
    // Validate the input
    const result = validateInput(input, validationRules[name]);
    
    // Collect the value
    if (input.type === 'checkbox') {
      values[name] = input.checked;
    } else if (input.type === 'radio') {
      if (input.checked) {
        values[name] = input.value;
      }
    } else {
      values[name] = input.value;
    }
    
    // Handle validation result
    if (!result.isValid) {
      isValid = false;
      errors[name] = result.message;
      
      if (showErrors) {
        showInputError(input, result.message);
      }
    } else if (showErrors) {
      clearInputError(input);
    }
  });
  
  if (!isValid && onError) {
    onError(errors);
  }
  
  return { isValid, errors, values };
}

/**
 * Show error for form input
 * @function showInputError
 * @param {HTMLElement} input - Input element
 * @param {string} message - Error message
 */
export function showInputError(input, message) {
  const formGroup = input.closest('.form-group') || input.parentElement;
  input.classList.add('input-error');
  
  // Check if error message element already exists
  let errorElement = formGroup.querySelector('.input-error-message');
  
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'input-error-message';
    formGroup.appendChild(errorElement);
  }
  
  errorElement.textContent = message;
}

/**
 * Clear error for form input
 * @function clearInputError
 * @param {HTMLElement} input - Input element
 */
export function clearInputError(input) {
  const formGroup = input.closest('.form-group') || input.parentElement;
  input.classList.remove('input-error');
  
  const errorElement = formGroup.querySelector('.input-error-message');
  if (errorElement) {
    errorElement.remove();
  }
}

/**
 * Prevent form submission and handle with callback
 * @function handleFormSubmit
 * @param {HTMLFormElement} form - Form element
 * @param {Function} callback - Callback function
 * @param {Object} [validationRules={}] - Validation rules
 */
export function handleFormSubmit(form, callback, validationRules = {}) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const result = Object.keys(validationRules).length > 0
      ? validateForm(form, validationRules)
      : { isValid: true, values: getFormValues(form), errors: {} };
    
    if (result.isValid) {
      callback(result.values, form);
    }
  });
}

/**
 * Get all form values as an object
 * @function getFormValues
 * @param {HTMLFormElement} form - Form element
 * @returns {Object} Form values
 */
export function getFormValues(form) {
  const formData = new FormData(form);
  const values = {};
  
  formData.forEach((value, key) => {
    if (values[key] !== undefined) {
      if (!Array.isArray(values[key])) {
        values[key] = [values[key]];
      }
      values[key].push(value);
    } else {
      const input = form.querySelector(`[name="${key}"]`);
      if (input && input.type === 'checkbox') {
        values[key] = input.checked;
      } else {
        values[key] = value;
      }
    }
  });
  
  return values;
}

/**
 * Set form values from an object
 * @function setFormValues
 * @param {HTMLFormElement} form - Form element
 * @param {Object} values - Values to set
 */
export function setFormValues(form, values) {
  Object.entries(values).forEach(([name, value]) => {
    const inputs = form.querySelectorAll(`[name="${name}"]`);
    
    inputs.forEach(input => {
      if (input.type === 'checkbox') {
        input.checked = !!value;
      } else if (input.type === 'radio') {
        input.checked = input.value === value.toString();
      } else if (input.tagName === 'SELECT') {
        const options = Array.from(input.options);
        options.forEach(option => {
          option.selected = option.value === value.toString();
        });
      } else {
        input.value = value !== undefined && value !== null ? value : '';
      }
    });
  });
} 