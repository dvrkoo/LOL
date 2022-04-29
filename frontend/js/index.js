const BASEURL = "http://localhost:4000"

const getMatches = async (matchNumber = 10) => {
    const name = document.getElementById("summonerNameInput").value;
    const matches = await (await fetch(`${BASEURL}/matches/${name}/${matchNumber}`)).json()
    console.log(matches)
    return matches
}

const handleSearchMatches = () => {
    const searchButton = document.getElementById("searchButton")
    const summonerInput = document.getElementById("summonerNameInput")
    searchButton.addEventListener("click", () => getAndDisplayMatches())
    summonerInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            getAndDisplayMatches()
        }
    })
}
const getAndDisplayMatches = async () => {
    const matches = await getMatches()
    displayMatches(matches.data)

}
function displayMatches(matches) {
    console.log(matches)
    // Loop to access all rows
    const matchesTabs = matches.map((match) => {
        const matchTab = document.createElement("div")
        const players = document.createElement("div")
        const playerTabs = match.info.participants.map((player) => {
            const playerTab = document.createElement("div")
            const playerName = document.createElement("div")
            playerName.innerText = player.summonerName
            playerTab.appendChild(playerName)
            return playerTab
        })
        players.appendChild(...playerTabs)
        matchTab.appendChild(players)
        return matchTab
    })

    // Setting innerHTML as tab variable
    document.getElementById("games").innerHTML = matchesTabs

}
window.onload = () => {
    handleSearchMatches();
}