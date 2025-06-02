import { useState, useCallback } from 'react';

/**
 * Custom hook for form handling
 * @param {Object} initialValues - Initial form values
 * @param {Function} onSubmit - Form submission handler
 * @param {Function} validate - Form validation function
 * @returns {Object} Form state and methods
 */
const useForm = (initialValues = {}, onSubmit = () => {}, validate = () => ({})) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input change
   * @param {Event} e - Input change event
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues(prevValues => ({
      ...prevValues,
      [name]: fieldValue
    }));
  }, []);

  /**
   * Handle input blur
   * @param {Event} e - Input blur event
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
    
    // Validate field on blur
    const validationErrors = validate(values);
    setErrors(validationErrors);
  }, [values, validate]);

  /**
   * Handle form submission
   * @param {Event} e - Form submission event
   */
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    // Validate all fields
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // If no errors, submit the form
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validate, onSubmit]);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Set form values programmatically
   * @param {Object} newValues - New form values
   */
  const setFormValues = useCallback((newValues) => {
    setValues(newValues);
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormValues
  };
};

export default useForm;