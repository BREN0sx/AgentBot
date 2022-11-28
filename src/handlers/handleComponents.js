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

const { ModalSubmitFields, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = async client => {
    fs
        .readdirSync(path.join(__dirname, '..', 'components'))
        .forEach(folder => {
            client[folder] = fs
                .readdirSync(path.join(__dirname, '..', 'components', folder))
                .filter(file => file.endsWith('.js'))
                .map(file => require(`../components/${folder}/${file}`))
                .reduce((col, component) => col.set(component.data.name, component), new Collection());
        });
}