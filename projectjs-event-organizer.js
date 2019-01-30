let events = [];
let clients= [];
let idCounter=0;
let idClientCounter=0;

let creatingEventsIsEnable= true;
let creatingClientsIsEnable= true;

let createEvent= function(eventName, flag= false, creatDdate= false, price=0){
///Създаването на дата: 1 допълнителна част - 2 задача
  if (creatingEventsIsEnable !==true) {
    return ("Операцията не може да бъде извършена!");
  }
  if(eventName===undefined){
    return ("Липсва име на събитието!");
  }
  let id=idCounter++;

  let event = {
    id: id,
    eventName: eventName,
    flag: !!flag,
    toString: function(){
      let responsible= "Подходящо";
      if (!flag) {
        responsible="Неподходящо";
      }
      let result = id+ ": "+eventName+", "+ responsible+", "+price;
      if(this.isArchive){
        result += ", Рейтинг " + getRating(this.id); 
      }
      return result;
    },
    clients: [],
    ratings: [],
    ///Допълнителни задачи част 2 -----///Зад.1-2-3
   price: price,
   isArchive: false,
   sumPrice: 0
  };
  if (creatDdate) {
    event.creatDdate= new Date();
  }//проверка за датата
  if(price===undefined || price==0){
     event.eventName= "! "+event.eventName+" Събитието няма входна такса.";
   }
   if (price>0 ) {
     event.eventName= "$ "+event.eventName+" - входна такса: "+price+"лв.";
   }
  events.push(event);
  return event;
};
///
let getEventById= function(id){
  let index = events
    .map(function(event){
      return event.id
    })
    .indexOf(id);

    return events[index];

}
///
let getClientsById= function(id){
  let client= clients[id];
  if (client==undefined) {
    return ("Невалидно Id на клиент");
  }
  return client;
}
///
let filterByGender= function(eventId, gender){
  let event = getEventById(eventId);
  if(!event){
    return ("Събитието не е открито!");
  }
  gender = gender.toLowerCase();
  if(gender !== 'm' && gender !== 'f'){
    return ("Невалиден пол.");
  }

  return event.clients.filter(client => client.gender === gender);
}
///
let addClientToEvent= function(eventId,clientId){
  let event= getEventById(eventId);
  if (event.isArchive) {///архивиране на събитието
    return ("Архивирано събитие. Не може да се добави клиент.");
  }
  let client = getClientsById(clientId);
  if (client.eventIds.indexOf(eventId)!==-1) {
    return("Клиента вече е добавен.");///дали вече е добавено събитието
  }
   if (client.years < 18 && event.flag ||client.years>=18){
     ///Допълнителни задачи част 2
     ///Зад.5
     if (client.eventIds.length===5) {
      event.clients.push(client);
      client.eventIds.push(eventId);///за ВИП клиенти
    }
    else if (client.wallet>=event.price) {
      client.wallet= client.wallet - event.price;
      event.clients.push(client);
      client.eventIds.push(eventId);
      event.sumPrice+= event.price;
    }
      else {
        return ("Клиента Няма достатъчно пари за събитието.");
      }
        return ("Клиента може да присъства на събитието.");
   }
   else{
     return ("Клиента НЕ може да присъства на събитието.");
   }
 };
 ///
 let createNewClient= function(firstName, lastName,gender, years, wallet=0 ){
   if (creatingClientsIsEnable !==true) {
     return ("Операцията не може да бъде извършена!");
   }
   let clientId=idClientCounter++;
    let client={
      clientId: clientId,
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      years: years,
      wallet: wallet,
      eventIds: []
    };
    clients.push(client);
    return client;
 }
 ///
 let getAllClientsInEvent= function(filterByGender){
 let inEvent= getEventById();
};
 ///
 let deleteClientFromEvent= function(eventId,clientId){
    let event= getEventById(eventId);
    if (event!==undefined) {
      let clientIndex = event.clients.indexOf(clientId);
      if(clientIndex === -1) {
        return "Няма такъв клиент.";
      }
      event.clients.splice(clientIndex,1);
        return("Успешно изтрит клиент.");
    }
 };
///
let getAllEvents= function(allEvents=true, archiveEvents=false){
  let eventStrings=[];
  for (var i = 0; i < events.length; i++) {
    let event = events[i];
    if (!allEvents) {
      if(event.isArchive !== archiveEvents){
        continue;
      }
    }
    eventStrings.push(event.toString());
  }
  return eventStrings;
};
////
let deleteEvent=function(id){
  if (getEventById(id)!==undefined) {
     events.splice(id, 1);
  }
  return("Успешно изтрит елемент.");
};
///
let updateEvent= function(id, eventName, flag=false){
  let eventIndex = events.map(e => e.id).indexOf(id);
  if (eventIndex !== -1) {
      return ("Не съществува такова събитие!");
  }
      if(eventName===undefined){
        return ("Липсва име на събитието!");
      }

      let event = {
        id,
        eventName,
        flag: !!flag,
        toString: function(){
          let years= "Подходящо";
          if (!flag) {
            years="Неподходящо";
          }
          return id+ ": "+eventName+", "+ years;
        }
      };
    events[eventIndex]=event;
    return("Успешно актуализиран елемент")
  };

