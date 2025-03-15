import axios from "axios";

import {injectable} from 'inversify'

@injectable()
export class facebookAuthService {
    async getUserByFacebookIdAndAccessToken (userId: string, token: string) {
        let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userId}?fields=id,first_name,last_name,email&access_token=${token}`;
        let result = axios.get(urlGraphFacebook)
        return result
    }
}