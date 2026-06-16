--[[
  Advanced Banking — YSeries Phone App Registration
  Registers the banking app in YSeries and triggers the main resource to open mobile.
]]

local BANKING_RESOURCE = "advanced-banking-system"
local PHONE_RESOURCE   = "yseries"

local function AddBankingApp()
    local dataLoaded = exports[PHONE_RESOURCE]:GetDataLoaded()
    while not dataLoaded do
        Wait(500)
        dataLoaded = exports[PHONE_RESOURCE]:GetDataLoaded()
    end

    exports[PHONE_RESOURCE]:AddCustomApp({
        key        = "advanced-banking-mobile",
        name       = "Banking",
        defaultApp = true,
        ui         = ("https://cfx-nui-%s/dist/index.html"):format(BANKING_RESOURCE),
        icon       = ("https://cfx-nui-%s/dist/bank-icon.svg"):format(BANKING_RESOURCE),
    })

    -- YSeries loads the banking NUI in an iframe and sends postMessage({ action: "openMobile" }).
    -- As a fallback, notify the main banking resource so it can push state if needed.
    exports[PHONE_RESOURCE]:SetAppOpenCallback("advanced-banking-mobile", function()
        -- YSeries iframe sends postMessage({ action: "openMobile" }) directly to the NUI.
        -- Also refresh player data via the main banking resource export.
        if GetResourceState(BANKING_RESOURCE) == "started" then
            exports[BANKING_RESOURCE]:OpenMobileBanking()
        end
    end)
end

CreateThread(function()
    Wait(1000)
    AddBankingApp()
end)
