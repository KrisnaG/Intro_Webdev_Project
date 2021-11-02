/* 
    Author: Krisna Gusti
*/

// Variables
const FISH_URL = "https://www.fishwatch.gov/api/species";
const FIST_LIST = document.getElementById("fish-list");

// Load 
window.addEventListener("load", "methodCall");

// Retrieve list of fish from API



async function getFishList() {
    fetch(FISH_URL).then(console.log(Response))
}


fetch(FISH_URL)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        console.log(data);
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });

  // Add list of fish to dropdown list