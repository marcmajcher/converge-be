const mockDB = {
  user: {},
};

class Model {
  constructor(data, table = 'model') {
    this.table = table;
    this.data = data;
  }

  sayHi() {
    console.log(`HI! I am a ${this.table}, id: ${this.id}`);
  }

  static all() {
    return Object.values(mockDB[new this().table]);
  }

  static find(id) {
    return new this(mockDB[new this().table][id]);
  }

   getValue(id, param) {
    // getValue: (id, param) => util.knex.select(param).from(db).where('id', id),
  }

  save() {
    mockDB[this.table][this.id] = this.data;
    return this;
  }

  static create(info) {
    return new this(info).save();
  }

  update(id, data) {
    // update: (id, data) =>
    // util.knex(db).update(data).where('id', id).returning('*'),
  }

  updateValue(id, param, value) {
    // updateValue: (id, param, value) => util.knex(db)
    // .update(param, value).where('id', id).returning(param)
  }
}

module.exports = Model;
