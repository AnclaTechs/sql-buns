class RecordDoesNotExist extends Error {
  constructor(message = "The requested record does not exist.") {
    super(message);
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class NonUniqueRecordError extends Error {
  constructor(message = "This query returned more than one record.") {
    super(message);
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class UnsupportedSQLEngineError extends Error {
  constructor(engine) {
    super(`Unsupported SQL engine: "${engine}".`);
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = {
  RecordDoesNotExist,
  NonUniqueRecordError,
  UnsupportedSQLEngineError,
};
