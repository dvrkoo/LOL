const BASEURL = "http://localhost:4000"


const getMatches = async(matchNumber = 3) => {
    const name = new URL(location.href).searchParams.get("summonerName");
    const matches = await (await fetch(`${BASEURL}/matches/${encodeURI(name)}/${matchNumber}`)).json()
    console.log(matches)
    return matches
}

const getIcon = async() => {
    const name = new URL(location.href).searchParams.get("summonerName");

    const icon = await (await fetch(`${BASEURL}/${name}`)).json()
    console.log(icon)
    return icon
}


const displayMatches = (matches, info) => {
    //display infos that don't neet loop
    getAndDisplayProfile(info);
    getAndDisplayRank(info);
    // Loop to access all rows
    const matchesTabs = matches.map((match) => {
        console.log(match);
        // creating Matchtab
        const matchTab = createMatchTab()
        const playersLeft = createPlayersLeft()
        const playersRight = createPlayersRight()
        const playerScore = createPlayerScore()
        const matchInfo = createMatchInfo()
        const playerChampImage = createPlayerChampImage()
        const playerStats = document.createElement("div")
        const playerInfo = createPlayerInfo()

        matchTab.append(playerScore)
            //loop throught players
        const playerTabs = match.info.participants.map((player) => {
            const playerTab = createPlayerTab()
            const champImage = createChampImage(player)
            const kda = document.createElement("span")
            playerScore.append(playerChampImage)
            const playerName = createPlayerName(player)
            console.log(new URL(location.href).searchParams.get("summonerName"))
            if (player.summonerName.toLowerCase() == new URL(location.href).searchParams.get("summonerName").toLowerCase()) {
                getMatchInfo(match, matchInfo, matchTab, player)
                playerChampImage.append(champImage.cloneNode())
                playerStats.append(player.kills + "/")
                playerStats.append(player.deaths + "/")
                playerStats.append(player.assists)
                kda.append("KDA: " + ((player.kills + player.assists) / player.deaths).toFixed(2))
                playerInfo.append(player.totalMinionsKilled + "CS")
                playerInfo.append(" Wards:" + player.visionScore)
            }
            playerScore.append(playerStats)
            playerScore.append(playerInfo)
            playerInfo.append(kda)
            playerTab.append(champImage)
            playerTab.append(playerName)
            return playerTab

        })

        const playerTabLeft = playerTabs.slice(0, 5)
        const playerTabRight = playerTabs.slice(5, 10)
        playersLeft.append(...playerTabLeft)
        playersRight.append(...playerTabRight)
        matchTab.append(playersLeft)
        matchTab.append(playersRight)

        return matchTab
        console.log(matchTab)

    })
    document.getElementById("games").append(...matchesTabs)
}

const getAndDisplayMatches = async() => {
    const matches = await getMatches()
    const iconid = await getIcon()
    displayMatches(matches.data, iconid.data)

}

const getAndDisplayProfile = (info) => {
    const playerName = document.getElementById("playerName")
    playerName.innerText = new URL(location.href).searchParams.get("summonerName")
    const playerIcon = document.getElementById("playerIconimg")
    playerIcon.setAttribute("src", `https://ddragon.leagueoflegends.com/cdn/12.11.1/img/profileicon/${info[0]}.png`)
    playerIcon.setAttribute("height", "100px")
    playerIcon.setAttribute("width", "100px")
    const playerLevel = document.getElementById("playerLevel")
    playerLevel.innerText = "level " + info[2]
}

const getMatchInfo = (match, matchInfo, matchTab, player) => {
    const gameID = document.createElement("div")
    const gameCreation = match.info.gameEndTimestamp
    const date = new Date(gameCreation)
    const minutes = Math.floor(match.info.gameDuration / 60);
    const seconds = match.info.gameDuration - minutes * 60;
    const displayDuration = document.createElement("div")
    const dateDisplayed = "Game Duration: " + minutes + "m " + seconds + "s"
    displayDuration.append(dateDisplayed)
    const humanDateFormat = date.toLocaleString()
    const finalDate = document.createElement("div")
    finalDate.append(humanDateFormat)
    match.info.queueId == "400" && gameID.append("Normal Game")
    match.info.queueId == "420" && gameID.append("Ranked Solo")
    match.info.queueId == "440" && gameID.append("Flex 5:5 Rank")
    const win = document.createElement("div")
    matchInfo.append(gameID)
    matchInfo.append(finalDate)
    matchInfo.append(displayDuration)
    console.log(player.win)
    win.append(player.win === true ? "Victory" : "Defeat")
    console.log(win.innerText)
    matchTab.append(matchInfo)
    matchInfo.append(win)
}

