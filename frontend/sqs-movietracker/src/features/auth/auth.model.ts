export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => Promise<void>;
}
