
const isLoggedIn = () => {
    return (getJWTToken() !== undefined);
}

const getSession = () => {
    let session = {
        "credentials": {
            "accessToken": undefined
        }
    };
    if (sessionStorage.getItem('gisp.session')){
        session = JSON.parse(sessionStorage.getItem('gisp.session'));
    }
    return session;
}

const setSession = session => {
    sessionStorage.setItem('gisp.session', JSON.stringify(session));
}

const removeSession = () => {
    sessionStorage.removeItem('gisp.session');
}

const getJWTToken = () => {
    return getSession().credentials.idToken;
}

const getEmail = () => {
    return getSession().user.email;
}

export default {
    setSession,
    isLoggedIn,
    getJWTToken,
    getEmail,
    removeSession
}
