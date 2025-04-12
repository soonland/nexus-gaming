import { hash, compare } from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = (password: string) => hash(password, SALT_ROUNDS);
export const comparePassword = compare; // réexporter la fonction compare de bcrypt
