local hud = false
local speedometer = false

RegisterNUICallback('ready', function(data, cb)
    if data.show then 
        Wait(500)
        SendNUIMessage({
            action = 'show'
        })
        hud = true
    end
end)

local last = {
    health = -1,
    armour = -1,
    food = -1,
    water = -1,
    fuel = -1,
    speed = -1,
    pause = false
}

if not Config.ESX then
    RegisterNetEvent('hud:client:UpdateNeeds', function(newHunger, newThirst)
        food = newHunger
        water = newThirst
    end)
end

Citizen.CreateThread(function()
    while true do
        if hud then
            local pause = IsPauseMenuActive()
            if pause ~= last.pause then
                if pause then
                    SendNUIMessage({action = 'hide', opacity = 0})
                else
                    SendNUIMessage({action = 'hide', opacity = 1})
                end
                last.pause = pause
            end
            local player = PlayerPedId()
            local health = GetEntityHealth(player) - 100
            local armour = GetPedArmour(player)
            if Config.ESX then
                TriggerEvent('esx_status:getStatus', 'hunger', function(status) food = status.val / 10000 end)
                TriggerEvent('esx_status:getStatus', 'thirst', function(status) water = status.val / 10000 end)
            end
            if health < 0 then health = 0 end
            if health ~= last.health then SendNUIMessage({action = 'health', health = health}) last.health = health end
            if armour ~= last.armour then SendNUIMessage({action = 'armour', armour = armour}) last.armour = armour end
            if food ~= last.food then SendNUIMessage({action = 'food', food = food}) last.food = food end
            if water ~= last.water then SendNUIMessage({action = 'water', water = water}) last.water = water end
        end
        Citizen.Wait(1000)
    end
end)

Citizen.CreateThread(function()
    while true do
        local wait = 1000
        if hud then
            local player = PlayerPedId()
            if IsPedInAnyVehicle(player) then
                local vehicle = GetVehiclePedIsIn(player)
                if GetPedInVehicleSeat(vehicle, -1) == player then
                    wait = 200
                    if not speedometer then
                        SendNUIMessage({action = 'speedometer', speedometer = 'show', metric = Config.Metric})
                        speedometer = true
                    else
                        local fuel = GetVehicleFuelLevel(vehicle)
                        local speed = GetEntitySpeed(vehicle)
                        if fuel ~= last.fuel then SendNUIMessage({action = 'fuel', fuel = fuel}) last.fuel = fuel end
                        if speed ~= last.speed then SendNUIMessage({action = 'speed', speed = speed}) last.speed = speed end
                    end
                elseif speedometer then
                    SendNUIMessage({action = 'speedometer', speedometer = 'hide', metric = Config.Metric})
                    speedometer = false
                end
            elseif speedometer then
                SendNUIMessage({action = 'speedometer', speedometer = 'hide', metric = Config.Metric})
                speedometer = false
            end
        elseif speedometer then
            SendNUIMessage({action = 'speedometer', speedometer = 'hide', metric = Config.Metric})
            speedometer = false
        end
        Citizen.Wait(wait)
    end
end)

function seatbelt(toggle)
    SendNUIMessage({action = 'seatbelt', seatbelt = toggle})
end
