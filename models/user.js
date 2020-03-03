const Model = require('./_model');

class User extends Model {
  constructor(data) {
    super(data, 'user');
  }

  get id() {
    return this.data.googleId;
  }
  get googleId() {
    return this.data.googleId;
  }
  get imageUrl() {
    return this.data.imageUrl;
  }
  get email() {
    return this.data.email;
  }
  get name() {
    return this.data.name;
  }
  get givenName() {
    return this.data.givenName;
  }
  get familyName() {
    return this.data.familyName;
  }
}

module.exports = User;
