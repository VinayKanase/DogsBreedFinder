//Selectors or Global Variables
var allNamesofBreeds = [];
var allIdsofBreeds = [];
let imageUrlarray =[]; 
let imageNamearray =[];
let done = 0;
let alldataOFbreeds;
let completed = false;
let searchBreed = []; 
let searchBreedData = []; 
var sethead = {
  "x-api-key" : "f6df9d10-8218-4fe1-9a61-d977d13c99c6"
}
const searchInput = document.querySelector("#breedname-reqimage");
const ul = document.querySelector("#breed-suggestions");
const imageType = document.querySelector("#imagetype-opt");
function allBreedsData(){
  fetch("https://api.thedogapi.com/v1/breeds",sethead)
  .then(response => response.json())
  .then((data)=>{
    length = data.length;
    for (let i = 0; i < length; i++) {
      allNamesofBreeds.push(data[i].name);
      allIdsofBreeds.push(data[i].id);
    }
    alldataOFbreeds = data;
    if(document.querySelector("#section") != null)
    addSuggetions();
    if(document.querySelector("#sectionBreeds") != null)
    allbreedCards();
  });
}
allBreedsData();
 if(document.querySelector("#section") != null){
  let limit = 20,typeOfimage = "",breedName = "",breedIndex="";
    //Functions
  function getimg(limit=20,type="",breedId="",clear=true) {
    fetch(`https://api.thedogapi.com/v1/images/search?limit=${limit}&mime_types=${type}&breed_ids=${breedId}`,sethead)
      .then(response=>response.json())
      .then((data)=>{
        if(clear){
          while(imageUrlarray.length > 0){
            imageUrlarray.shift();
          }
          while(imageNamearray.length > 0){
            imageNamearray.shift();
          }
        }
        if(imageUrlarray.length == 0 || clear==false){
        for(var i = 0;i < data.length;i++){
          imageUrlarray.push(data[i].url);
          try {
              imageNamearray.push(data[i].breeds[0].name);
          } catch (error) {
              imageNamearray.push("Name Not Found");
          }
        }
        addimages();
      }
      }).catch((err)=>{
        console.error(err);
      })
    }
    //DOM Change/DOM Manupulation
    function addimages(clear=true){
      const imageBox = document.querySelector("#imageBox");
      if (clear) {
        imageBox.innerHTML = "";
      }
      imageUrlarray.forEach((element)=>{
      const htmlData = `<div class="filter">
      <img class="grid-image" alt="Image Not Found" src="${element}">
      </div>`;
      imageBox.insertAdjacentHTML("beforeend",htmlData);
      });
      checkContent();
      let htmlElemenets = document.querySelectorAll(".filter");
      var i = 0;
      htmlElemenets.forEach((element)=>{
        element.setAttribute("data-name",imageNamearray[i]);
        i++;
      });
    }
    function addSuggetions(){
      allNamesofBreeds.forEach((element)=>{
        let li = document.createElement("li");
        li.classList.add("li")
        li.innerText=element;
        ul.appendChild(li);
      });
    }
    //Event Listners or Function calls
    getimg();
    if(imageType != null){
      imageType.addEventListener("change",()=>{
        typeOfimage = imageType.value;
        console.log(typeOfimage);
        if(breedName != ""){
          getimg(limit,typeOfimage,breedIndex);
        }
        else{
         getimg(20,typeOfimage,breedIndex);
        }
      })
    }
    window.addEventListener("mousedown",(event)=>{
      if(event.target.classList.contains("search-breedimage")){
        ul.classList.add("show-sugg"); 
      }
      else{
        ul.classList.remove("show-sugg");
      }
      const cond1 = event.target.parentNode.classList.contains("suggestions");
      const cond2 = event.target.classList.contains("li");
      if(cond1 && cond2){
       breedName = event.target.innerText;
       searchInput.value = breedName;
       allNamesofBreeds.forEach((element,index)=>{
        if(element == breedName){
          getimg(limit,typeOfimage,allIdsofBreeds[index]);
          breedIndex = allIdsofBreeds[index];
         }
       });
      }
    });
    //Infinte Scroll Effect
    let interval = 0;
    const section = document.querySelector("#section");
    section.addEventListener("scroll",(e)=>{
      const {scrollHeight,scrollTop,clientHeight} = e.target;
      ul.classList.remove("show-sugg");
        // console.log(scrollHeight+" "+scrollTop+" "+clientHeight);
        if(clientHeight+scrollTop + 500 >= scrollHeight){
          limit = 30;
         while(interval<5){
          if(imageUrlarray.length != 1){
            if(breedName != ""){
              getimg(limit,typeOfimage,breedIndex,false);
             }
             else{
              getimg(limit,typeOfimage,breedIndex,false);
             }
            interval++;
           }
           if(clientHeight+scrollTop + 100 >= scrollHeight){
              addimages(false);
           }
          }
        }
    });
    // function checkForit(check=false){
    //     // console.log();
       
    // }
    // var checkAndfilterImg = setInterval(checkForit,100);
  searchInput.addEventListener("keyup",()=>{
    const search = searchInput.value;
        allNamesofBreeds.forEach((element,index)=>{
          element = element.toLowerCase();
          if(search.toLowerCase() == element){
              getimg(limit,typeOfimage,allIdsofBreeds[index]);
              breedIndex = allIdsofBreeds[index];
          }
        });
  });
  function checkContent() {
    let imageBox = document.querySelector("#imageBox");
    let len = imageUrlarray.length;
    // console.log();
    if(imageBox.childNodes.length == 0){
      const h2 = document.createElement("h2");
      h2.classList.add("Not-Found");
      h2.innerText = "No Images Found with this filters";
      imageBox.append(h2);
    } 
  }
}
if(document.querySelector("#sectionBreeds") != null){
  const inputName = document.querySelector(".search-breed");
  const ul = document.getElementById("suggestions-name");
  function allbreedCards(){
    const box = document.querySelector(".cards-container");
      
    alldataOFbreeds.forEach((element)=>{
      let origin = element.origin != undefined ? element.origin : "Not Found";
      const htmlcard = `<div class="card">
        <div class="img-cont">
        <img src="${element.image.url}" alt="Iamge Not Found" />
       </div>
       <div class="information">
       <h2>${element.name}</h2>
       <h4><span class="catg-name">Breed For:</span><span class="special">${element.bred_for}</span></h4>
       <p><span class="catg-name">Breed Group:</span><span>${element.breed_group}</span></p>
       <p><span class="catg-name">Origin:</span><span>${origin}</span></p>
       <p><span class="catg-name">Normal Height:</span><span>${element.height.metric}</span></p>
       <p><span class="catg-name">Normal Weight:</span><span>${element.weight.metric}</span></p>
       <p><span class="catg-name">Life Span:</span><span>${element.life_span}</span></p>
      <p>
      <span class="catg-name">Temperament:</span
      ><span class="special">${element.temperament}</span>
      </p>
      </div>
      </div>
      </div>`;
      box.insertAdjacentHTML("beforeend",htmlcard);
    });
    completed = true;
  }
  function allbreedCardsonFilter(){
    const box = document.querySelector(".cards-container");
      
    searchBreedData.forEach((element)=>{
        let origin = element.origin != undefined ? element.origin : "Not Found";
        const htmlcard = `<div class="card">
          <div class="img-cont">
          <img src="${element.image.url}" alt="Iamge Not Found" />
        </div>
        <div class="information">
        <h2>${element.name}</h2>
        <h4><span class="catg-name">Breed For:</span><span class="special">${element.bred_for}</span></h4>
        <p><span class="catg-name">Breed Group:</span><span>${element.breed_group}</span></p>
        <p><span class="catg-name">Origin:</span><span>${origin}</span></p>
        <p><span class="catg-name">Normal Height:</span><span>${element.height.metric}</span></p>
        <p><span class="catg-name">Normal Weight:</span><span>${element.weight.metric}</span></p>
        <p><span class="catg-name">Life Span:</span><span>${element.life_span}</span></p>
        <p>
        <span class="catg-name">Temperament:</span
        ><span class="special">${element.temperament}</span>
        </p>
        </div>
        </div>
        </div>`;
        box.insertAdjacentHTML("beforeend",htmlcard);
    });
  }
  inputName.addEventListener("input",()=>{
    while(searchBreed.length !== 0){
      searchBreed.shift();
       comp = true;
    }
    document.querySelector(".cards-container").innerHTML="";
    allNamesofBreeds.forEach((element)=>{
      let inp= inputName.value;
      let inplength = inp.length;
      let compareText = element.slice(0,inplength).toLowerCase(); 
        if(compareText == inp.toLowerCase()){
          searchBreed.push(element);
        }
      });
      while(searchBreedData.length !== 0){
        searchBreedData.shift();
      }
      alldataOFbreeds.forEach((element)=>{
         searchBreed.forEach((elem)=>{
           if(element.name == elem){
             searchBreedData.push(element);
           }
         }) 
      });
      document.querySelector(".cards-container").innerHTML="";
      allbreedCardsonFilter();
      if(searchBreed.length == 0, searchBreedData ==0){
        document.querySelector(".cards-container").innerHTML="<h1 style='color:black; margin-top:80px;'>No Such Breed Found</h1>";
      }
 });
}