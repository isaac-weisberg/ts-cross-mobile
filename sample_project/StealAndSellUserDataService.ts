import { IUserDataService, UserData } from './GetUserDataService'
import { IUserDataSellingService } from './UserDataSellingService'

export interface Opti<T, K, L> {

}
export interface OptiHaver {
    opti: Opti<string, Opti<number, number, number>, 'penis'>
}

export interface IStealAndSellUserDataService {
    genericallyReturnMeSomething(): Promise<Opti<string, Opti<number, number, number>, 'penis'>>
    stealAndSellUserData(): Promise<void>
}

export class StealAndSellUserDataService implements IStealAndSellUserDataService {
    userDataSellingService: IUserDataSellingService
    userDataService: IUserDataService

    constructor(
        userDataSellingService: IUserDataSellingService,
        userDataService: IUserDataService
    ) {
        this.userDataSellingService = userDataSellingService
        this.userDataService = userDataService
    }

    genericallyReturnMeSomething(): Promise<Opti<string, Opti<number, number, number>, 'penis'>> {
        return new Promise(_ => {})
    }

    async stealAndSellUserData() {
        let userData: UserData
        try {
            userData = await this.userDataService.getUserData()
        } catch(e) {
            throw new Error('getUserData failed')
        }
        
        try {
            await this.userDataSellingService.sellUserData(userData)
        } catch(e) {
            throw new Error('sellUserData failed')
        }
    }
}
