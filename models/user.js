const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt');
// const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  firstName: { type: String},
  lastName: { type: String},
  bio: { type: String, minlength: 5, maxlength: 140 },
  image: { type: String, get: addImagePath, set: removeImagePath },
  facebookId: { type: String },
  instagramId: { type: String },
  passwordHash: { type: String },
  following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
},{
  timestamps: true
});

function setPassword(value){
  this._password = value;
}

function setPasswordConfirmation(passwordConfirmation) {
  this._passwordConfirmation = passwordConfirmation;
}

function validatePassword(password){
  return bcrypt.compareSync(password, this.passwordHash);
}

function addImagePath(image){
  if (!image) return null;
  if(image.match(/^http/)) return image;
  return `https://s3-eu-west-1.amazonaws.com/ga-travel-app/${image}`;
}

function removeImagePath(fullPath){
  if(fullPath.match(/amazonaws/)) return fullPath.split('/').splice(-1)[0];
  return fullPath;
}

userSchema
  .virtual('password')
  .set(setPassword);

userSchema
  .virtual('passwordConfirmation')
  .set(setPasswordConfirmation);


userSchema.methods.validatePassword = validatePassword;

userSchema.set('toJSON', {
  getters: true,
  transform: function(doc, json) {
    delete json.passwordHash;
    delete json.email;
    delete json.__v;
    return json;
  }
});

function preValidate(next) {
  if (this.isNew) {
    if (!this._password && !this.facebookId && !this.instagramId) {
      this.invalidate('password', 'A password is required.');
    }
  }


  if(this._password) {
    if (this._password.length < 6) {
      this.invalidate('password', 'must be at least 6 characters.');
    }

    if (this._password !== this._passwordConfirmation) {
      this.invalidate('passwordConfirmation', 'Passwords do not match.');
    }
  }
  next();

}

userSchema.pre('validate', preValidate);

function preSave(next) {
  if(this._password) {
    this.passwordHash = bcrypt.hashSync(this._password, bcrypt.genSaltSync(8));
  }

  next();
}

userSchema.pre('save', preSave);

module.exports = mongoose.model('User', userSchema);
