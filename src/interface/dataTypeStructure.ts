export interface token
{
    id: number | string;
    name : string
}

export type header={Authorization:string}

export enum Role
{
    hr = 'hr',
    developer = 'developer',
    designer = 'designer',
    engineer = 'engineer'
}

export enum UserStatus
{
    notViewed = 'NotViewed',
    inProgress = 'WaitingList',
    shortListed ='ShortListed'
}

declare global {
    namespace Express {
      interface Request {
        user: token;  // Add the `user` property with its type (optional)
      }
    }
}

export interface Parameter{
  id:number
}
export interface UpdateStatus
{
  id:number;
  status:UserStatus
}
export interface UpdateUser{
  mail?:string
  password?:string
}

export interface FilterUser
{
  userId?:number
  userName?:string
  status?:UserStatus
}