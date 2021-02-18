window.addEventListener("load",init);

function init(){
 const sethead = {
  "x-api-key" : "f6df9d10-8218-4fe1-9a61-d977d13c99c6"
 }
 // https://api.thedogapi.com/v1/breeds
 // https://api.thedogapi.com/v1/breeds/search?q=searchName
 fetch("https://api.TheDogAPI.com/v1/images/search?breed_id=10",sethead)
 .then(response=>response.json())
 .then((data)=>{
  console.log(data);
 });
fetch("https://api.thedogapi.com/v1/images/search?mime_types=gif",sethead)
.then(response=>response.json())
.then((data)=>{
  console.log(data)
});
}