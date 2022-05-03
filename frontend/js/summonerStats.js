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
        const players = document.createElement("div")
        const playerTabs = match.info.participants.map((player) => {
            const playerTab = document.createElement("div")
            const playerName = document.createElement("p")
            playerName.innerText = player.summonerName
            playerTab.append(playerName)
            return playerTab
        })
        players.append(...playerTabs)
        matchTab.append(players)
        return matchTab
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