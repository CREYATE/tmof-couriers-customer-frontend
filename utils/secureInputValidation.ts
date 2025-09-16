
import DOMPurify from 'isomorphic-dompurify';

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const validateAddress = (address: string): boolean => {
  const sanitized = sanitizeInput(address);
  return sanitized.length >= 5 && sanitized.length <= 500;
};

export const validateWeight = (weight: string): boolean => {
  const numWeight = parseFloat(weight);
  return !isNaN(numWeight) && numWeight > 0 && numWeight <= 1000;
};

export const validateDistance = (distance: string): boolean => {
  const numDistance = parseFloat(distance);
  return !isNaN(numDistance) && numDistance > 0 && numDistance <= 2000;
};

export const validateItemValue = (value: string): boolean => {
  const numValue = parseFloat(value);
  return !isNaN(numValue) && numValue >= 0 && numValue <= 1000000;
};

export const validateDescription = (description: string): boolean => {
  const sanitized = sanitizeInput(description);
  return sanitized.length <= 1000;
};

export const rateLimitCheck = (() => {
  const attempts = new Map<string, { count: number; resetTime: number }>();
  
  return (identifier: string, maxAttempts: number = 5, windowMs: number = 300000): boolean => {
    const now = Date.now();
    const userAttempts = attempts.get(identifier);
    
    if (!userAttempts || now > userAttempts.resetTime) {
      attempts.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (userAttempts.count >= maxAttempts) {
      return false;
    }
    
    userAttempts.count++;
    return true;
  };
})();
