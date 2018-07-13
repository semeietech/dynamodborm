class Repository {
  constructor(Model, connection) {
    this.Model = Model
    this.connection = connection
    this.bucket = []
  }
  async get(id) {
    return this.connection.get(this.Model, id)
  }

  async query(params, {
    pageSize,
    limit
  } = {}) {
    const options = {
      pageSize: pageSize || limit || 10,
      limit: limit || pageSize || 100
    }
    this.bucket = await this.connection.query(this.Model, params, options)
    return this.bucket
  }

  async find({
    pageSize,
    lastIndex,
    query,
    indexKey,
    limit
  } = {}) {
    const options = {
      pageSize: pageSize || limit || 25,
      startKey: lastIndex && new this.Model({ [indexKey || 'id']: lastIndex }),
      limit: limit || pageSize || 25
    }
    if (!query) {
      this.bucket = await this.connection.scan(this.Model, options)
      return this.bucket
    }

    return this.query(query, options)
  }
}

export default Repository
