module.exports = class CsUserList {
    
    constructor() {
        this.list = [];
        return this;
    }

    getList() {
        return this.list;
    }

    getCount() {
        return this.list.length;
    }

    getCsUser(customerId) {
        let index = this.list.find((value) => {
            return value.getCustomerId() === customerId;
        });
        if (index) {
            return index;
        }
        return null;
    }

    getCsUsersByStaffId(staffId) {
        return this.list.filter((value) => {
            return value.getStaffId() === staffId;
        });
    }

    getCsUserByCustomerIdAndStaffId(customerId, staffId) {
        let index = this.list.find((value) => {
            return value.getCustomerId() === customerId && 
                value.getStaffId() === staffId;
        });
        if (index) {
            return index;
        }
        return null;
    }

    getFirst() {
        return this.list.shift();
    }

    addCsUser(csUser) {
        this.list.push(csUser);
        return this;
    }

    removeCsUser(csUser) {
        let index = this.list.indexOf(csUser);
        if (index >= 0) {
            this.list.splice(index, 1);
        }
        return this;
    }
}