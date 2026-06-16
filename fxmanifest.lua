fx_version 'cerulean'
game 'gta5'

name        'advanced-banking-system'
description 'Advanced Banking NUI — desktop, ATM, and mobile surfaces'
author      'Advance Banking System'
version     '1.0.0'

lua54 'yes'

ui_page 'dist/index.html'

files {
    'dist/**',
}

shared_scripts {
    'config.lua',
}

client_scripts {
    'client/main.lua',
    'client/nui.lua',
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua',
    'server/accounts.lua',
    'server/transactions.lua',
}

dependencies {
    'qb-core',
    'oxmysql',
    'qb-target',
}
