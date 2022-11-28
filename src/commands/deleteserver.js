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

const {
    SlashCommandBuilder,
    PermissionsBitField,
    SlashCommandStringOption,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const config = require("../config");
const Command = require("../structures/command");

class DeleteServerCommand extends Command {
    constructor() {
        super({
            active: true,
            data: new SlashCommandBuilder()
                .setName("deleteserver")
                .setDescription("Delete um servidor da database do agent.")
                .setDMPermission(false)
                .setDefaultMemberPermissions(
                    PermissionsBitField.Flags.ManageRoles
                )
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName("server")
                        .setNameLocalization("pt-BR", "servidor")
                        .setDescription(
                            "Selecione o servidor que será deletado"
                        )
                        .setRequired(true)
                        .setAutocomplete(true)
                ),
        });
    }

    async execute(interaction, client) {
        if (!interaction.member.roles.cache.has(config.guard)) {
            return await interaction.reply({
                content: "Apenas um guard pode deletar servidores",
                ephemeral: true,
            });
        }
        const guildId = interaction.options.getString("server");
        const guildModel = require("../models/guild");
        const guild = await guildModel.findById(guildId);
        if (!guild) {
            return await interaction.reply({
                content: "Servidor não cadastrado no banco de dados",
                ephemeral: true,
            });
        }
        const memberModel = require("../models/member");
        const membersCount = await memberModel.find({ guild: guildId }).count();
        const actionRow = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
                .setCustomId("collector:confirm")
                .setLabel("Confirmar")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("collector:cancel")
                .setLabel("Cancelar")
                .setStyle(ButtonStyle.Danger)
        );
        const reply = await interaction.reply({
            content:
                `Tem certeza de que deseja deletar o servidor **${guild.name}** do bando de dados?` +
                `${
                    membersCount === 0
                        ? ""
                        : `\n${membersCount} membros ainda são staffs desse servidor.`
                }`,
            components: [actionRow],
            ephemeral: true,
        });
        const collector = reply.createMessageComponentCollector({
            filter: (i) => i.user.id === interaction.user.id,
            time: 60000,
            max: 1,
        });
        collector.on("collect", async (i) => {
            if (i.customId === "collector:cancel") {
                return await i.update({
                    content: "Operação cancelada",
                    components: [],
                });
            }
            await i.update({
                content: "Deletando servidor...",
                components: [],
            });
            if (guild.role) {
                await interaction.guild.roles
                    .delete(guild.role)
                    .catch(async (err) => {
                        console.log(err);
                        await interaction.followUp({
                            content:
                                "Não foi possível deletar o cargo do servidor",
                            ephemeral: true,
                        });
                    });
            }
            await guild.delete();
            await memberModel.deleteMany({ guild: guildId });
            await i.editReply({ content: "Servidor deletado" });
            client.emit("updateGuilds", false);
        });
        collector.on("end", async (_, reason) => {
            if (reason === "time") {
                await interaction.editReply({
                    content: "Operação cancelada",
                    components: [],
                });
            }
        });
    }

    async autocomplete$server(interaction, value) {
        const guildModel = require("../models/guild.js");
        const guildDocs = await guildModel
            .find({
                name: {
                    $regex: new RegExp(
                        value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                        "i"
                    ),
                },
                pending: { $ne: true },
            })
            .sort({ name: 1 })
            .limit(25);
        return guildDocs.map((doc) => ({
            name: doc.name,
            value: doc._id,
        }));
    }
}

module.exports = new DeleteServerCommand();
