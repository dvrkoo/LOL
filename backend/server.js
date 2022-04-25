//TODO watch dotenv
require('dotenv').config( {path : "../.env"});
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const config = require('./config.json');
const { response } = require('express');
const match = require('nodemon/lib/monitor/match');
const app = express();

app.use(cors());

const appendKeyToURL = (url, hasParams = false) => {
    return `${url}${hasParams ? "&" : "?"}api_key=${process.env.apiKey}`
}

const getPUUID = async (playerName) => {
    const url = appendKeyToURL(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${playerName}`)
    const response = await axios.get(url)
    return response.data.puuid
}

const getMatchesIdsFromPUUID = async (PUUID, numberOfGames) => {
    const url = appendKeyToURL(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${PUUID}/ids?count=${numberOfGames}`, true)
    const response = await axios.get(url)
    return await response.data

}

const getMatchDetailsFromMatchId = async (matchId) => {
    const url = appendKeyToURL(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`)
    const response = await axios.get(url)
    return await response.data
}

// Requests
app.get('/matches/:playerName/:numberOfMatches?', async (req, res) => {
    const numberOfMatches = req.params.numberOfMatches ? req.params.numberOfMatches : 1
    try {
        const PUUID = await getPUUID(req.params.playerName)
        const matchesIds = await getMatchesIdsFromPUUID(PUUID, numberOfMatches)
        const matches = []
        for (const matchId of matchesIds) {
            matches.push(await getMatchDetailsFromMatchId(matchId))
        }
        res.json({status: 200, data: matches})
    } catch {
        const response = {
            status: 400,
            data: {},
        }
        res.json(response)
    }
    
})

app.listen(config.port, () => {
    console.log(`Server started on port ${config.port}`);

});