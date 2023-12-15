import { UserData } from "./GetUserDataService";

// gen
export interface IUserDataSellingService {
    sellUserData(userData: UserData): Promise<void>
}
