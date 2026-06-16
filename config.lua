Config = {}

Config.ResourceName = 'advanced-banking-system'
Config.DefaultBankTheme = 'pacific'

-- Transfer limits (server-side validation)
Config.MaxTransferAmount = 500000
Config.MaxDepositAmount = 100000
Config.MaxWithdrawAmount = 50000
Config.AtmDailyLimit = 10000

-- Bank branch locations (press E or use target)
Config.BankLocations = {
    { coords = vector3(149.46, -1042.09, 29.37), heading = 340.0, label = 'Legion Square Bank' },
    { coords = vector3(-1212.26, -336.21, 37.78), heading = 27.0, label = 'Rockford Hills Bank' },
    { coords = vector3(-2961.14, 482.01, 15.70), heading = 88.0, label = 'Great Ocean Highway Bank' },
    { coords = vector3(314.16, -279.09, 54.17), heading = 340.0, label = 'Alta Street Bank' },
    { coords = vector3(-351.59, -51.25, 49.04), heading = 340.0, label = 'Burton Bank' },
}

-- ATM prop models (use qb-target / ox_target)
Config.AtmModels = {
    `prop_atm_01`,
    `prop_atm_02`,
    `prop_atm_03`,
    `prop_fleeca_atm`,
}

-- Interaction
Config.UseTarget = true          -- set false to use keypress zones instead
Config.InteractKey = 38          -- E
Config.InteractDistance = 2.5

-- Debug
Config.Debug = false
