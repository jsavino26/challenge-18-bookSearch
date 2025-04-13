import { jwtDecode } from 'jwt-decode';

interface UserToken {
  name: string;
  exp: number;
}

class AuthService {
  // Get user data
  getProfile() {
    return jwtDecode(this.getToken() || '');
  }

  // Check if the user is logged in
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Check if the token is expired
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<UserToken>(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }

  // Get the token from localStorage
  getToken() {
    return localStorage.getItem('id_token');
  }

  // Save the token to localStorage and redirect to the homepage
  login(idToken: string) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  // Remove the token from localStorage and redirect to the homepage
  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();
