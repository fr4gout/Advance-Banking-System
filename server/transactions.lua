local function FindAccountByIban(iban)
    if not iban then return nil end
    return MySQL.single.await(
        'SELECT * FROM adv_bank_accounts WHERE iban = ? LIMIT 1',
        { iban }
    )
end

local function FindAccountByCitizenId(citizenid)
    if not citizenid then return nil end
    return MySQL.single.await(
        'SELECT * FROM adv_bank_accounts WHERE citizenid = ? ORDER BY created_at ASC LIMIT 1',
        { citizenid }
    )
end

function Transfer(fromCitizenid, data, amount)
    local fromAccount = exports[GetCurrentResourceName()]:GetPrimaryAccount(fromCitizenid)
    if not fromAccount then return false, 'No source account' end
    if fromAccount.balance < amount then return false, 'Insufficient balance' end

    local toRow
    if data.toIban then
        toRow = FindAccountByIban(data.toIban)
    elseif data.citizenId then
        toRow = FindAccountByCitizenId(data.citizenId)
    end

    if not toRow then return false, 'Recipient not found' end
    if toRow.citizenid == fromCitizenid then return false, 'Cannot transfer to yourself' end

    MySQL.update.await(
        'UPDATE adv_bank_accounts SET balance = balance - ? WHERE account_id = ?',
        { amount, fromAccount.id }
    )

    MySQL.update.await(
        'UPDATE adv_bank_accounts SET balance = balance + ? WHERE account_id = ?',
        { amount, toRow.account_id }
    )

    local counterparty = data.contactName or toRow.iban
    MySQL.insert.await(
        'INSERT INTO adv_bank_transactions (account_id, citizenid, tx_type, amount, label, counterparty, note) VALUES (?, ?, ?, ?, ?, ?, ?)',
        { fromAccount.id, fromCitizenid, 'transfer_out', amount, 'Transfer Out', counterparty, data.note }
    )

    MySQL.insert.await(
        'INSERT INTO adv_bank_transactions (account_id, citizenid, tx_type, amount, label, counterparty, note) VALUES (?, ?, ?, ?, ?, ?, ?)',
        { toRow.account_id, toRow.citizenid, 'transfer_in', amount, 'Transfer In', fromAccount.iban, data.note }
    )

    return true
end

exports('Transfer', Transfer)
