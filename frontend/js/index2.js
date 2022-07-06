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
    const summonerInputTwo = document.getElementById("summonerNameInputTwo")
    location.href = `playerVsPlayer.html?summonerName=${summonerInput.value}&otherSummonerName=${summonerInputTwo.value}`
}


// Setting innerHTML as tab variable

window.onload = () => {
    handleSearchMatches();
}