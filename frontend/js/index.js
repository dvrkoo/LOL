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


// Setting innerHTML as tab variable

window.onload = () => {
    handleSearchMatches();
}