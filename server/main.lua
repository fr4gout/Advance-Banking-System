local QBCore = exports['qb-core']:GetCoreObject()

-- ── Helpers ──────────────────────────────────────────────────────────────────

local function GetPlayer(src)
    return QBCore.Functions.GetPlayer(src)
end

local function Notify(src, msg, ntype)
    TriggerClientEvent('QBCore:Notify', src, msg, ntype or 'primary')
end

local function PushPlayerData(src)
    local Player = GetPlayer(src)
    if not Player then return end

    local citizenid = Player.PlayerData.citizenid
    local charinfo = Player.PlayerData.charinfo
    local job = Player.PlayerData.job

    TriggerClientEvent('advanced-banking:client:setCharacter', src, {
        id = citizenid,
        firstName = charinfo.firstname,
        lastName = charinfo.lastname,
        citizenId = citizenid,
        phone = charinfo.phone,
        job = job.name,
    })

    TriggerClientEvent('advanced-banking:client:setCashOnHand', src, Player.PlayerData.money.cash)

    local accounts = exports[GetCurrentResourceName()]:GetPlayerAccounts(citizenid)
    TriggerClientEvent('advanced-banking:client:setAccounts', src, accounts)
end

-- ── Events ───────────────────────────────────────────────────────────────────

RegisterNetEvent('advanced-banking:server:requestPlayerData', function()
    PushPlayerData(source)
end)

RegisterNetEvent('advanced-banking:server:requestAtmData', function()
    local src = source
    local Player = GetPlayer(src)
    if not Player then return end

    local citizenid = Player.PlayerData.citizenid
    local accounts = exports[GetCurrentResourceName()]:GetPlayerAccounts(citizenid)
    local primary = accounts[1]
    local balance = primary and primary.balance or 0

    TriggerClientEvent('advanced-banking:client:openAtm', src, {
        balance = balance,
        atmLimit = Config.AtmDailyLimit,
    })

    local cards = exports[GetCurrentResourceName()]:GetPlayerCards(citizenid)
    TriggerClientEvent('advanced-banking:client:updateAtmCards', src, cards)
    TriggerClientEvent('advanced-banking:client:updateAtmBalance', src, balance, Config.AtmDailyLimit)
end)

RegisterNetEvent('advanced-banking:server:switchAccount', function(accountId)
    -- UI already switches locally; server can log or validate access
    if Config.Debug then
        print(('[advanced-banking] %s switched to account %s'):format(source, accountId))
    end
end)

RegisterNetEvent('advanced-banking:server:deposit', function(amount)
    local src = source
    amount = tonumber(amount)
    if not amount or amount <= 0 or amount > Config.MaxDepositAmount then
        Notify(src, 'Invalid deposit amount', 'error')
        return
    end

    local Player = GetPlayer(src)
    if not Player then return end

    if Player.PlayerData.money.cash < amount then
        Notify(src, 'Not enough cash', 'error')
        return
    end

    local citizenid = Player.PlayerData.citizenid
    local ok = exports[GetCurrentResourceName()]:Deposit(citizenid, amount)
    if not ok then
        Notify(src, 'Deposit failed', 'error')
        return
    end

    Player.Functions.RemoveMoney('cash', amount, 'bank-deposit')
    PushPlayerData(src)
    Notify(src, ('Deposited $%s'):format(amount), 'success')
end)

RegisterNetEvent('advanced-banking:server:withdraw', function(amount)
    local src = source
    amount = tonumber(amount)
    if not amount or amount <= 0 or amount > Config.MaxWithdrawAmount then
        Notify(src, 'Invalid withdraw amount', 'error')
        return
    end

    local Player = GetPlayer(src)
    if not Player then return end

    local citizenid = Player.PlayerData.citizenid
    local ok = exports[GetCurrentResourceName()]:Withdraw(citizenid, amount)
    if not ok then
        Notify(src, 'Insufficient bank balance', 'error')
        return
    end

    Player.Functions.AddMoney('cash', amount, 'bank-withdraw')
    PushPlayerData(src)
    Notify(src, ('Withdrew $%s'):format(amount), 'success')
end)

RegisterNetEvent('advanced-banking:server:transfer', function(data)
    local src = source
    local amount = tonumber(data.amount)
    if not amount or amount <= 0 or amount > Config.MaxTransferAmount then
        Notify(src, 'Invalid transfer amount', 'error')
        return
    end

    local Player = GetPlayer(src)
    if not Player then return end

    local citizenid = Player.PlayerData.citizenid
    local ok, err = exports[GetCurrentResourceName()]:Transfer(citizenid, data, amount)
    if not ok then
        Notify(src, err or 'Transfer failed', 'error')
        return
    end

    PushPlayerData(src)
    Notify(src, ('Transferred $%s'):format(amount), 'success')
end)

RegisterNetEvent('advanced-banking:server:atmWithdraw', function(cardId, amount)
    local src = source
    amount = tonumber(amount)
    if not amount or amount <= 0 or amount > Config.AtmDailyLimit then
        Notify(src, 'Invalid ATM withdrawal', 'error')
        return
    end

    local Player = GetPlayer(src)
    if not Player then return end

    local citizenid = Player.PlayerData.citizenid
    local ok = exports[GetCurrentResourceName()]:Withdraw(citizenid, amount)
    if not ok then
        Notify(src, 'Insufficient funds', 'error')
        return
    end

    Player.Functions.AddMoney('cash', amount, 'atm-withdraw')
    local accounts = exports[GetCurrentResourceName()]:GetPlayerAccounts(citizenid)
    local balance = accounts[1] and accounts[1].balance or 0
    TriggerClientEvent('advanced-banking:client:updateAtmBalance', src, balance, Config.AtmDailyLimit)
    Notify(src, ('ATM: withdrew $%s'):format(amount), 'success')
end)

-- Stub handlers for features not yet fully implemented server-side
local stubEvents = {
    'advanced-banking:server:requestPayment',
    'advanced-banking:server:payInvoice',
    'advanced-banking:server:saveContact',
    'advanced-banking:server:updateSocietyLimits',
    'advanced-banking:server:addSharedMember',
    'advanced-banking:server:updateSharedMember',
    'advanced-banking:server:removeSharedMember',
    'advanced-banking:server:applyForLoan',
    'advanced-banking:server:issueVirtualCard',
    'advanced-banking:server:updateCard',
    'advanced-banking:server:selectAtmCard',
    'advanced-banking:server:verifyAtmPin',
}

for _, eventName in ipairs(stubEvents) do
    RegisterNetEvent(eventName, function()
        if Config.Debug then
            print(('[advanced-banking] stub event: %s from %s'):format(eventName, source))
        end
    end)
end

-- ── Player loaded ─────────────────────────────────────────────────────────────

RegisterNetEvent('QBCore:Server:PlayerLoaded', function(Player)
    if not Player then return end
    exports[GetCurrentResourceName()]:EnsurePlayerAccount(Player.PlayerData.citizenid)
end)

AddEventHandler('onResourceStart', function(resource)
    if resource ~= GetCurrentResourceName() then return end
    for _, playerId in ipairs(QBCore.Functions.GetPlayers()) do
        local Player = GetPlayer(playerId)
        if Player then
            exports[GetCurrentResourceName()]:EnsurePlayerAccount(Player.PlayerData.citizenid)
        end
    end
end)
