class User {

    constructor(userId, userName) {
        this.userId = userId;
        this.userName = userName;
        return this;
    }

    getUserId() {
        return this.userId;
    }

    getUserName() {
        return this.userName;
    }

    getJson() {
        return {
            userId: this.userId,
            userName: this.userName
        };
    }
}

module.exports = User;