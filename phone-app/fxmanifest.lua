fx_version 'cerulean'
game 'gta5'

name        'advanced-banking-phone'
description 'Registers the Advanced Banking mobile app inside YSeries phone'
author      'YourName'
version     '1.0.0'

-- This resource only needs a client script.
-- The actual UI is served from the main advanced-banking-system resource.
client_scripts { 'client.lua' }

-- Depend on YSeries so AddApp runs after the phone is ready.
dependencies { 'yseries' }
