const mockDB = {
  user: {},
};

class Model {
  constructor(data, key = 'model') {
    this.key = key;
    this.data = data;
  }

  sayHi() {
    console.log(`HI! I am a ${this.key}, id: ${this.id}`);
  }

  static all() {
    return Object.values(mockDB[new this().key]);
  }

  static find(id) {
    return new this(mockDB[new this().key][id]);
  }

   getValue(id, param) {
    // getValue: (id, param) => util.knex.select(param).from(db).where('id', id),
  }

  save() {
    mockDB[this.key][this.id] = this.data;
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
