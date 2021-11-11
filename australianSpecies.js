/* 
    Website about Queensland Animal Species
    Author: Krisna Gusti
    API URL: https://www.data.qld.gov.au/dataset/qld-wildlife-data-api
*/

// Variables
const CLASS_LIST = document.getElementById("class-list");
const FAMILY_LIST = document.getElementById("family-list");
const SPECIES_LIST = document.getElementById("species-list");

// url's
const CLASS_URL = 'https://apps.des.qld.gov.au/species/?op=getclassnames&kingdom=animals';
const FAMILY_URL = 'https://apps.des.qld.gov.au/species/?op=getfamilynames&kingdom=animals&class=';
const SPECIES_URL = 'https://apps.des.qld.gov.au/species/?op=getspecies&kingdom=animals&family=';
const ID_URL = 'https://apps.des.qld.gov.au/species/?op=getspeciesbyid&taxonid=';
const IMAGE_URL = '';

// key value pairs
var className = {};
var familyName = {};
var speciesName = {}

// when page first loads 
window.addEventListener("load", updateClassList);

// when class or family change
document.getElementById("class-list").addEventListener("change", updateFamilyList);
document.getElementById("family-list").addEventListener("change", updateSpeciesList);

// when find is clicked
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

// Create new element for drop down list
function createOption(text) {
    let option = document.createElement("option");
    option.textContent = text;
    return option;
}

// Populate the species class list
function updateClassList() {
    fetchInformation(CLASS_URL).then(
        function(data) {
            // 
            for(element of data.Class) {
                let selectedClass = element.ClassCommonName;
                // append class name to list
                CLASS_LIST.appendChild(createOption(selectedClass));
                // 
                className[element.ClassCommonName] = element.ClassName;
            }
            document.getElementById("class-list").value = "";
        }
    );
}

// Populate the species family list 
function updateFamilyList() {
    fetchInformation(FAMILY_URL + className[document.getElementById("class-list").value]).then(
        function(data) {
            // clear family list
            FAMILY_LIST.innerHTML = "";
            SPECIES_LIST.innerHTML = "";
            //
            for(element of data.Family) {
                let selectedFamily = element.FamilyCommonName;
                // append family name to list
                FAMILY_LIST.appendChild(createOption(selectedFamily));
                // store scientific family name
                familyName[element.FamilyCommonName] = element.FamilyName;
            }
            document.getElementById("family-list").value = "";
        }
    );
}

// Populate the species name list
function updateSpeciesList() {
    fetchInformation(SPECIES_URL + familyName[document.getElementById("family-list").value]).then(
        function(data) {
            // clear species list
            SPECIES_LIST.innerHTML = "";
            // 
            for(element of data.Species) {
                //
                let selectedSpecies = element.AcceptedCommonName;
                if(!selectedSpecies) {
                    selectedSpecies = element.ScientificName;
                }
                // append species name to list
                SPECIES_LIST.appendChild(createOption(selectedSpecies));
                speciesName[selectedSpecies] = element.TaxonID;
            }
        }
    );
}

// when the find button is clicked
function findSpecies() {
    // reveal table
    document.getElementById("species-table").hidden = false;
    let id = speciesName[document.getElementById("species-list").value];
    // if id of species exists
    if(id) {
        // hide error message if it was displayed
        document.getElementById("find-error").hidden = true;
        // get info
        fetchInformation(ID_URL + id).then(
            function(data) {
                getSpeciesImage(data.Species);
                getSpeciesInformation(data.Species);
            }
        );
    } else {
        document.getElementById("find-error").hidden = false;
    }
}

function getSpeciesImage(data) {
    // remove previous image
    document.getElementById("image-container").innerHTML = "<img src=\"\" alt=\"\" id=\"species-image\">"
    document.getElementById("image-container").hidden = false;
    // get image
    try { 
        // if multiple images exist      
        if(!Array.isArray(data.Image)) {     
            document.getElementById("species-image").src = data.Image.URL;
        } else {
            let imageContainer = document.getElementById("image-container");
            for(let i = 0; i < data.Image.length; i++) {
                imageContainer.innerHTML = imageContainer.innerHTML + "<img src=\"" + data.Image[i].URL + "\"/><br/>";
            } 
        }
    // unable to get an image
    } catch(TypeError) {
        document.getElementById("image-container").innerHTML = "No Image Available"
    }
}

function getSpeciesInformation(data) {
    // If no accepted name exists
    if(data.AcceptedCommonName == undefined) {
        document.getElementById("name-info").innerHTML = data.ScientificName;
    } else {
        document.getElementById("name-info").innerHTML = data.AcceptedCommonName;
    }
    // if no species environment exists
    if(data.SpeciesEnvironment == undefined) {
        document.getElementById("environment-info").innerHTML = "Not available"
    } else {
        document.getElementById("environment-info").innerHTML = data.SpeciesEnvironment;        
    }
    // these elements are always provided with data
    document.getElementById("sname-info").innerHTML = data.ScientificName;
    document.getElementById("pest-info").innerHTML = data.PestStatus;
}