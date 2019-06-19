class UserToken {

    constructor() {
        this.loggedIn = false;
        this.isStaff = false;
        this.user = {};
        return this;
    }

    setLoggedIn(loggedIn) {
        this.loggedIn = loggedIn;
        return this;
    }

    setIsStaff(isStaff) {
        this.isStaff = isStaff;
        return this;
    }

    setUser(user) {
        this.user = user;
        return this;
    }

    getUser() {
        return this.user;
    }

    getLoggedIn() {
        return this.loggedIn;
    }

    getIsStaff() {
        return this.isStaff;
    }
}

module.exports = UserToken;