// models/User.ts
import { Collection } from 'mongodb';
import { db } from '../lib/db';

export interface User {
  _id?: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

export const Users = (): Collection<User> => {
  return db.collection<User>('users');
};
