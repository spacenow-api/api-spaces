interface IUser {
  id: string;
  email: string;
  password: string;
  emailConfirmed: number;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  userBanStatus: number;
  role: string;
}

export { IUser };