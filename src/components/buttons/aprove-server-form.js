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

const { EmbedBuilder, parseWebhookURL } = require("discord.js");
const config = require("../../config");
const guildModel = require("../../models/guild");

module.exports = {
    data: {
        name: "aprove-server-form"
    },
    async execute(interaction, client) {
        const embed = EmbedBuilder.from(interaction.message.embeds[0]);

        await interaction.deferReply({ephemeral: true});

        const guildDoc = await guildModel.findById(interaction.customId.split(':')[1]);

        const guildMember = await interaction.guild.members.fetch(guildDoc.representative).catch(() => null);
        if (!guildMember) return await interaction.editReply(`O representante não está mais no servidor (${guildDoc.representative})`);

        guildDoc.pending = false;
        await guildDoc.save();

        if(guildDoc.owner === guildMember.id){
            await guildMember.roles.add(config.levels[2]);
        }
        else{
            const memberModel = require('../../models/member.js');
            const memberDoc = await memberModel.findOne({
                user: guildMember.id,
                guild: guildDoc._id,
            });
            await guildMember.roles.add(config.levels[+memberDoc.admin]);
        }

        const message = await guildMember.send({ content: `Parabéns, o seu servidor \`${guildDoc.name}\` foi aprovado na EPF!` }).catch(() => null);
        if (!message) await interaction.editReply("Não foi possível entrar em contato com o representante do servidor");

        embed.setColor('#58e600').setTitle("Formulário Aprovado");
        await interaction.message.edit({ embeds: [embed], components: [] });

        await interaction.message.thread.setArchived(true);

        if(interaction.replied){
            await interaction.followUp({
                content: "Servidor Aprovado",
                ephemeral: true,
            });
        }
        else{
            await interaction.editReply("Servidor Aprovado");
        }

        client.emit('updateGuilds', false)

        const webhook = parseWebhookURL(process.env.OFFTOPIC_WEBHOOK);
        await interaction.client.fetchWebhook(webhook.id, webhook.token)
            .then(async (webhook) => {
                await webhook.send({
                    content: `<:icons_djoin:875754472834469948> O servidor **${guildDoc.name}** entrou para a EPF`,
                    username: interaction.guild.name,
                    avatarURL: interaction.guild.iconURL(),
                })
            })
    }
}