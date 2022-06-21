const axios = require('axios');
const { appendKeyToURL } = require("./server");

async function getStatsFromID(ID) {
    const url = appendKeyToURL(`https://europe.api.riotgames.com//lol/league/v4/entries/by-summoner/${ID}`, true);
    const response = await axios.get(url);
    return await response.data;

}
exports.getStatsFromID = getStatsFromID;