/* 
    Author: Krisna Gusti
*/

// Variables
//////https://bie-ws.ala.org.au/ws/species/ {guid}
const SPECIES_LIST = document.getElementById("species-list");
const LIST_URL = 'https://lists.ala.org.au/ws/speciesListItems/dr781'; 
const SPECIES_URL = 'https://bie-ws.ala.org.au/ws/species/';
const IMAGE_URL = 'https://images.ala.org.au/image/proxyImageThumbnailLarge?imageId=';

// when page first loads 
window.addEventListener("load", updateSpeciesList);

//
document.getElementById("find").addEventListener("click", findSpecies);

// Retrieve information from API
async function fetchInformation(url) {
    try {
        let fetched = await fetch(url);
        if(fetched) {
            let read = await fetched.json()
            return read;
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

// Add list of species to dropdown list
function updateSpeciesList() {
    fetchInformation(LIST_URL).then(
        function(data) {
            // get each species
            for(element of data) {
                let name = element.commonName;
                // If no common name exists
                if(name == null) {
                    name = element.name;
                }
                // append species to list
                SPECIES_LIST.appendChild(createOption(name));
            }
        }
    );
}

// 
function createOption(text) {
    let option = document.createElement("option");
    option.textContent = text;
    return option;
}

//
function findSpecies() {
    console.log(document.getElementById("species-list").value);
    fetchInformation(LIST_URL).then(
        function(data) {
            for(element of data) {
                let name = element.commonName;
                if(name == null) {
                    name = element.name;
                }
                // if match found
                if(name == document.getElementById("species-list").value) {
                    fetchImage(element.lsid);
                }
            }
        }
    );
}

function fetchImage(id) {
    //get species by id
    fetchInformation(SPECIES_URL+id).then(
        function(data) {
            document.getElementById("species-image").src = (IMAGE_URL + data.imageIdentifier);
        }
    );
    // 
}