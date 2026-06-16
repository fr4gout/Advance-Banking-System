local QBCore = exports['qb-core']:GetCoreObject()

local function GenerateIban(citizenid)
    return ('PSB%s'):format(string.upper(citizenid))
end

local function RowToAccount(row)
    return {
        id = row.account_id,
        kind = row.kind or 'personal',
        name = row.name or 'Personal Account',
        iban = row.iban,
        balance = row.balance or 0,
        shortLabel = row.short_label or 'PERSONAL',
    }
end

function EnsurePlayerAccount(citizenid)
    local existing = MySQL.scalar.await(
        'SELECT account_id FROM adv_bank_accounts WHERE citizenid = ? LIMIT 1',
        { citizenid }
    )
    if existing then return existing end

    local accountId = ('acc_%s'):format(citizenid)
    local iban = GenerateIban(citizenid)

    MySQL.insert.await(
        'INSERT INTO adv_bank_accounts (account_id, citizenid, kind, name, iban, balance, short_label) VALUES (?, ?, ?, ?, ?, ?, ?)',
        { accountId, citizenid, 'personal', 'Personal Account', iban, 0, 'PERSONAL' }
    )

    return accountId
end

function GetPlayerAccounts(citizenid)
    EnsurePlayerAccount(citizenid)
    local rows = MySQL.query.await(
        'SELECT * FROM adv_bank_accounts WHERE citizenid = ? ORDER BY created_at ASC',
        { citizenid }
    ) or {}

    local accounts = {}
    for _, row in ipairs(rows) do
        accounts[#accounts + 1] = RowToAccount(row)
    end
    return accounts
end

function GetPlayerCards(citizenid)
    local rows = MySQL.query.await(
        'SELECT * FROM adv_bank_cards WHERE citizenid = ? AND status = ?',
        { citizenid, 'active' }
    ) or {}

    local cards = {}
    for _, row in ipairs(rows) do
        cards[#cards + 1] = {
            id = row.card_id,
            holderName = row.holder_name,
            maskedPan = row.masked_pan,
            last4 = row.last4,
            status = row.status,
            pin = row.pin_hash, -- never send real pin to client in production
        }
    end
    return cards
end

function GetPrimaryAccount(citizenid)
    local accounts = GetPlayerAccounts(citizenid)
    return accounts[1]
end

function Deposit(citizenid, amount)
    local account = GetPrimaryAccount(citizenid)
    if not account then return false end

    MySQL.update.await(
        'UPDATE adv_bank_accounts SET balance = balance + ? WHERE account_id = ?',
        { amount, account.id }
    )

    MySQL.insert.await(
        'INSERT INTO adv_bank_transactions (account_id, citizenid, tx_type, amount, label, counterparty) VALUES (?, ?, ?, ?, ?, ?)',
        { account.id, citizenid, 'deposit', amount, 'Cash Deposit', 'Branch' }
    )

    return true
end

function Withdraw(citizenid, amount)
    local account = GetPrimaryAccount(citizenid)
    if not account or account.balance < amount then return false end

    MySQL.update.await(
        'UPDATE adv_bank_accounts SET balance = balance - ? WHERE account_id = ?',
        { amount, account.id }
    )

    MySQL.insert.await(
        'INSERT INTO adv_bank_transactions (account_id, citizenid, tx_type, amount, label, counterparty) VALUES (?, ?, ?, ?, ?, ?)',
        { account.id, citizenid, 'withdraw', amount, 'ATM Withdrawal', 'Branch' }
    )

    return true
end

exports('EnsurePlayerAccount', EnsurePlayerAccount)
exports('GetPlayerAccounts', GetPlayerAccounts)
exports('GetPlayerCards', GetPlayerCards)
exports('GetPrimaryAccount', GetPrimaryAccount)
exports('Deposit', Deposit)
exports('Withdraw', Withdraw)
