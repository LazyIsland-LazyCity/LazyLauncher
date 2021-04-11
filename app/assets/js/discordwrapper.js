// Work in progress
const logger = require('./loggerutil')('%c[DiscordWrapper]', 'color: #7289da; font-weight: bold')

const {Client} = require('discord-rpc')

let client
let activity
var connected_players = 0
var maximum_players = 0

exports.initRPC = function(genSettings, servSettings, initialDetails = 'En jeu'){
    client = new Client({ transport: 'ipc' })

    activity = {
        details: initialDetails,
        state: 'Serveur: ' + servSettings.shortId,
        largeImageKey: servSettings.largeImageKey,
        largeImageText: servSettings.largeImageText,
        smallImageKey: genSettings.smallImageKey,
        smallImageText: genSettings.smallImageText,
        startTimestamp: new Date().getTime(),
        instance: false,
        partyId: servSettings.shortId,
        partySize: connected_players,
        partyMax: maximum_players,        
        buttons: [
            { label: "Rejoindre", url: "https://launcher.dymensia.fr/" },
            { label: "Discord", url: "https://discord.gg/dBhx3kjtaJ" }
        ]
    }

    client.on('ready', () => {
        logger.log('Discord RPC Connected')
        client.setActivity(activity)
    })
    
    client.login({clientId: genSettings.clientId}).catch(error => {
        if(error.message.includes('ENOENT')) {
            logger.log('Unable to initialize Discord Rich Presence, no client detected.')
        } else {
            logger.log('Unable to initialize Discord Rich Presence: ' + error.message, error)
        }
    })
}

exports.updateDetails = function(details){
    activity.details = details
    activity.partySize = connected_players,
    activity.partyMax = maximum_players,        
    client.setActivity(activity)
}

exports.updateParty = function(connected, maximum){
    activity.partySize = Number(connected),
    activity.partyMax = Number(maximum),        
    client.setActivity(activity)
}

exports.shutdownRPC = function(){
    if(!client) return
    client.clearActivity()
    client.destroy()
    client = null
    activity = null
}