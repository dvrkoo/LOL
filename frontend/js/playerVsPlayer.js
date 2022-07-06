let champData = new Object();
let otherChampData = new Object();
let bothChampData = new Object();
const BASEURL = "http://localhost:4000"

const getMatches = async(matchNumber = 3) => {
    const name = new URL(location.href).searchParams.get("summonerName");
    const otherName = new URL(location.href).searchParams.get("otherSummonerName");
    const matchArray = {}
    const matches = await (await fetch(`${BASEURL}/matches/${encodeURI(name)}/${matchNumber}`)).json()
    const otherMatches = await (await fetch(`${BASEURL}/matches/${encodeURI(otherName)}/${matchNumber}`)).json()
    matchArray[name] = matches
    matchArray[otherName] = otherMatches
    return matchArray
}

const getIcon = async() => {
    const name = new URL(location.href).searchParams.get("summonerName");
    const otherName = new URL(location.href).searchParams.get("otherSummonerName");
    const icons = {}
    const icon = await (await fetch(`${BASEURL}/${name}`)).json()
    const otherIcon = await (await fetch(`${BASEURL}/${otherName}`)).json()
    icons[name] = icon
    icons[otherName] = otherIcon

    console.log(icons)
    return icons
}
const getAndDisplayMatches = async() => {
    //const matches = await getMatches()

    const iconid = await getIcon()
    const matches = await getMatches()
    console.log(matches)
    getAndDisplayProfile(iconid)
    getAndDisplayRank(iconid)
    displayMatches(matches)
    console.log(champData)
    displayChampWinrate(champData)
    displayChampWinrate(otherChampData)
        //displayMatches(matches.data, iconid.data)
}
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
const getAndDisplayProfile = (info) => {
    const playerName = document.getElementById("playerName")
    playerName.innerText = new URL(location.href).searchParams.get("summonerName")
    const playerIcon = document.getElementById("playerIconimg")
    playerIcon.setAttribute("src", `https://ddragon.leagueoflegends.com/cdn/12.11.1/img/profileicon/${info[playerName.innerText].data.iconID}.png`)
    playerIcon.setAttribute("height", "100px")
    playerIcon.setAttribute("width", "100px")
    const playerLevel = document.getElementById("playerLevel")
    playerLevel.innerText = "level " + info[playerName.innerText].data.level



    const otherPlayerName = document.getElementById("otherPlayerName")
    otherPlayerName.innerText = new URL(location.href).searchParams.get("otherSummonerName")
    const otherPlayerIcon = document.getElementById("otherPlayerIconimg")
    otherPlayerIcon.setAttribute("src", `https://ddragon.leagueoflegends.com/cdn/12.11.1/img/profileicon/${info[otherPlayerName.innerText].data.iconID}.png`)
    otherPlayerIcon.setAttribute("height", "100px")
    otherPlayerIcon.setAttribute("width", "100px")
    const otherPlayerLevel = document.getElementById("otherPlayerLevel")
    otherPlayerLevel.innerText = "level " + info[otherPlayerName.innerText].data.level
}

