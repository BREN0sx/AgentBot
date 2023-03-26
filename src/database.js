// Copyright (C) 2022 BRENOsx

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

const mongoose = require("mongoose");
const app = mongoose.connection;

const connect = async () => {
    return await mongoose.connect(`${process.env.MONGOURL}?retryWrites=true&w=majority`, {useNewUrlParser: true});
}

app.on("error", () => mongoose.disconnect());

app.on("disconnected", async () => await connect());

(async () => await connect())();
