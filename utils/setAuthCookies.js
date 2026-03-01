export const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie("token", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: false, 
        maxAge: 15 * 60 * 1000
    });

    if (refreshToken) {
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
    }
};