-- All outbound NUI callbacks from the React UI

local function nuiOk(cb, data)
    cb(data or { ok = true })
end

local function nuiErr(cb, message)
    cb({ ok = false, error = message or 'unknown_error' })
end

-- ── Shared close ─────────────────────────────────────────────────────────────

RegisterNUICallback('close', function(_, cb)
    CloseBankingUi()
    nuiOk(cb)
end)

RegisterNUICallback('CloseATM', function(_, cb)
    CloseBankingUi()
    nuiOk(cb)
end)

-- ── Banking ──────────────────────────────────────────────────────────────────

RegisterNUICallback('switchAccount', function(data, cb)
    TriggerServerEvent('advanced-banking:server:switchAccount', data.id)
    nuiOk(cb)
end)

RegisterNUICallback('deposit', function(data, cb)
    TriggerServerEvent('advanced-banking:server:deposit', tonumber(data.amount))
    nuiOk(cb)
end)

RegisterNUICallback('withdraw', function(data, cb)
    TriggerServerEvent('advanced-banking:server:withdraw', tonumber(data.amount))
    nuiOk(cb)
end)

RegisterNUICallback('transfer', function(data, cb)
    TriggerServerEvent('advanced-banking:server:transfer', data)
    nuiOk(cb)
end)

RegisterNUICallback('requestPayment', function(data, cb)
    TriggerServerEvent('advanced-banking:server:requestPayment', data)
    nuiOk(cb)
end)

RegisterNUICallback('payInvoice', function(data, cb)
    TriggerServerEvent('advanced-banking:server:payInvoice', data.id)
    nuiOk(cb)
end)

RegisterNUICallback('saveContact', function(data, cb)
    TriggerServerEvent('advanced-banking:server:saveContact', data)
    nuiOk(cb)
end)

RegisterNUICallback('updateSocietyLimits', function(data, cb)
    TriggerServerEvent('advanced-banking:server:updateSocietyLimits', data)
    nuiOk(cb)
end)

RegisterNUICallback('addSharedMember', function(data, cb)
    TriggerServerEvent('advanced-banking:server:addSharedMember', data)
    nuiOk(cb)
end)

RegisterNUICallback('updateSharedMember', function(data, cb)
    TriggerServerEvent('advanced-banking:server:updateSharedMember', data)
    nuiOk(cb)
end)

RegisterNUICallback('removeSharedMember', function(data, cb)
    TriggerServerEvent('advanced-banking:server:removeSharedMember', data)
    nuiOk(cb)
end)

RegisterNUICallback('applyForLoan', function(data, cb)
    TriggerServerEvent('advanced-banking:server:applyForLoan', data)
    nuiOk(cb)
end)

RegisterNUICallback('issueVirtualCard', function(data, cb)
    TriggerServerEvent('advanced-banking:server:issueVirtualCard', data)
    nuiOk(cb)
end)

RegisterNUICallback('updateCard', function(data, cb)
    TriggerServerEvent('advanced-banking:server:updateCard', data)
    nuiOk(cb)
end)

-- ── ATM ──────────────────────────────────────────────────────────────────────

RegisterNUICallback('SelectCard', function(data, cb)
    TriggerServerEvent('advanced-banking:server:selectAtmCard', data.cardId)
    nuiOk(cb, { success = true })
end)

RegisterNUICallback('VerifyPin', function(data, cb)
    TriggerServerEvent('advanced-banking:server:verifyAtmPin', data.cardId, data.pin)
    nuiOk(cb, { success = true })
end)

RegisterNUICallback('WithdrawMoney', function(data, cb)
    local amount = tonumber(data.amount)
    if not amount or amount <= 0 then
        nuiErr(cb, 'invalid_amount')
        return
    end
    TriggerServerEvent('advanced-banking:server:atmWithdraw', data.cardId, amount)
    nuiOk(cb, { success = true })
end)
