const path = require('path')
require('dotenv').config({ path: path.join(process.cwd(), '.env.development') })

module.exports = {
  env: {
    NODE_ENV: '"development"',
    // 需要 JSON.stringify
    BASE_URL: JSON.stringify(process.env.BASE_URL || ''),
  },
  defineConstants: {
  },
  mini: {},
  h5: {}
}
