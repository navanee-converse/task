import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const flag = await bcrypt.compare(password, hashedPassword);
  return flag;
}
