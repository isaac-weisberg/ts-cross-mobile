export interface UserDataStats {
    pigletsBorn: number
}

export interface UserData {
    firstName: string
    lastName: string
    phonenumber: string
    timestamp: number
    stats: UserDataStats
}

export interface IUserDataService {
    getUserData(): Promise<UserData>
}