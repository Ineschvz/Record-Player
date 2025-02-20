document.addEventListener('DOMContentLoaded', () => {
    fetch("./Record-Player/vinyl.svg")
    .then(response => response.text())
    .then(svg => {
        const recordContainer = document.getElementById('record-container');
        recordContainer.innerHTML = svg;
    });

    const clientId = '63c959b17a364d06bc757fa70e5fc230';
    const clientSecret = '80b6e890e996447f91b90281cc68e219';
    const spotifyIframe = document.getElementById('spotify-iframe');
    const playButton = document.getElementById('play-button');

    async function getAccessToken() {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });
        const data = await response.json();
        return data.access_token;
    }

    async function getSong(trackId) {
        const accessToken = await getAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });

        const data = await response.json();
        console.log(data); // Debugging: Check the response in the console

        if (data && data.external_urls && data.external_urls.spotify) {
            spotifyIframe.src = `https://open.spotify.com/embed/track/${trackId}`;
        } else {
            console.error("Error fetching song details.");
        }
    }

    playButton.addEventListener('click', async () => {
        const recordContainer = document.getElementById('record-container');
        const svgElement = recordContainer.querySelector('svg'); // Get the SVG inside the container
        const body = document.querySelector('body');
    
        // Add playing class to start animations
        if (svgElement) {
            svgElement.classList.add('playing'); // Start the SVG spin animation
        }
        if (body) {
            body.classList.add('playing'); // Start the background ripple animation
        }
    
        const trackId = "3dvXRk7TZ929m21p49RR5P"; // Your Spotify track ID
        await getSong(trackId);
        playButton.style.display = 'none';
        spotifyIframe.style.display = 'block';
    });

});
