export class AuthStorageService {
  private static readonly TOKEN_KEY = 'token';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static hasToken(): boolean {
    return !!this.getToken();
  }

  static clearAll(): void {
    localStorage.clear();
  }
}
