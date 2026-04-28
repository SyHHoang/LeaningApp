
import Cookies from 'js-cookie'
export const TokenService = {
      setAccessToken(token) {
        Cookies.set('accessToken', token, {
          expires: 1/24,
          secure: false,// Chỉ nên đặt secure: true khi sử dụng HTTPS
          sameSite: 'Strict'
        })
        console.log('Access token đã được lưu vào cookie')
      },
      setRefreshToken(token) {
        Cookies.set('refreshToken', token, {
          expires: 7,
          secure: false,// Chỉ nên đặt secure: true khi sử dụng HTTPS
          sameSite: 'Strict'
        })
        console.log('Refresh token đã được lưu vào cookie')
      },
      getAccessToken() {
        console.log('Lấy access token từ cookie')
        return Cookies.get('accessToken')
      },
      getRefreshToken() {
        console.log('Lấy refresh token từ cookie')
        return Cookies.get('refreshToken')
      },
      removeToken() {
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
      }
}
