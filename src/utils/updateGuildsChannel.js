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

const { EmbedBuilder } = require('discord.js')

module.exports = async (client) => {
    const constantsModel = require('../models/constants')
    await constantsModel.updateConstants({ updatingGuildsChannel: true, lastGuildsChannelUpdate: new Date() });
    const config = require('../config')
    const channel = client.channels.cache.get(config.serversChannel);
    const messages = await channel.messages.fetch();
    const minute = 60 * 1000;
    if(messages.last()?.createdTimestamp > (Date.now() - ((2 * 7 * 24 * 60 * minute) - minute))){
        await channel.bulkDelete(100);
    }
    else{
        for(const message of messages.values()) await message.delete();
    }
    const guildModel = require('../models/guild.js');
    let guildCount = 0;
    for(let i = 65; i < 91; i++){
        const letter = String.fromCharCode(i);
        const guildDocs = await guildModel.find({
            name: {$regex: new RegExp(`^[^a-z]*${letter}`, 'i')},
            pending: {$ne: true},
        });
        if(!guildDocs.length) continue;
        guildCount += guildDocs.length;
        const embed = new EmbedBuilder()
            .setTitle(`Comunidades (${letter})`)
            .setImage(`https://cdn.discordapp.com/attachments/946097024804212777/1037824425191542845/Divisoria.png`)
            .setColor(0x5765f0)
            .setDescription(
                guildDocs
                    .map(doc => {
                        let str = `[\`${doc.name.replaceAll('`', 'ˋ')}\`](https://discord.gg/${doc.invite})`;
                        return doc.role ? `${str} | <@&${doc.role}>` : str;
                    })
                    .join('\n'),
            );
        await channel.send({embeds: [embed]});
    }
    await channel.setTopic(`<:icons_discover:859429432535023666>  | **${guildCount} servidores associados.**`);
    await constantsModel.updateConstants({ updatingGuildsChannel: false });
}