import { UserData } from "./GetUserDataService";

export interface IUserDataSellingService {
    sellUserData(userData: UserData): Promise<void>
}
