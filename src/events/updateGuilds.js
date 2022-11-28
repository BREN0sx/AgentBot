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

let timeout;

module.exports = {
  name: 'updateGuilds',
  execute: async (forceUpdate, client) => {
    const constantsModel = require('../models/constants');
    let constants = await constantsModel.getConstants();

    if (constants.scheduledUpdate && !forceUpdate) return;
    
    const timeDifference = Date.now() - constants.lastGuildsChannelUpdate;
    
    let updateGuildsChannel = require("../utils/updateGuildsChannel");

    if ((timeDifference > 600000) || forceUpdate) {
      try {
        if (forceUpdate) {
          await constantsModel.updateConstants({ scheduledUpdate: false });
          clearTimeout(timeout);
        }
        await updateGuildsChannel(client);
      } catch(err) {
        console.error(err)
      }
      return;
    }

    await constantsModel.updateConstants({ scheduledUpdate: true });
    
    timeout = setTimeout(async () => {
      try {
        await updateGuildsChannel(client);
      } catch(err) {
        console.error(err);
      } finally {
        await constantsModel.updateConstants({ scheduledUpdate: false });
      }
    }, 600000 - timeDifference)
  }
}