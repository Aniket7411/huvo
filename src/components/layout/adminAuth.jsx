import { isLoggedIn, getUserData } from "../../server/user";
import Unauthorised from "../../pages/unauthorised";

export default function AdminAuth({ children }) {
    if(isLoggedIn()){
        if(getUserData()?.role === 'SELLER' || getUserData()?.role === 'ADMIN'){
            return children
        }
        return Unauthorised("/")
    }
    return Unauthorised("/login")
}
