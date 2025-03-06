
export const getGoogleOAuthConfig = (code: string) => {
    return {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "http://localhost:8080/login/google",
        grant_type: "authorization_code",
    }
}