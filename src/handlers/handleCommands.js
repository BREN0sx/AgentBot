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

const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const fs = require('fs');
const path = require('path');
const config = require('../config.js');

module.exports = async client => {
    commandArray = [];
    fs.readdirSync(path.join(__dirname, '..', 'commands')).filter(file => file.endsWith('.js')).forEach(file => {
        const command = require(`../commands/${file}`);
        if(!command.active) return;
        client.commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
        console.log(`Command: ${command.data.name} has been passed through the handler`);
    });
    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
    try {
        console.log('Reiniciando comandos')

        await rest.put(
            Routes.applicationGuildCommands(config.agent, config.guild), {
                body: commandArray,
            });
        console.log('Comandos reiniciados');
    } catch (error) {
        console.error(error);
    }
}