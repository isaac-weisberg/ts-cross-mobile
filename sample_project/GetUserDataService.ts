export interface UserDataStats {
    pigletsBorn: number
}

type UserKind = 'admin' | 'dopeDealer' | 'janitor' | 'teacher' | 'designer' 

export interface UserData {
    metaTypeName: 'UserData'
    firstName: string
    lastName: string
    phonenumber: string
    timestamp: number
    stats: UserDataStats
    kind: UserKind
}

export interface IUserDataService {
    getUserData(): Promise<UserData>
}