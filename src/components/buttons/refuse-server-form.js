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

const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: {
        name: "refuse-server-form"
    },
    async execute(interaction, client) {
        const modal = new ModalBuilder()
            .setTitle("Elite Penguin Force")
            .setCustomId(`serverRefuseReasonModal:${interaction.customId.split(':')[1]}`);

        const reasonInput = new TextInputBuilder()
            .setCustomId("reason")
            .setLabel("Defina um motivo")
            .setRequired(false)
            .setStyle(TextInputStyle.Paragraph);

        modal.addComponents(new ActionRowBuilder().setComponents(reasonInput));

        await interaction.showModal(modal);
    }
}