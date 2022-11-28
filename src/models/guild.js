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

const {Schema, model} = require('mongoose');

const guildSchema = new Schema({
    _id: {
        type: String,
        match: /^\d{17,19}$/,
    },
    role: {
        type: String,
        match: /^\d{17,19}$/,
    },
    representative: {
        type: String,
        match: /^\d{17,19}$/,
        required: true,
        index: true,
    },
    invite: {
        type: String,
        match: /^\w+$/,
        required: true,
    },
    name: {
        type: String,
        minLength: 2,
        maxLength: 100,
        required: true,
        index: true,
    },
    owner: {
        type: String,
        match: /^\d{17,19}$/,
        index: true,
    },
    pending: Boolean,
});

guildSchema.pre('findOneAndDelete', async function(){
    const memberModel = require('./member.js');
    await memberModel.deleteMany({guild: this.getQuery()._id});
});

module.exports = model('guild', guildSchema);