///Допълнителни задачи част 1
///Зад.1
let enableConfigEvents= function(){
creatingEventsIsEnable=true;
return ("Създаването на събитие е позволено");
};
let disableConfigEvents= function(){
  creatingEventsIsEnable=false;
  return ("Създаването на събитие НЕ е позволено");
};
let enableConfigConfigClients= function(){
creatingClientsIsEnable=true;
return ("Създаването на клиент е позволено");
};
let disableConfigConfigClients= function(){
creatingClientsIsEnable=false;
return ("Създаването на клиент НЕ е позволено");
};
///Зад.3
let eventWithMaxClients= function(){
  let maxClients=0;
  let sameCountClients=0;
  for (var i = 0; i < events.length; i++) {
    let clientsCount =events[i].clients.length;
    if (maxClients<clientsCount) {
      maxClients=clientsCount;
      sameCountClients=1;
    }
    else if (maxClients=== clientsCount) {
      if (clientsCount!==0) {
        sameCountClients++;
      }
    }
  }
  if (sameCountClients>1) {
    return "Няма с най-голяма брой клиенти."
  }
  for (var i = 0; i < events.length; i++) {
    clientsCount= events[i].clients.length;
    if (maxClients===clientsCount) {
      return events[i];
    }
  }
  return "Нещо се обърка";
};
///Зад.4
let printEventsForMinors= function(){
  return events.filter(function (event) {
    return event.flag === true;
  });
};
///Зад.5
let groupOfEvents = function () {
  let result = [];
  for(let event of events){
    let eventString = "*";
    if(event.flag === true){
      eventString = "#";
    }
    result.push(eventString + ' ' + event.toString());
  }
  return result.join("\n");
};
///Зад.6
let eventFilter= function(criteria){
  let result = [];
  if (typeof criteria ==="function") {
    for(let event of events){
      if(criteria(event)){
        result.push(event);
      }
    }
    return result;
  }
  if (typeof criteria ==="boolean") {
    for(let event of events){
      if(event.flag === criteria){
        result.push(event);
      }
    }
    return result;
  }
  if (typeof criteria ==="string") {
    for(let event of events){
      if(event.eventName.includes  (criteria)){
        result.push(event);
      }
    }
    return result;
  }
};

///Допълнителни задачи част 3
///Зад.1-2
let archiveEvent= function(eventId){
  let event = getEventById(eventId);
  event.isArchive= true;
  event.eventName="~ "+event.eventName;
  return ("Архивирахте успешно събитието.");
};
///Зад.4
let returnEvenetMoney = function (eventId){
  let event = getEventById(eventId);
  if(event === undefined){
    return "Не е намерено събитие.";
  }
  if(!event.isArchive){
    return "Събитието не е архивирано.";
  }
  return event.sumPrice;
}

let addRating = function (eventId, clientId, rating) {
  let event = getEventById(eventId);
  if(event === undefined){
    return "Не е намерено събитие.";
  }
  let client = clients[clientId];
  if(client === undefined){
    return "Не е намерен клиент.";
  }
  if(event.clients.indexOf(clientId) !== -1){
    return "Клиента не участва в събитието.";
  }
  if(event.ratings.map(r => r.clientId).indexOf(clientId) !== -1){
    return "Клиента успешно оцени събитието.";
  }
  if(rating < 1 || rating > 10){
    return "Реитинга не е в норми.";
  }

  event.ratings.push({
    clientId,
    rating
  });

  return "Успешно оценяване.";
}

let getRating = function (eventId) {
  let event = getEventById(eventId);
  let ratingSum = 0;
  for(let rating of event.ratings.map(r => r.rating)) {
    ratingSum += rating;
  }
  return "Рейтинга на събитието е: "+ Math.floor(ratingSum / event.ratings.length * 0.6);
}


///Малки тестове по кода


///Създаване на събития
console.log(createEvent("Grand pening с Азис",true, true, 0));
console.log(createEvent("50/50-Анелия",false, true, 10));
console.log(createEvent("Скандау",true, true, 5));
console.log(createEvent("Ретро вечер с Емилия",true, true, 30));
///Създаване на нови клиенти
console.log(createNewClient("Иван","Г.","M",17,50));
console.log(createNewClient("Маги","С.","F",23,500));
console.log(createNewClient("Цвети","П.","F",20,5));
///Добавяне на клиенти към събитие
console.log(addClientToEvent(0,2));
console.log(addClientToEvent(0,2));
console.log(addClientToEvent(1,0));
console.log(addClientToEvent(2,1));
console.log(addClientToEvent(0,1));
console.log(addClientToEvent(3,2));
console.log(addClientToEvent(3,1));
console.log(addClientToEvent(3,2));
///Изтриване на клиент от събитие
console.log(deleteClientFromEvent(0,1));
///Показване на всички събития
console.log(getAllEvents());
///Изтриване на събитие
console.log(deleteEvent(2));
///Обновяване на събитие
console.log(updateEvent(3,"Ретро вечер с Галена", true));
///Спиране на създаване на събитие
console.log(disableConfigEvents());
console.log(createEvent("Ретро вечер с Азис",true, true, 40));
///Разрешаване на създаване на събитие
console.log(enableConfigEvents());
console.log(createEvent("50/50- Кали",true, true, 0));
///Спиране на създаване на клиент
console.log(disableConfigConfigClients());
console.log(createNewClient("Ани","П.","F",26,65));
///Разрешаване на създаване на клиент
console.log(enableConfigConfigClients());
console.log(createNewClient("Стоян","Ж.","M",30,200));
///Извеждане на евент с най-много клиенти
console.log(eventWithMaxClients());
///Извеждане на събитията за непълнолетни
console.log(printEventsForMinors());
///Групиране на събития за *непълнолетни и №пълнолетни
console.log(groupOfEvents());
///Филтриране на събития по определен критерии
console.log(eventFilter(function(e){
  return e.eventName.includes('Кали');
}));
console.log(eventFilter(true));
console.log(eventFilter("50"));
///Архивиране на събитие
console.log(archiveEvent(1));
///Проверка на приходите на събитие
console.log(returnEvenetMoney(3));
///Добавяне на рейтинг на дадено събитие
console.log(addRating(3,1,9));
///Показване на рейтинг на дадено събитие
console.log(getRating(3));