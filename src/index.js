import './scss/main.scss';
import './assets/fonts/linea-basic-10.eot';
import { cards, photos } from './api/data'

const cardsContainer = document.querySelector(".cards-container");

//form 
const cardForm = document.querySelector(".card-form__wrapper");
const closeBtn = document.querySelector(".card-form__close-btn");

let cardName = document.getElementById("card-name");
let cardSurname = document.getElementById("card-surname");
let cardPosition = document.getElementById("card-position");
let companyName = document.getElementById("company-name");
let suiteAddress = document.getElementById("suite-address");
let cardCity = document.getElementById("card-city");
let cardPhone = document.getElementById("card-phone");
let cardPhoneCode = document.getElementById("card-phone-code");

const formSubmitBtn = document.querySelector(".card-form__submit");

const googleMapKey = "AIzaSyCXfhB4UjwK3C6S9B4In3sJc6w7_lsdT68";
// https://maps.googleapis.com/maps/api/geocode/json?address=Kiev&key=AIzaSyCXfhB4UjwK3C6S9B4In3sJc6w7_lsdT68

const getRandomImg = () => {
    let imgIndex = Math.round(Math.random()* photos.length-1);
    if(imgIndex == -1) {
        imgIndex = 0
    }
    console.log(imgIndex)
    return  photos[imgIndex]
}

console.log(getRandomImg())
const currentCards = initiateData(cards);
function createCards () {
    currentCards.forEach(item => createCard(item));
    createAddSection();
}

function createAddSection() {
    const addCard = document.createElement("div");
    const addImg = document.createElement("img");
    addImg.classList.add("contact-card__add-img");
    addImg.src = "src/assets/icons/add_icon.png";
    addImg.addEventListener("click", showAddCardPage);
    addCard.classList.add("col-1-of-3");
    addCard.classList.add("card-add-col");
    addCard.appendChild(addImg);
    cardsContainer.appendChild(addCard)
}
const showAddCardPage =() => {
    cardForm.classList.add('show');
    cardName.focus();
 };
const createCard = (data) => {
    const cards = document.createElement("div");
    cards.classList.add("col-1-of-3");

    cards.innerHTML = `
    <article class="contact-card">
    <div class="contact-card__top">
        <div class="contact-card__left-part">
            <div class="contact-card__img-wrapper">
                <img class="contact-card__img" src="src/assets/img/${data.img}" alt="contact img">
            </div>
            <p class="contact-card__position">${data.position}</p>
        </div>
        <div class="contact-card__right-part">
            <div class="contact-card__text-wrapper">
                <h3 class="contact-card__name heading-2">${data.name}</h3>
                <div class="contact-card__geoposition-wrapper">
                    <a href='https://search.google.com/local/writereview?placeid=${data.placeId || ""}' class="geo-marker"></a>
                    <p class="contact-card__geoposition">${data.currentAddress || "Kharkiv"}</p><br />
                    <span> lat: ${data.geolocation.lat || "34.568"} </span>
                    <span> lat: ${data.geolocation.lng || "50.456"} </span>
                </div>
                <strong class="contact-card__company heading-3">${data.companyName}</strong>
                <address class="contact-card__suite-address heading-4">${data.suiteAddress}</address>
                <address class="contact-card__city heading-4">${data.city}</address>
                <div class="contact-card__phone-wrapper">
                    <a class="contact-card__phone heading-4" href="tel:+">
                        <abbr title="phone">P</abbr>
                        <span class="phone-code">"(${data.phoneCode})"</span>
                        <span class="phone-body">${data.phone}</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="contact-card__bottom">
        <div class="contact-card__manipulations">
            <span class="manipulations manipulations__edit" data-id=${data.id}></span>
            <span class="manipulations manipulations__delete" data-id=${data.id}></span>
        </div>
    </div>
</article>
    `
 cardsContainer.appendChild(cards)
 const deleteBtns = document.querySelectorAll(".manipulations__delete");
 const editBtns = document.querySelectorAll(".manipulations__edit");
 editCard(editBtns);
 deleteCard(deleteBtns);
}
createCards();

function initiateData(data=[]) {
    const cards = JSON.parse(localStorage.getItem('cards'));
    if(cards === null || cards.length < 1) {
        localStorage.setItem('cards', JSON.stringify(data));
        return data
    }else{
        return cards
    }
}

//crud

function addCard ()  {
    formSubmitBtn.removeEventListener("click", getUpdate)
    formSubmitBtn.addEventListener("click", async (e)=>  {
        e.preventDefault()
        console.log("add")
        const city = cardCity.value;
        if(city) {
            const {address: currentAddress, coordObj: geolocation, placeId } = await geLocation(city);
            const id = Math.floor(Math.random()*1000);
            const img =  getRandomImg();
            const newCard = prepareCardBeforeSaving(id, city, currentAddress, geolocation, placeId, img);
            console.log("new",newCard);
            const allCards = getCardsData();
            const newData = [...allCards, newCard];
            console.log(newData);
            setCardsData(newData);
        }

    })
}

