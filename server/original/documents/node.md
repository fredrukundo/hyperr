# Node.js CommonJS module system

module.exports = { pool };

# You are saying:

“When someone imports this file, give them the pool object.”

# So in another file:

const { pool } = require("./db");

# Defines module type

If your package.json has:

{
  "type": "module"
}

# Then:

require() ❌ will NOT work
module.exports ❌ will NOT work

# You must use ES Modules:

import { Pool } from "pg";
export const pool = new Pool(...);

# If you DON’T have "type": "module":

Then Node uses CommonJS (default):

require()
module.exports

# Simple mental model

module.exports = "I allow others to use this tool"
require()     = "I take the tool from another file"

_________________________________________________________________


