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

const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  data: {
    name: "request-dev-role-form"
  },

  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId(`devRequestModal`)
      .setTitle(`Elite Penguin Force`)

    const githubLink = new TextInputBuilder()
        .setCustomId(`githubLink`)
        .setLabel(`O link do seu perfil no GitHub`)
        .setRequired(true)
        .setStyle(TextInputStyle.Short)

    const experienceInfo = new TextInputBuilder()
        .setCustomId(`experienceInfo`)
        .setLabel(`Qual sua atuação na área?`)
        .setRequired(true)
        .setPlaceholder("Criação de sites/bots, etc...")
        .setStyle(TextInputStyle.Paragraph)

    const example = new TextInputBuilder()
        .setCustomId(`example`)
        .setLabel(`Nos envie um exemplo de um projeto seu`)
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)

    const botInvite = new TextInputBuilder()
        .setCustomId(`botInvite`)
        .setLabel(`Convite do seu bot (se houver)`)
        .setStyle(TextInputStyle.Short)
        .setRequired(false)

    modal.addComponents(new ActionRowBuilder().addComponents(githubLink));
    modal.addComponents(new ActionRowBuilder().addComponents(experienceInfo));
    modal.addComponents(new ActionRowBuilder().addComponents(example));
    modal.addComponents(new ActionRowBuilder().addComponents(botInvite));

    return await interaction.showModal(modal);
  }
}