addCard()
function cleanFields() {
     cardName.value="";
     cardSurname.value="";
    cardPosition.value="";
    companyName.value="";
    suiteAddress.value="";
    cardPhone.value="";
    cardPhoneCode.value="";
    cardCity.value="";
}
const prepareCardBeforeSaving =(iD, city, currentAddress, geolocation, placeId, img) => {
    const id = iD;
    const name = cardName.value;
    const surname = cardSurname.value;
    const position = cardPosition.value;
    const compName = companyName.value;
    const address = suiteAddress.value;
    const phone = Number(cardPhone.value);
    const phoneCode = Number(cardPhoneCode.value);

    const newCard = {
        id,
        name,
        surname,
        currentAddress,
        companyName: compName,
        suiteAddress: address,
        city,
        phone,
        placeId,
        phoneCode,
        img,
        position,
        geolocation,
    }
    return newCard;
}
const geLocation = async (city) => {
    if(city) {
        try {
            const result  = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${googleMapKey}`);
            const data = await result.json();
            const {results} = data;  

                const address = results[0].formatted_address || "Kharkiv";
                const coordObj = results[0].geometry.location; 
                const placeId =  results[0].place_id;
                return   {
                    address,
                    coordObj,
                    placeId
                }

        } catch (error) {
            console.log(error);
        }
    }


}
function deleteCard (data){
    data.forEach(function(item) {
        item.removeEventListener("click",deleteItem)
        item.addEventListener("click",deleteItem)
    })
}
function deleteItem(item) {
    const id = Number(item.target.dataset.id);
    const newData = currentCards.filter((item)=> item.id !== id);
    setCardsData(newData);
}
function editCard(data) {
    data.forEach((item, inx)=> {
        item.removeEventListener("click", editItem)
        item.addEventListener("click", editItem)
})
}
function editItem(item) {
    console.log("edit")
    const id = Number(item.target.dataset.id);
    const cardToEdit = currentCards.find(item => item.id === id);
     cardName.value = cardToEdit.name;  
     cardSurname.value =cardToEdit.surname;
     cardPosition.value =cardToEdit.position;
     companyName.value =cardToEdit.companyName;
     suiteAddress.value = cardToEdit.suiteAddress;
     cardCity.value =cardToEdit.city;
     cardPhone.value = cardToEdit.phone;
     cardPhoneCode.value =cardToEdit.phoneCode;

     showAddCardPage();
     let title = document.querySelector("body > div.card-form__wrapper.show > h1 > span.heading-secondary");
     title.innerHTML=`edit ${cardToEdit.name}'s contact card`
     formSubmitBtn.removeEventListener("click",  async (e)=>  {
        e.preventDefault()
        console.log("add")
        const city = cardCity.value;
        if(city) {
            const {address: currentAddress, coordObj: geolocation, placeId } = await geLocation(city);
            const id = Math.floor(Math.random()*1000);
            const img =  getRandomImg();
            const newCard = prepareCardBeforeSaving(id, city, currentAddress, geolocation, placeId, img);
            console.log("new",newCard);
            const allCards = getCardsData();
            const newData = [...allCards, newCard];
            console.log(newData);
            setCardsData(newData);
        }

    });
     formSubmitBtn.addEventListener("click", getUpdate.bind(this, cardToEdit))
}

async function getUpdate(cardToEdit) {
    const city = cardCity.value;
    if(cardToEdit.city != city) {
        const {address: currentAddress, coordObj: geolocation, placeId } = await geLocation(city);
        const newCard = prepareCardBeforeSaving(cardToEdit.id, city, currentAddress, geolocation, placeId, cardToEdit.img);
        setCardsData(getUpdatedCardsArr(newCard));
    }else{
        const newCard = prepareCardBeforeSaving(cardToEdit.id, cardToEdit.city, cardToEdit.currentAddress, cardToEdit.geolocation, cardToEdit.placeId, cardToEdit.img);
        setCardsData(getUpdatedCardsArr(newCard));
    }
}
const getUpdatedCardsArr = (data) => {
    const allCards = getCardsData();
    const inx = allCards.findIndex(item => item.id === data.id);
    const newData = [...allCards.slice(0, inx),
        data,
        ...allCards.slice(inx+1)
    ]
    return newData
}

function setCardsData(cards) {
    console.log(cards)
    localStorage.setItem('cards', JSON.stringify(cards));
    window.location.reload();
}
function getCardsData() {
    const cards = JSON.parse(localStorage.getItem('cards'));
    return cards === null ? [] : cards;
  }

 function closeForm() {
     closeBtn.addEventListener("click", ()=>{
        cleanFields();
        let title = document.querySelector("body > div.card-form__wrapper.show > h1 > span.heading-secondary");
        title.innerHTML="ADD NEW CONTACT CARD";
        cardForm.classList.remove("show");

     })
 } 
 closeForm();

  
  
