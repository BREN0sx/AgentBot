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
        name: 'devRefuseReasonModal'
    },
    async execute(interaction, client) {
        const embed = EmbedBuilder.from(interaction.message.embeds[0]);

        const reasonInput = interaction.fields.getTextInputValue("reason");

        embed.setColor('#d12c2c')
            .setTitle("Pedido Recusado")
            .addFields([
                { name: "Recusado pelo motivo", value: `${reasonInput || "Sem Motivo"}`, inline: true },
                { name: "Recusado por", value: `${interaction.user} (${interaction.user.id})`, inline: true },
            ])

        await interaction.message.edit({ embeds: [embed], components: [] });

        await interaction.message.thread.setArchived(true);

        const member = await interaction.guild.members.fetch(interaction.customId.split(':')[1]).catch(() => null);
        const content = 'Lamentamos informar que a sua requisição de cargo de desenvolvedor na EPF foi recusada.';
        if (member) {
            await member
                .send(reasonInput ? `${content}\nMotivo: ${reasonInput}` : content)
                .catch(async () => {
                    await interaction.reply({
                        content: "Não foi possível entrar em contato com o membro",
                        ephemeral: true,
                    });
                });
        }

        await interaction[interaction.replied || interaction.deferred ? 'followUp' : 'reply']({
            content: "Desenvolvedor Recusado",
            ephemeral: true,
        });
    }
}

