// Copyright (C) 2022  BRENOsx

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

const { model, Schema } = require('mongoose');
const config = require('../config');

const constantsSchema = new Schema({
  _id: {
    type: String,
    match: /^\d{17,19}$/
  },
  lastGuildsChannelUpdate: {
    type: Date,
    default: new Date()
  },
  updatingGuildsChannel: {
    type: Boolean,
    default: false
  },
  scheduledUpdate: {
    type: Boolean,
    default: false
  }
});

constantsSchema.statics.getConstants = async function() {
  return await this.findById(config.agent) || await this.create({ _id: config.agent })
}

constantsSchema.statics.updateConstants = async function(data) {
  return await this.findByIdAndUpdate(
    config.agent,
    data,
    {
      new: true,
      upsert: true,
      setDefaultOnInsert: true
    }
  )
}

module.exports = model('constants', constantsSchema);