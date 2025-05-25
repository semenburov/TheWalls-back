// Базова адреса API клієнта (наприклад, для формування посилань у листах)
export const API_URL = 'http://localhost:4000'

// Базове посилання для підтвердження email (додається токен підтвердження)
export const VERIFY_EMAIL_URL = `${API_URL}/verify-email?token=`