const createPlayerTab = () => {
    const playerTab = document.createElement("div")
    playerTab.setAttribute("class", "tabPlayer")
    return playerTab
}
const createPlayerName = (player) => {
    const playerName = document.createElement("a")
    playerName.innerText = player.summonerName
    playerName.setAttribute("href", `summonerStats.html?summonerName=${playerName.innerText}`)
    return playerName
}

const createMatchTab = () => {
    const matchTab = document.createElement("div")
    matchTab.setAttribute("class", "test")
    return matchTab
}
const createPlayersLeft = () => {
    const playersLeft = document.createElement("div")
    playersLeft.setAttribute("class", "leftPlayers")
    return playersLeft
}
const createPlayersRight = () => {
    const playersRight = document.createElement("div")
    playersRight.setAttribute("class", "rightPlayers")
    return playersRight
}
const createPlayerScore = () => {
    const playerScore = document.createElement("div")
    playerScore.setAttribute("class", "score")
    return playerScore
}
const createMatchInfo = () => {
    const matchInfo = document.createElement("div")
    matchInfo.setAttribute("class", "matchInfo")
    return matchInfo
}
const createPlayerChampImage = () => {
    const playerChampImage = document.createElement("div")
    playerChampImage.setAttribute("class", "playerImage")
    return playerChampImage
}
const createPlayerInfo = () => {
    const playerInfo = document.createElement("div")
    playerInfo.setAttribute("class", "kda")
    return playerInfo
}

const createChampImage = (player) => {
    const champImage = document.createElement("img")
    if (player.championName == "FiddleSticks") {
        player.championName = "Fiddlesticks"
    }
    champImage.setAttribute("src", `http://ddragon.leagueoflegends.com/cdn/12.11.1/img/champion/${player.championName}.png`)

    champImage.setAttribute("width", "20")
    champImage.setAttribute("height", "20")
    return champImage
}

const getAndDisplayRank = (info) => {
    const rankTab = info[1].map((queue) => {
        console.log(queue)
        const playerRank = document.getElementById(queue.queueType == "RANKED_FLEX_SR" ? "playerRankFlex" : "playerRankSolo")
        playerRank.setAttribute("src", `../resources/ranked-emblems/Emblem_${queue.tier}.png`)
        playerRank.setAttribute("height", "100px")
        const rankedInfo = document.getElementById(queue.queueType == "RANKED_FLEX_SR" ? "rankedInfoFlex" : "rankedInfoSolo")
        rankedInfo.innerText = queue.tier + " " + queue.rank + " " + queue.leaguePoints + " LP"
        const wins = document.getElementById(queue.queueType == "RANKED_FLEX_SR" ? "winsFlex" : "winsSolo")
        wins.innerText = "wins : " + queue.wins
        const loss = document.getElementById(queue.queueType == "RANKED_FLEX_SR" ? "lossFlex" : "lossSolo")
        loss.innerText = "loss : " + queue.losses
        const winrate = document.getElementById(queue.queueType == "RANKED_FLEX_SR" ? "winrateFlex" : "winrateSolo")
        const wr = queue.wins / (queue.wins + queue.losses) * 100
        winrate.innerText = "winrate : " + wr.toFixed(2) + "%"
        if (rankedInfoSolo.innerText == "") {
            rankedInfoSolo.innerText = "UNRANKED"
            const playerRankSolo = document.getElementById("playerRankSolo")
            playerRankSolo.setAttribute("src", "../resources/ranked-emblems/Emblem_unranked.png")
            playerRankSolo.setAttribute("height", "100px")
        } else if (rankedInfoFlex.innerText == "") {
            rankedInfoFlex.innerText = "UNRANKED"
            const playerRankFlex = document.getElementById("playerRankFlex")
            playerRankFlex.setAttribute("src", "../resources/ranked-emblems/Emblem_unranked.png")
            playerRankFlex.setAttribute("height", "100px")
        }
    })

}

const createRank = () => {

}
window.onload = () => {
    getAndDisplayMatches()
}