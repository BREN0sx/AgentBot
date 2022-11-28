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

const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require ('discord.js')

module.exports = {
    data: {
        name: `form-menu`
    },
    async execute(interaction, client) {
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

        const question1 = new TextInputBuilder()
        .setCustomId(`question1`)
        .setLabel(`Você representa esse servidor?`)
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setMinLength(3)
        .setMaxLength(3);


        const question2 = new TextInputBuilder()
        .setCustomId(`question2`)
        .setLabel(`Conte-nos mais sobre esse servidor`)
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(20)
        .setMaxLength(150);

        const question3 = new TextInputBuilder()
        .setCustomId(`question3`)
        .setLabel(`Por que seu servidor deveria ser aceito?`)
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(20)
        .setMaxLength(250);

        const question4 = new TextInputBuilder()
        .setCustomId(`question4`)
        .setLabel(`Por onde você conheceu a EPF?`)
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(20)
        .setMaxLength(150);

        modal.addComponents(new ActionRowBuilder().addComponents(serverLink));
        modal.addComponents(new ActionRowBuilder().addComponents(question1));
        modal.addComponents(new ActionRowBuilder().addComponents(question2));
        modal.addComponents(new ActionRowBuilder().addComponents(question3));
        modal.addComponents(new ActionRowBuilder().addComponents(question4));

        await interaction.showModal(modal);
    }
}