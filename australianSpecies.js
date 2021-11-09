/* 
    Author: Krisna Gusti
*/

// Variables

//https://www.data.qld.gov.au/dataset/qld-wildlife-data-api

const CLASS_LIST = document.getElementById("class-list");
const FAMILY_LIST = document.getElementById("family-list");
const SPECIES_LIST = document.getElementById("species-list");

// url's
const CLASS_URL = 'https://apps.des.qld.gov.au/species/?op=getclassnames&kingdom=animals';
const FAMILY_URL = 'https://apps.des.qld.gov.au/species/?op=getfamilynames&kingdom=animals&class=';
const SPECIES_URL = 'https://apps.des.qld.gov.au/species/?op=getspecies&kingdom=animals&family=';
const IMAGE_URL = '';

var class_list = {};
var family_list = {};

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

// 
function createOption(text) {
    let option = document.createElement("option");
    option.textContent = text;
    return option;
}

// Add list of species to dropdown list
function updateClassList() {
    fetchInformation(CLASS_URL).then(
        function(data) {
            //
            for(element of data.Class) {
                let selected_class = element.ClassCommonName;
                // append species to list
                CLASS_LIST.appendChild(createOption(selected_class));

                // 
                class_list[element.ClassCommonName] = element.ClassName;
            }
        }
    );
}

// 
function updateFamilyList() {
    fetchInformation(FAMILY_URL + class_list[document.getElementById("class-list").value]).then(
        function(data) {
            // clear family list
            FAMILY_LIST.innerHTML = "";

            //
            for(element of data.Family) {
                let selected_family = element.FamilyCommonName;
                // append species to list
                FAMILY_LIST.appendChild(createOption(selected_family));
                // store scientific family name
                family_list[element.FamilyCommonName] = element.FamilyName;
            }
        }
    );
}

// 
function updateSpeciesList() {
    fetchInformation(SPECIES_URL + family_list[document.getElementById("family-list").value]).then(
        function(data) {
            // clear species list
            SPECIES_LIST.innerHTML = "";

            //
            for(element of data.Species) {
                let selected_species = element.AcceptedCommonName;
                if(!selected_species) {
                    selected_species = element.ScientificName;
                }
                // append species to list
                SPECIES_LIST.appendChild(createOption(selected_species));
            }
        }
    );
}

// 
function findSpecies() {
    if(document.getElementById("species-list").value) {
        document.getElementById("find-error").hidden = true;
        
    } else {
        document.getElementById("find-error").hidden = false;
    }
}

function getSpeciesImage(id) {
    // get species by id
    fetchInformation(SPECIES_URL+id).then(
        function(data) {
            document.getElementById("species-image").src = (IMAGE_URL + data.imageIdentifier);
        }
    );
}