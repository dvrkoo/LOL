const BASEURL = "http://localhost:4000"

const getMatches = async (matchNumber=1) => {
    const name = document.getElementById("summonerNameInput").value;
    const matches = await (await fetch(`${BASEURL}/matches/${name}/${matchNumber}`)).json()
    console.log(matches)
}

const handleSearchMatches = () => {
    const searchButton = document.getElementById("searchButton")
    const summonerInput = document.getElementById("summonerNameInput")
    searchButton.addEventListener("click", () => getMatches())
    summonerInput.addEventListener("keypress" , (event) => {
        if (event.key === "Enter") {
            getMatches()
        }
    })
}

window.onload = () => {
    handleSearchMatches();
}