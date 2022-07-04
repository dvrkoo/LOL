const BASEURL = "http://localhost:4000"

let champData = new Object();
const handleSearchMatches = () => {
    const searchButton = document.getElementById("searchButton")
    const summonerInput = document.getElementById("summonerNameInput")
    searchButton.addEventListener("click", () => openProfileDetailsPage())
    summonerInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            openProfileDetailsPage()
        }
    })
}

const openProfileDetailsPage = () => {
    const summonerInput = document.getElementById("summonerNameInput")
    location.href = `summonerStats.html?summonerName=${summonerInput.value}`
}

const getMatches = async(matchNumber = 10) => {
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
        // creating Matchtab
        const matchTab = createTab("matchTab")
        const playersLeft = createTab("playersLeft")
        const playersRight = createTab("playersRight")
        const playerScore = createTab("playerScore")
        const matchInfo = createTab("matchInfo")
        const playerChampImage = createTab("playerChampImage")
        const playerStats = document.createElement("div")
        const playerInfo = createTab("playerInfo")
        matchTab.append(playerScore)
            //loop throught players
        const playerTabs = match.info.participants.map((player) => {
            const playerTab = createTab("playerTab")
            const champImage = createChampImage(player)
            const kda = document.createElement("span")
            playerScore.append(playerChampImage)
            const playerName = createPlayerName(player)
            if (player.summonerName.toLowerCase() == new URL(location.href).searchParams.get("summonerName").toLowerCase()) {
                getPlayerStats(playerChampImage, playerStats, kda, playerInfo, champImage, player)
                getMatchInfo(match, matchInfo, matchTab, player)
                champData = createChampArray(player, champData)
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


    })
    document.getElementById("games").append(...matchesTabs)
    displayChampWinrate(champData)


}

const createChampArray = (player, champData) => {
    const champName = player.championName
    const champWin = player.win
    if (champName in champData) {
        champWin === true ? champData[champName].winrate.win += 1 : champData[champName].winrate.loss += 1
    } else {
        let winrate = {
            win: 0,
            loss: 0,
        }
        champWin === true ? winrate.win = 1 : winrate.loss = 1
        champData[champName] = {
            winrate
        }
    }
    return champData
}
const displayChampWinrate = (champData) => {
    for (let champ of Object.keys(champData)) {
        const champName = document.createElement("p")
        champName.innerText = champ
        const winrateForEachChamp = document.getElementById("winrateForEachChamp")
        const champTab = document.createElement("div")
        champTab.setAttribute("class", "singleChampWrTab")
        const champStats = document.createElement("div")
        champStats.setAttribute("class", "champStats")
        const champTabImage = document.createElement("img")
        champTabImage.setAttribute("src", `http://ddragon.leagueoflegends.com/cdn/12.11.1/img/champion/${champ}.png`)
        champTabImage.setAttribute("height", "50px")
        const champTabWin = document.createElement("p")
        champTabWin.append(champData[champ].winrate.win + "W")
        const champTabLoss = document.createElement("p")
        champTabLoss.append(champData[champ].winrate.loss + "L")
        const champTabWinrate = document.createElement("p")
        const wr = ((champData[champ].winrate.win) / (champData[champ].winrate.win + champData[champ].winrate.loss) * 100).toFixed(2)
        champTabWinrate.append(wr + "% WR")
        champTab.append(champTabImage)
        champTab.append(champName)
        champStats.append(champTabWin)
        champStats.append(champTabLoss)
        champStats.append(champTabWinrate)
        champTab.append(champStats)
        winrateForEachChamp.append(champTab)
    }
}

const getAndDisplayMatches = async() => {
    const matches = await getMatches()
    const iconid = await getIcon()
    displayMatches(matches.data, iconid.data)
    console.log(champData)

}
const getPlayerStats = (playerChampImage, playerStats, kda, playerInfo, champImage, player) => {
    playerChampImage.append(champImage.cloneNode())
    playerStats.append(player.kills + "/")
    playerStats.append(player.deaths + "/")
    playerStats.append(player.assists)
    kda.append("KDA: " + ((player.kills + player.assists) / player.deaths).toFixed(2))
    playerInfo.append(player.totalMinionsKilled + "CS")
    playerInfo.append(" Wards:" + player.visionScore)

}
const getAndDisplayProfile = (info) => {
    const playerName = document.getElementById("playerName")
    playerName.innerText = new URL(location.href).searchParams.get("summonerName")
    const playerIcon = document.getElementById("playerIconimg")
    playerIcon.setAttribute("src", `https://ddragon.leagueoflegends.com/cdn/12.11.1/img/profileicon/${info.iconID}.png`)
    playerIcon.setAttribute("height", "100px")
    playerIcon.setAttribute("width", "100px")
    const playerLevel = document.getElementById("playerLevel")
    playerLevel.innerText = "level " + info.level
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
    win.setAttribute("id", "win")
    matchInfo.append(gameID)
    matchInfo.append(finalDate)
    matchInfo.append(displayDuration)
    win.append(player.win === true ? "Victory" : "Defeat")
    matchTab.append(matchInfo)
    matchInfo.append(win)
}

const createTab = (className) => {
    const tab = document.createElement("div")
    tab.setAttribute("class", className)
    return tab
}

const createPlayerName = (player) => {
    const playerName = document.createElement("a")
    playerName.innerText = player.summonerName
    playerName.setAttribute("href", `summonerStats.html?summonerName=${playerName.innerText}`)
    return playerName
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
    const rankTab = info.stats.map((queue) => {
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
    handleSearchMatches()
}