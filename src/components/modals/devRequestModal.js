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

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const config = require('../../config');

module.exports = {
    data: {
        name: 'devRequestModal'
    },

    async execute(interaction, client) {
        const invite = interaction.fields.getTextInputValue("botInvite");
        const aproveChannel = client.channels.cache.get(config.aproveChannel);

        var regex = /discord\.com\/(api\/)?oauth2\/authorize/gi;
        var bot = null, botInvite = null;

        if (invite !== null) {
            if (regex.test(invite)) {
                const clientId = invite.split("client_id=")[1].split("&")[0];

                bot = await client.users.fetch(clientId).catch(() => null);

                if (clientId !== null) {
                    botInvite = invite.replace(/permissions=[0-9]*/ig, "permissions=0");
                }
            }
        }

        const embed = new EmbedBuilder()
            .setTitle(`Novo formulário - Desenvolvedor`)
            .setColor('#e3ba03')
            .setFields([
                { name: "Enviado por", value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
                { name: "GitHub", value: `${interaction.fields.getTextInputValue("githubLink")}`, inline: true },
                { name: "Atuação", value: `${interaction.fields.getTextInputValue("experienceInfo")}`, inline: true },
                { name: "Exemplo", value: `${interaction.fields.getTextInputValue("example")}`, inline: true },
                { name: "Bot", value: bot ? `${bot?.tag} (${bot?.id})` : "Não tem", inline: true },
                { name: "Convite", value: `${bot ? (botInvite || "Inválido") : "Não tem"}`, inline: true },
            ]);

        const row = new ActionRowBuilder()
            .setComponents(
                new ButtonBuilder()
                    .setCustomId(`aprove-dev-request:${interaction.user.id}`)
                    .setLabel("Aprovar")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`refuse-dev-request:${interaction.user.id}`)
                    .setLabel("Recusar")
                    .setStyle(ButtonStyle.Danger)
            );

        const message = await aproveChannel.send({
            embeds: [embed], components: [row]
        });

        await message.startThread({ name: `Dev ${interaction.user.tag}` });

        await interaction.reply({
            content: 'Seu pedido foi enviado para avaliação.',
            ephemeral: true,
        });
    }
}

