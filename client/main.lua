local QBCore = exports['qb-core']:GetCoreObject()

local isBankOpen = false
local isAtmOpen = false

-- ── NUI helpers ─────────────────────────────────────────────────────────────

function SendBankingNui(action, data)
    SendNUIMessage({
        action = action,
        data = data or {},
    })
end

function OpenDesktopBanking()
    if isBankOpen or isAtmOpen then return end
    isBankOpen = true
    SetNuiFocus(true, true)
    SendBankingNui('openDesktop', {})
    TriggerServerEvent('advanced-banking:server:requestPlayerData')
end

function OpenAtmTerminal()
    if isBankOpen or isAtmOpen then return end
    isAtmOpen = true
    SetNuiFocus(true, true)
    TriggerServerEvent('advanced-banking:server:requestAtmData')
end

function CloseBankingUi()
    isBankOpen = false
    isAtmOpen = false
    SetNuiFocus(false, false)
    SendBankingNui('setVisible', false)
    SendBankingNui('CloseATM', {})
end

-- ── Server → client state push ────────────────────────────────────────────────

RegisterNetEvent('advanced-banking:client:setCharacter', function(character)
    SendBankingNui('setCharacter', character)
end)

RegisterNetEvent('advanced-banking:client:setAccounts', function(accounts)
    SendBankingNui('setAccounts', accounts)
end)

RegisterNetEvent('advanced-banking:client:setCashOnHand', function(cash)
    SendBankingNui('setCashOnHand', cash)
end)

RegisterNetEvent('advanced-banking:client:pushTransaction', function(tx)
    SendBankingNui('pushTransaction', tx)
end)

RegisterNetEvent('advanced-banking:client:openAtm', function(data)
    SendBankingNui('openATM', data or {})
end)

RegisterNetEvent('advanced-banking:client:updateAtmCards', function(cards)
    SendBankingNui('UpdateCards', { cards = cards })
end)

RegisterNetEvent('advanced-banking:client:updateAtmBalance', function(balance, atmLimit)
    SendBankingNui('UpdateBalance', { balance = balance, atmLimit = atmLimit })
end)

-- YSeries phone bridge (from phone-app resource via export or event)
local function OpenMobileBanking()
    SendBankingNui('openMobile', {})
    TriggerServerEvent('advanced-banking:server:requestPlayerData')
end

AddEventHandler('advanced-banking:client:openMobile', OpenMobileBanking)

-- ── Bank zones (keypress fallback when Config.UseTarget = false) ─────────────

CreateThread(function()
    if Config.UseTarget then return end

    while true do
        local sleep = 1000
        local ped = PlayerPedId()
        local pos = GetEntityCoords(ped)

        for _, bank in ipairs(Config.BankLocations) do
            local dist = #(pos - bank.coords)
            if dist < Config.InteractDistance then
                sleep = 0
                DrawMarker(2, bank.coords.x, bank.coords.y, bank.coords.z + 0.2,
                    0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
                    0.25, 0.25, 0.25, 107, 191, 255, 180,
                    false, false, 2, false, nil, nil, false)

                if IsControlJustReleased(0, Config.InteractKey) then
                    OpenDesktopBanking()
                end
            end
        end

        Wait(sleep)
    end
end)

-- ── qb-target bank zones ─────────────────────────────────────────────────────

CreateThread(function()
    if not Config.UseTarget then return end

    for i, bank in ipairs(Config.BankLocations) do
        exports['qb-target']:AddBoxZone(
            'adv_bank_' .. i,
            bank.coords,
            1.5, 1.5,
            {
                name = 'adv_bank_' .. i,
                heading = bank.heading,
                minZ = bank.coords.z - 1.0,
                maxZ = bank.coords.z + 1.5,
                debugPoly = Config.Debug,
            },
            {
                options = {
                    {
                        type = 'client',
                        event = 'advanced-banking:client:openBank',
                        icon = 'fas fa-university',
                        label = 'Access Banking',
                    },
                },
                distance = Config.InteractDistance,
            }
        )
    end

    exports['qb-target']:AddTargetModel(Config.AtmModels, {
        options = {
            {
                type = 'client',
                event = 'advanced-banking:client:openAtmTarget',
                icon = 'fas fa-credit-card',
                label = 'Use ATM',
            },
        },
        distance = Config.InteractDistance,
    })
end)

RegisterNetEvent('advanced-banking:client:openBank', function()
    OpenDesktopBanking()
end)

RegisterNetEvent('advanced-banking:client:openAtmTarget', function()
    OpenAtmTerminal()
end)

-- ── Commands (dev / fallback) ───────────────────────────────────────────────

RegisterCommand('bank', function()
    OpenDesktopBanking()
end, false)

RegisterCommand('atm', function()
    OpenAtmTerminal()
end, false)

-- Export for other resources
exports('OpenDesktopBanking', OpenDesktopBanking)
exports('OpenAtmTerminal', OpenAtmTerminal)
exports('OpenMobileBanking', OpenMobileBanking)
exports('CloseBankingUi', CloseBankingUi)
