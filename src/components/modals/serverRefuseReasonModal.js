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

const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name: 'serverRefuseReasonModal'
    },
    async execute(interaction, client) {
        const embed = EmbedBuilder.from(interaction.message.embeds[0]);

        const reasonInput = interaction.fields.getTextInputValue("reason");

        embed.setColor('#d12c2c')
            .setTitle("Formulário Recusado")
            .addFields([
                { name: "Recusado pelo motivo", value: `${reasonInput || "Sem Motivo"}`, inline: true },
                { name: "Recusado por", value: `${interaction.user} (${interaction.user.id})`, inline: true },
            ])

        await interaction.message.edit({ embeds: [embed], components: [] });

        await interaction.message.thread.setArchived(true);

        const guildModel = require('../../models/guild.js');
        const guildDoc = await guildModel.findByIdAndDelete(interaction.customId.split(':')[1]);

        const member = await interaction.guild.members.fetch(guildDoc.representative).catch(() => null);
        const content = `O servidor \`${guildDoc.name}\` foi recusado da EPF.`;
        if(member) {
            await member
                .send(reasonInput ? `${content}\nMotivo: ${reasonInput}` : content)
                .catch(async () => {
                    await interaction.reply({
                        content: "Não foi possível entrar em contato com o representante do servidor",
                        ephemeral: true,
                    });
                });
        }

        await interaction[interaction.replied || interaction.deferred ? 'followUp' : 'reply']({
            content: "Servidor Recusado",
            ephemeral: true,
        });
    }
}