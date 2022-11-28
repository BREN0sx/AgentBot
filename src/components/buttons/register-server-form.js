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

const { ButtonBuilder, ModalBuilder, EmbedBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ButtonStyle } = require ('discord.js');

module.exports = {
    data: {
        name: `register-server-form`
    },
    async execute(interaction, client) {
        const confirmationEmbed = new EmbedBuilder()
            .setTitle("Leia antes de continuar")
            .setDescription(
                "Esse formulário deve ser preenchido para associar um **novo servidor** à EPF, se você deseja apenas " +
                "ser registrado em um servidor que já faz parte da comunidade, por favor peça para o representante do" +
                " servidor em questão te registrar.\n\n" +
                "Ao confirmar, você concorda que você será o representante do servidor dentro da EPF (Elite Penguin " +
                "Force). E que a responsabilidade da sua staff dentro do nosso servidor será inteiramente sua.\n\n" +
                "Tenha em mente de que a resposta do formulário será enviada diretamente em sua DM, então mantenha " +
                "ela aberta para receber a resposta."
            )
            .setColor(0x2f3136);
        
        const buttonConfirm = new ButtonBuilder()
            .setCustomId("collector:confirm")
            .setLabel("Confirmar")
            .setStyle(ButtonStyle.Success);

        const buttonCancel = new ButtonBuilder()
            .setCustomId("collector:cancel")
            .setLabel("Cancelar")
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .setComponents(buttonConfirm, buttonCancel);
        
        const reply = await interaction.reply({ embeds: [confirmationEmbed], components: [row], ephemeral: true, fetchReply: true });

        const filter = (i) => i.user.id === interaction.user.id;
        const collector = reply.createMessageComponentCollector({
            filter,
            time: 60000,
            max: 1
        });

        collector.on("collect", async (i) => {
            if (i.customId === "collector:confirm") {
                const modal = new ModalBuilder()
                    .setCustomId(`serverRequestModal`)
                    .setTitle(`Elite Penguin Force`)

                const serverLink = new TextInputBuilder()
                    .setCustomId(`serverLink`)
                    .setLabel(`Link permanente do servidor`)
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                    .setMinLength(10)
                    .setMaxLength(30);

                const serverRole = new TextInputBuilder()
                    .setCustomId(`serverRole`)
                    .setLabel(`Qual o seu cargo nesse servidor?`)
                    .setRequired(true)
                    .setPlaceholder("\"mod\", \"adm\", ou \"dono\" (posse)")
                    .setStyle(TextInputStyle.Paragraph)
                    .setMinLength(3)
                    .setMaxLength(4);

                const serverAbout = new TextInputBuilder()
                    .setCustomId(`serverAbout`)
                    .setLabel(`Conte-nos mais sobre esse servidor`)
                    .setRequired(true)
                    .setStyle(TextInputStyle.Paragraph)
                    .setMinLength(20)
                    .setMaxLength(150);

                const epfAbout = new TextInputBuilder()
                    .setCustomId(`epfAbout`)
                    .setLabel(`Por onde você conheceu a EPF?`)
                    .setRequired(true)
                    .setStyle(TextInputStyle.Paragraph)
                    .setMinLength(10)
                    .setMaxLength(150);

                modal.addComponents(new ActionRowBuilder().addComponents(serverLink));
                modal.addComponents(new ActionRowBuilder().addComponents(serverRole));
                modal.addComponents(new ActionRowBuilder().addComponents(serverAbout));
                modal.addComponents(new ActionRowBuilder().addComponents(epfAbout));

                return await i.showModal(modal);
            }
            await i.reply({
                content: 'Operação cancelada.',
                ephemeral: true,
            });
        });
        collector.on('end', async collected => {
            if(!reply.editable) return;
            if(collected.size){
                buttonConfirm.setDisabled(true);
                buttonCancel.setDisabled(true);
                row.setComponents(buttonConfirm, buttonCancel);
                return await interaction.editReply({
                    embeds: [confirmationEmbed],
                    components: [row],
                });
            }
            await interaction.editReply({
                content: 'Tempo esgotado.',
                embeds: [],
                components: [],
            });
        });
    }
}