const BASEURL = "http://localhost:4000"


const getMatches = async(matchNumber = 2) => {
    const name = new URL(location.href).searchParams.get("summonerName");
    const matches = await (await fetch(`${BASEURL}/matches/${name}/${matchNumber}`)).json()
    console.log(matches)

    return matches
}


const displayMatches = (matches) => {

    // Loop to access all rows
    const matchesTabs = matches.map((match) => {
        const matchTab = document.createElement("div")
        matchTab.setAttribute("class", "test")
        const playersLeft = document.createElement("div")
        const playersRight = document.createElement("div")
        playersLeft.setAttribute("class", "leftPlayers")
        playersRight.setAttribute("class", "rightPlayers")
        const playerScore = document.createElement("div")
        const matchInfo = document.createElement("div")
        matchInfo.setAttribute("class", "matchInfo")
        const playerChampImage = document.createElement("div")
        playerChampImage.setAttribute("class", "playerImage")
        playerScore.setAttribute("class", "score")
        const playerInfo = document.createElement("div")
        const playerStats = document.createElement("div")
        playerInfo.setAttribute("class", "kda")
        const gameID = document.createElement("div")
        const gameCreation = match.info.gameEndTimestamp
        const date = new Date(gameCreation)
        const minutes = Math.floor(match.info.gameDuration / 60);
        const seconds = match.info.gameDuration - minutes * 60;
        const dateDisplayed = "Game Duration: " + minutes + "m " + seconds + "s"
        const humanDateFormat = date.toLocaleString()
        const finalDate = document.createElement("div")
        finalDate.append(humanDateFormat)
        match.info.queueId == "420" && gameID.append("Ranked Solo")
        match.info.queueId == "440" && gameID.append("Flex 5:5 Rank")
        const win = document.createElement("div")



        matchInfo.append(gameID)
        matchInfo.append(finalDate)
        matchInfo.append(dateDisplayed)
        win == "true" && matchInfo.append("victory")
        matchTab.append(matchInfo)
        matchTab.append(playerScore)
        const playerTabs = match.info.participants.map((player) => {
            const playerTab = document.createElement("div")
            playerTab.setAttribute("class", "tabPlayer")
            const playerName = document.createElement("p")
            const champImage = document.createElement("img")
            champImage.setAttribute("src", `http://ddragon.leagueoflegends.com/cdn/12.8.1/img/champion/${player.championName}.png`)
            champImage.setAttribute("width", "20")
            champImage.setAttribute("height", "20")
            player.summonerName.toLowerCase() === new URL(location.href).searchParams.get("summonerName") && playerChampImage.append(champImage.cloneNode())

            player.summonerName.toLowerCase() === new URL(location.href).searchParams.get("summonerName") && win.append(player.win)
            playerScore.append(playerChampImage)
            player.summonerName.toLowerCase() === new URL(location.href).searchParams.get("summonerName") && playerStats.append(player.kills + "/")
            player.summonerName.toLowerCase() === new URL(location.href).searchParams.get("summonerName") && playerStats.append(player.deaths + "/")
            player.summonerName.toLowerCase() === new URL(location.href).searchParams.get("summonerName") && playerStats.append(player.assists)
            const kda = document.createElement("span")
            player.summonerName.toLowerCase() === new URL(location.href).searchParams.get("summonerName") && kda.append("KDA: " + ((player.kills + player.assists) / player.deaths))
            player.summonerName.toLowerCase() === new URL(location.href).searchParams.get("summonerName") && playerInfo.append(player.totalMinionsKilled + "CS")
            player.summonerName.toLowerCase() === new URL(location.href).searchParams.get("summonerName") && playerInfo.append(" Wards:" + player.visionScore)
            playerName.innerText = player.summonerName //+ " " + player.kills + "/" + player.deaths
            playerScore.append(playerStats)
            playerScore.append(playerInfo)
            playerInfo.append(kda)

            playerTab.append(champImage)
            playerTab.append(playerName)
            return playerTab

        })
        console.log(win)
        const gameWin = document.createElement("div")
        win.innerHTML === "true" && gameWin.append("Victory")
        win === "false" && gameWin.append("Defeat")
        matchInfo.append(gameWin)
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
    displayMatches(matches.data)

}

window.onload = () => {
    getAndDisplayMatches()
}