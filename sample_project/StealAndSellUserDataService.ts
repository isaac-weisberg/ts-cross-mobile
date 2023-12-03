import { IUserDataService, UserData } from './GetUserDataService'
import { IUserDataSellingService } from './UserDataSellingService'

export interface IStealAndSellUserDataService {
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
