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

const { SlashCommandBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const Command = require('../structures/command.js');

class UpdateserversCommand extends Command{
    constructor(){
        super({
            active: true,
            data: new SlashCommandBuilder()
                .setName('updateservers')
                .setNameLocalization('pt-BR', 'atualizarservidores')
                .setDescription('Atualiza a lista de servidores que fazem parte da EPF')
                .setDMPermission(true)
                .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles),
        });
    }

    async execute(interaction, client){
        const constantsModel = require('../models/constants');
        const constants = await constantsModel.getConstants();
        if (constants.updatingGuildsChannel) return await interaction.reply({
            content: 'Uma atualização já foi solicitada, aguarde o término da atualização para solicitar novamente.',
            ephemeral: true
        });
        await interaction.deferReply({ephemeral: true});
        if ((new Date() - constants.lastGuildsChannelUpdate) < 600000) {
            const confirmButton = new ButtonBuilder()
                .setCustomId('collector:confirm')
                .setLabel('Confirmar')
                .setStyle(ButtonStyle.Success);
            const cancelButton = new ButtonBuilder()
                .setCustomId('collector:cancel')
                .setLabel('Cancelar')
                .setStyle(ButtonStyle.Danger);
            
            const reply = await interaction.editReply({
                content: 'A última atualização foi a menos de 10 minutos, deseja atualizar novamente?',
                components: [new ActionRowBuilder().setComponents(confirmButton, cancelButton)]
            })

            const collector = reply.createMessageComponentCollector({
                time: 60000,
                filter: (i) => i.user.id === interaction.user.id,
                max: 1
            });

            collector.on('collect', async (i) => {
                if (i.customId === 'collector:cancel') {
                    await i.update({ content: 'Operação cancelada', components: [] });
                    return;
                }
                await i.update({ content: 'Lista de servidores atualizada', components: [] });
                client.emit('updateGuilds', true);
            })

            collector.on('end', async (_, reason) => {
                if (reason === 'time') {
                    await interaction.editReply({ content: 'Operação cancelada', components: [] });
                    return;
                }
            })

            return;
        }

        client.emit('updateGuilds', false);
        await interaction.editReply('Lista de servidores atualizada');
    }
}

module.exports = new UpdateserversCommand()