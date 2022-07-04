//TODO watch dotenv
require('dotenv').config({ path: "../.env" });
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { response } = require('express');
const match = require('nodemon/lib/monitor/match');
const app = express();

app.use(cors());

const appendKeyToURL = (url, hasParams = false) => {
    return `${url}${hasParams ? "&" : "?"}api_key=${process.env.apiKey}`
}
const getID = async(playerName) => {
    const url = appendKeyToURL(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${playerName}`)
    const response = await axios.get(url)
    return response.data.id
}
const getStatsFromID = async(ID) => {
    const url = appendKeyToURL(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${ID}`)
    const response = await axios.get(url)
    return await response.data

}

const getPUUID = async(playerName) => {
    const url = appendKeyToURL(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${playerName}`)
    const response = await axios.get(url)
    return response.data.puuid
}
const getIcon = async(playerName) => {
    const url = appendKeyToURL(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${playerName}`)
    const response = await axios.get(url)
    return response.data.profileIconId
}
const getLevel = async(playerName) => {
    const url = appendKeyToURL(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${playerName}`)
    const response = await axios.get(url)
    return response.data.summonerLevel
}

const getMatchesIdsFromPUUID = async(PUUID, numberOfGames) => {
    const url = appendKeyToURL(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${PUUID}/ids?count=${numberOfGames}`, true)
    const response = await axios.get(url)
    return await response.data

}

const getMatchDetailsFromMatchId = async(matchId) => {
    const url = appendKeyToURL(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`)
    const response = await axios.get(url)
    return await response.data
}

// Requests
app.get('/:playerName?', async(req, res) => {
    try {
        const name = encodeURI(req.params.playerName)
        const icon = await getIcon(name)
        const level = await getLevel(name)
        const playerID = await getID(name)
        const playerStats = await getStatsFromID(playerID)
        const container = {
            iconID: icon,
            stats: playerStats,
            level: level,
        }


        res.json({ status: 200, data: container })
    } catch {
        const response = {
            status: 400,
            data: {},
        }
        res.json(response)
    }

})

app.get('/matches/:playerName/:numberOfMatches?', async(req, res) => {
    const numberOfMatches = req.params.numberOfMatches ? req.params.numberOfMatches : 1
    try {
        const name = encodeURI(req.params.playerName)
        const PUUID = await getPUUID(name)
        const matchesIds = await getMatchesIdsFromPUUID(PUUID, numberOfMatches)
        const matches = []
        for (const matchId of matchesIds) {
            matches.push(await getMatchDetailsFromMatchId(matchId))
        }
        res.json({ status: 200, data: matches })
    } catch {
        const response = {
            status: 400,
            data: {},
        }
        res.json(response)
    }

})

app.listen(process.env.port, () => {
    console.log(`Server started on port ${process.env.port}`);

});