const getAndDisplayRank = (info) => {
    let second = false
    for (let player in info) {
        const rankTab = info[player].data.stats.map((queue) => {
            displayPlayerRank(queue, second)
            displayRankInfo(queue, second)
            if (rankedInfoSolo.innerText == "" || rankedInfoSolo.innerText == null) {
                rankedInfoSolo.innerText = "UNRANKED"
                const playerRankSolo = document.getElementById("playerRankSolo")
                playerRankSolo.setAttribute("src", "../resources/ranked-emblems/Emblem_unranked.png")
                playerRankSolo.setAttribute("height", "100px")
            } else if (rankedInfoFlex.innerText == "" || rankedInfoFlex.innerText == null) {
                rankedInfoFlex.innerText = "UNRANKED"
                const playerRankFlex = document.getElementById("playerRankFlex")
                playerRankFlex.setAttribute("src", "../resources/ranked-emblems/Emblem_unranked.png")
                playerRankFlex.setAttribute("height", "100px")
            }
        })
        second = true
    }
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
const displayMatches = (matches) => {
    let second = false
    for (let players in matches) {
        const matchesTabs = matches[players].data.map((match) => {

            const playerTabs = match.info.participants.map((player) => {

                if (player.summonerName.toLowerCase() == new URL(location.href).searchParams.get("summonerName").toLowerCase() && second === false) {
                    champData = createChampArray(player, champData)
                }
                if (player.summonerName.toLowerCase() == new URL(location.href).searchParams.get("otherSummonerName").toLowerCase() && second === true) {
                    otherChampData = createChampArray(player, otherChampData)
                }
            })
        })
        second = true
    }

    console.log(otherChampData)
    return champData, otherChampData
}
const displayChampWinrate = (champData) => {


    //for (let champ)
    for (let champ of Object.keys(champData)) {
        const bothWinrates = document.getElementById("bothWinrates")
        const winrateGames = document.createElement("div")
        winrateGames.setAttribute("class", "winrateGames")
        const championWinrate = document.createElement("div")
        winrateGames.setAttribute("class", "championWinrate")
        const winrateForEachChamp = document.createElement("div")
        winrateGames.setAttribute("class", "winrateForEachChamp")
        const champName = document.createElement("p")
        champName.innerText = champ
        const champTab = document.createElement("div")
        champTab.setAttribute("class", "singleChampWrTab")
        const champStats = document.createElement("div")
        champStats.setAttribute("class", "champStats")
        const champImage = document.createElement("img")
        champImage.setAttribute("src", `http://ddragon.leagueoflegends.com/cdn/12.11.1/img/champion/${champ}.png`)
        champImage.setAttribute("height", "50px")
        const champTabImage = document.createElement("div")
        champTabImage.setAttribute("class", "champTabImage")
        champTabImage.append(champImage)
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
        championWinrate.append(winrateForEachChamp)
        winrateGames.append(championWinrate)
        bothWinrates.append(winrateGames)
    }
}
const displayRankInfo = (queue, second) => {
    let rankedInfo
    second == false ? rankedInfo = document.getElementById(queue.queueType == "RANKED_FLEX_SR" ? "rankedInfoFlex" : "rankedInfoSolo") : rankedInfo = document.getElementById(queue.queueType == "RANKED_FLEX_SR" ? "otherRankedInfoFlex" : "otherRankedInfoSolo")
    rankedInfo.innerText = queue.tier + " " + queue.rank + " " + queue.leaguePoints + " LP"
    let wins
    second == false ? wins = document.getElementById(queue.queueType == "RANKED_FLEX_SR" ? "winsFlex" : "winsSolo") : wins = document.getElementById(queue.queueType == "RANKED_FLEX_SR" ? "otherWinsFlex" : "otherWinsSolo")
    wins.innerText = "wins : " + queue.wins
    let loss
    second == false ? loss = document.getElementById(queue.queueType == "RANKED_FLEX_SR" ? "lossFlex" : "lossSolo") : loss = document.getElementById(queue.queueType == "RANKED_FLEX_SR" ? "otherLossFlex" : "otherLossSolo")
    loss.innerText = "loss : " + queue.losses
    let winrate
    second == false ? winrate = document.getElementById(queue.queueType == "RANKED_FLEX_SR" ? "winrateFlex" : "winrateSolo") : winrate = document.getElementById(queue.queueType == "RANKED_FLEX_SR" ? "otherWinrateFlex" : "otherWinrateSolo")
    const wr = queue.wins / (queue.wins + queue.losses) * 100
    winrate.innerText = "winrate : " + wr.toFixed(2) + "%"
}
const displayPlayerRank = (queue, second) => {
    let playerRank
    second == false ? playerRank = document.getElementById(queue.queueType == "RANKED_FLEX_SR" ? "playerRankFlex" : "playerRankSolo") : playerRank = document.getElementById(queue.queueType == "RANKED_FLEX_SR" ? "otherPlayerRankFlex" : "otherPlayerRankSolo")
    playerRank.setAttribute("src", `../resources/ranked-emblems/Emblem_${queue.tier}.png`)
    playerRank.setAttribute("height", "100px")
}

window.onload = () => {
    getAndDisplayMatches()
    handleSearchMatches()
}