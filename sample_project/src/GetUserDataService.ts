// gen
export interface UserDataStats {
    pigletsBorn: number
}

// gen
type UserKind = 'admin' | 'dopeDealer' | 'janitor' | 'teacher' | 'designer' 

// gen
export interface UserData {
    metaTypeName: 'UserData'
    firstName: string
    lastName: string
    phonenumber: string
    timestamp: number
    stats: UserDataStats
    kind: UserKind
}

// gen
export interface IUserDataService {
    voidMethod(): void
    getUserData(): Promise<UserData>
}


const enum OppaAiDibidi {
    skibidiToilet = 'sdf'
}
