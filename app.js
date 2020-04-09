/*jshint esversion: 6 */
const select = document.getElementById('breeds');
const card = document.querySelector('.card');
const form = document.querySelector('form');

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------

function fetchData(url) { //create a master function to make fetch requests
  return fetch(url) //it will return the fetch request of that url
    .then(checkStatus)
    .then(res => res.json()) //turn the response into json format.
    .catch(error => console.log('Looks like there was a problem!', error));
}

Promise.all([
  fetchData('https://dog.ceo/api/breeds/list'),
  fetchData('https://dog.ceo/api/breeds/image/random')
])
.then(data => {
  const breedList = data[0].message;
  const randomImage = data[1].message;

  generateOptions(breedList);
  generateImage(randomImage);
});




  // ------------------------------------------
  //  HELPER FUNCTIONS
  // ------------------------------------------

function checkStatus(response) {
  if(response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

//generateOptions function will take the breed data, map over each one and create a new option for our drop down list.
function generateOptions(data) {
  const options = data.map(item => `
    <option value='${item}'>${item}</option>
  `);
  select.innerHTML = options;
}

//generateImage function will take the random image data, create a new img and paragraph element for it.
function generateImage(data) {
  const image =  `
  <img src="${data}" alt>
  <p>Click to view images of ${select.value}s</p>
  `;
  card.innerHTML = image;
}

//fetchBreedImage function will call a random image of the breed the user selects from the menu.
function fetchBreedImage() {
  const breed = select.value;
  const image = card.querySelector('img');
  const p = card.querySelector('p');

  fetchData(`https://dog.ceo/api/breed/${breed}/images/random`) //Another fetch request targeting the specific breed selected.
    .then(data => {
      image.src = data.message;
      image.alt = breed;
      p.textContent = `Click to view more ${breed}s`;
    });
}


  // ------------------------------------------
  //  EVENT LISTENERS
  // ------------------------------------------

  select.addEventListener('change', fetchBreedImage);
  card.addEventListener('click', fetchBreedImage);
  form.addEventListener('submit', postData);


  // ------------------------------------------
//  POST DATA
// ------------------------------------------

function postData(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const comment = document.getElementById('comment').value;

  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, comment })
  };

  fetch('https://jsonplaceholder.typicode.com/comments', config)
  .then(checkStatus)
  .then(res => res.json())
  .then(data => console.log(data));
}

  // A Promise represents an eventual result of an operation.
  // Waits on the completetion of one function to move on to the next.
  // The fetch method always returns a promise.
