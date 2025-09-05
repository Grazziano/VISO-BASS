export interface IOwner {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
}
