export function generateId(name: string): string {
  let num: number;
  do {
    num = Math.floor(Math.random() * 999);
  } while (num <= 100);
  const adminId = name.substring(0, 3).toUpperCase() + num;
  return adminId;
}
