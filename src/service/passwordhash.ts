import bcrypt from "bcrypt"

export async function hashPassword(password:string):Promise<string>
{
    let hashedPassword = await bcrypt.hash(password,10)
    return hashedPassword
}

export async function verifyPassword(password:string,hashedPassword:string):Promise<boolean>
{
    let flag = await bcrypt.compare(password,hashedPassword)
    return flag
}