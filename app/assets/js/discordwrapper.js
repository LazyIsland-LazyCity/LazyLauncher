// Work in progress
const logger = require('./loggerutil')('%c[DiscordWrapper]', 'color: #7289da; font-weight: bold')

const {Client} = require('discord-rpc')

let client
let activity

exports.initRPC = function(genSettings, servSettings = null, initialDetails = 'En jeu'){
    logger.log('Now Loading Discord RPC')
    client = new Client({ transport: 'ipc' })

    activity = {
        details: initialDetails,
        state: 'En jeu',
        // largeImageKey: servSettings.largeImageKey,
        // largeImageText: servSettings.largeImageText,
        // smallImageKey: genSettings.smallImageKey,
        // smallImageText: genSettings.smallImageText,
        // startTimestamp: new Date().getTime(),
        // instance: false,
        partyId: "LazyIsland",
        partySize: 64,
        partyMax: 64,        
        // partySize: connected_players,
        // partyMax: maximum_players,        
        buttons: [
            { label: "Rejoindre", url: "https://lazycity.fr/" },
            { label: "Discord", url: "https://discord.lazycity.fr" }
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

exports.updateState = function(state){
    if(client){
        activity.state = state
        client.setActivity(activity)
        logger.log('Updated discord state to: ' + state)
    }
}

exports.clearState = function(){
    if(client){
        activity = {
            details: activity.details,
            largeImageKey: activity.largeImageKey,
            largeImageText: activity.largeImageText,
            startTimestamp: activity.startTimestamp,
            instance: activity.instance
        }
        client.setActivity(activity)
        logger.log('Cleared the activity state!')
    }
}

exports.updateDetails = function(details){
    if(client){
        activity.details = details
    // activity.partySize = connected_players,
    // activity.partyMax = maximum_players,        
    client.setActivity(activity)
    }
}

exports.clearDetails = function(){
    if(client){
        activity = {
            state: activity.state,
            largeImageKey: activity.largeImageKey,
            largeImageText: activity.largeImageText,
            startTimestamp: activity.startTimestamp,
            instance: activity.instance
        }
        logger.log('Cleared the activity details!')
    }
}

exports.resetTime = function(){
    if(client){
        activity.startTimestamp = new Date().getTime()
        client.setActivity(activity)
        logger.log('Reset the activity time!')
    }
}

exports.shutdownRPC = function(){
    if(!client) return
    client.clearActivity()
    client.destroy()
    client = null
    activity = null
}

exports.getClient = function(){
    return client
}