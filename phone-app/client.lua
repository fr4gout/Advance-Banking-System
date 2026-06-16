--[[
  Advanced Banking — YSeries Phone App Registration
  ==================================================

  HOW IT WORKS
  ─────────────
  1. This client script waits for YSeries to finish loading player data.
  2. It registers the Advanced Banking app in the phone home screen via
     exports["yseries"]:AddCustomApp(...).
  3. When the player taps the banking icon on the phone, YSeries opens the app
     inside an iframe pointing to the NUI build of this resource.
  4. On iframe load, the app starts at the hidden state. YSeries sends a
     postMessage to the iframe: { action: "openMobile", data: {} }
     which our useNuiEvent("openMobile") hook catches and shows MobileApp.

  SETUP STEPS
  ────────────
  1. Build the banking UI: `npm run build` → generates dist/
  2. Place the entire advanced-banking-system resource folder in your FiveM
     server's resources directory.
  3. Place THIS phone-app folder as its own resource (e.g., advanced-banking-phone).
  4. In server.cfg, ensure both resources start:
       ensure advanced-banking-system
       ensure advanced-banking-phone
  5. The phone UI path uses the cfx-nui:// scheme resolved from dist/index.html.

  RESOURCE NAME
  ─────────────
  Replace "advanced-banking-system" below with whatever your resource folder is
  actually named in your /resources directory.
]]

---@param action string   The NUI action key
---@param data   any      Payload to include
local function SendBankingUIMessage(action, data)
    SendNUIMessage({
        action = action,
        data   = data or {},
    })
end

local BANKING_RESOURCE = "advanced-banking-system"
local PHONE_RESOURCE   = "yseries"   -- Change if your phone resource has a different name

-- ── Register the app once YSeries data is ready ─────────────────────────────

local function AddBankingApp()
    -- Wait for the phone to finish loading player data
    local dataLoaded = exports[PHONE_RESOURCE]:GetDataLoaded()
    while not dataLoaded do
        Wait(500)
        dataLoaded = exports[PHONE_RESOURCE]:GetDataLoaded()
    end

    exports[PHONE_RESOURCE]:AddCustomApp({
        -- Unique key — must match any references in phone config
        key         = "advanced-banking-mobile",

        -- Display name shown below the icon on the home screen
        name        = "Banking",

        -- Show on home screen by default (player can remove it via app drawer)
        defaultApp  = true,

        --[[
          UI path — FiveM resolves cfx-nui:// relative to your resource's dist folder.
          Format: "https://cfx-nui-<resource-name>/<path-inside-resource>"

          After `npm run build`, dist/index.html is the SPA entry.
          The app will receive { action: "openMobile" } via postMessage from the
          phone's iframe bridge, which our useNuiEvent("openMobile") hook handles.
        ]]
        ui          = ("https://cfx-nui-%s/dist/index.html"):format(BANKING_RESOURCE),

        --[[
          OPTIONAL: set an icon. Can be a URL or a base64 data URI.
          Uncomment and replace with your actual icon URL:
        ]]
        -- icon     = ("https://cfx-nui-%s/dist/assets/banking-icon.png"):format(BANKING_RESOURCE),

        --[[
          OPTIONAL: notification badge config.
          The phone will show a badge count if you push notifications to it.
        ]]
        -- notifications = true,
    })

    -- Tell the banking NUI to show the mobile surface as soon as the iframe loads.
    -- This is sent every time the phone app is opened by the user.
    exports[PHONE_RESOURCE]:SetAppOpenCallback("advanced-banking-mobile", function()
        SendBankingUIMessage("openMobile", {})
    end)
end

-- Run on resource start
CreateThread(function()
    -- Small delay to ensure both resources are fully started
    Wait(1000)
    AddBankingApp()
end)
