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

const { ContextMenuCommandBuilder, PermissionsBitField, ApplicationCommandType, EmbedBuilder } = require('discord.js');
const Command = require('../structures/command.js');

class ListstaffsCommand extends Command{
    constructor(){
        super({
            active: true,
            data: new ContextMenuCommandBuilder()
                .setName('liststaffs')
                .setNameLocalizations({
                    "en-GB": 'List staffs',
                    "en-US": 'List staffs',
                    "pt-BR": 'Listar staffs',
                })
                .setDMPermission(true)
                .setDefaultMemberPermissions(PermissionsBitField.Flags.ViewChannel)
                .setType(ApplicationCommandType.User),
        });
    }

    async execute(interaction){
        const memberModel = require('../models/member.js');
        require('../models/guild.js');
        const memberDocs = await memberModel.find({user: interaction.targetUser.id}).populate('guild');
        const embed = new EmbedBuilder()
            .setColor(0x2f3136)
            .setAuthor({
                name: `Staffs que ${interaction.targetUser.tag} faz parte`,
                iconURL: interaction.targetUser.avatarURL({dynamic: true}),
            });
        const ownedGuilds = memberDocs.filter(doc => (doc.user === doc.guild.owner));
        if(ownedGuilds.length) embed.addFields({
            name: 'Dono de',
            value: ownedGuilds
                .map(doc => (
                    `[\`${doc.guild.name}\`](https://discord.gg/${doc.guild.invite})` +
                    `${(doc.guild.representative === interaction.targetUser.id) ? ' **[REPRESENTANTE]**' : ''}`
                ))
                .join('\n'),
        });
        const adminGuilds = memberDocs.filter(doc => (doc.admin && (doc.user !== doc.guild.owner)));
        if(adminGuilds.length) embed.addFields({
            name: 'Administra',
            value: adminGuilds
                .map(doc => (
                    `[\`${doc.guild.name}\`](https://discord.gg/${doc.guild.invite})` +
                    `${(doc.guild.representative === interaction.targetUser.id) ? ' **[REPRESENTANTE]**' : ''}`
                ))
                .join('\n'),
        });
        const modGuilds = memberDocs.filter(doc => !doc.admin);
        if(modGuilds.length) embed.addFields({
            name: 'Modera',
            value: modGuilds
                .map(doc => (
                    `[\`${doc.guild.name}\`](https://discord.gg/${doc.guild.invite})` +
                    `${(doc.guild.representative === interaction.targetUser.id) ? ' **[REPRESENTANTE]**' : ''}`
                ))
                .join('\n'),
        });
        await interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    }
}

module.exports = new ListstaffsCommand();