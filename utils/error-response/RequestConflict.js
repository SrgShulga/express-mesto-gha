class RequestConflict extends Error {
  constructor(message) {
    super(message);
    this.status = 409;
    this.name = 'Request Conflict';
  }
}

module.exports = RequestConflict;
