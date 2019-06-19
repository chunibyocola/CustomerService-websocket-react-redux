class CsUser {

    constructor(customerId) {
        this.customerConnections = [];
        this.customerId = customerId;
        this.staffConnection = null;
        this.questionText = null;
        this.staffId = null;
        this.chatId = null;
        this.customer = null;
        this.staff = null;
        this.chatLogs = [];
        return this;
    }

    cleanToPending() {
        this.staffConnection = null;
        this.questionText = null;
        this.questionText = null;
        this.staffId = null;
        this.staff = null;
        this.chatLogs = [];
    }

    addChatLog(chatLog) {
        this.chatLogs.push(chatLog);
        return this;
    }

    getChatLogsArray() {
        let chatLogs = this.chatLogs.map((item) => (item.getJson()));
        return chatLogs;
    }

    setQuestionText(questionText) {
        this.questionText = questionText;
        return this;
    }

    setStaffConnection(staffConnection) {
        this.staffConnection = staffConnection;
        return this;
    }

    setChatId(chatId) {
        this.chatId = chatId;
        return this;
    }

    setStaffId(staffId) {
        this.staffId = staffId;
        return this;
    }

    setCustomer(customer) {
        this.customer = customer;
        return this;
    }

    setStaff(staff) {
        this.staff = staff;
        return this;
    }

    addCustomerConnection(customerConnection) {
        this.customerConnections.push(customerConnection);
        return this;
    }

    removeOneCustomerConnection(customerConnection) {
        let index = this.customerConnections.indexOf(customerConnection);
        if (index >= 0) {
            this.customerConnections.splice(index, 1);
        }
        return this;
    }

    getCustomerConnections() {
        return this.customerConnections;
    }

    getCustomerId() {
        return this.customerId;
    }

    getStaffConnection() {
        return this.staffConnection;
    }

    getChatId() {
        return this.chatId;
    }

    getStaffId() {
        return this.staffId;
    }

    getQuestionText() {
        return this.questionText;
    }

    getCustomer() {
        return this.customer;
    }

    getStaff() {
        return this.staff;
    }
}

module.exports = CsUser;