// src/utils/token.js
export const TokenService = {
  // Lưu token
  setToken(token) {
    console.log("1",token)
    localStorage.setItem('access_token', token)//lưu token dạng key value
  },

  // Lấy token
  getToken() {
    return localStorage.getItem('access_token')
  },
  // Xóa token
  removeToken() {
    localStorage.removeItem('access_token')
  },

  // Kiểm tra có token không
  hasToken() {
    return !!this.getToken()
  },

  // Giải mã payload (không verify)
  decodeToken(token) {
    try {
      const payload = token.split('.')[1]
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
      return JSON.parse(decoded)
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  },

  // Kiểm tra token hết hạn chưa
  isTokenExpired(token) {
    const decoded = this.decodeToken(token)
    if (!decoded || !decoded.exp) return true

    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp < currentTime
  }
}
