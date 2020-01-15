$(document).ready(function(e){

    /*
    * Today's date
    */
    var today = moment().format("M/D");
    
    onThisDay();
    wordOfTheDay();

    /*
    * On this Day in History
    * Finds a fun historical event from this day and populates a tile.
    */
    function onThisDay(){
        let url = "https://byabbe.se/on-this-day/";
        let date = moment().format("M/D");
        let query = url + date + "/events.json";

        $.ajax({
            url: query,
            method: "GET"
            }).then(function(data) {
                
                //holds index for api object
                let index = Math.floor(Math.random() * data.events.length);
                
                //add to html
                $(".onThisDayTitle").html(data.date + ", " + data.events[index].year);
                $(".onThisDaySubtitle").html(data.events[index].description);
                $("#wikipediaTitle").html(data.events[index].wikipedia[0].title);
                $(".onThisDayContent").html("<a href=\"" + data.events[index].wikipedia[0].wikipedia + "\" target=\"_blank\">Learn more</a>");
        });
    }

    /*
    * Determines random word of the day and outputs definition & part of speech (adj, noun, etc).
    */
    function wordOfTheDay(){
        let key = "?key=64670138-b960-4366-9959-b8fdc5ecef9e";
        let url = "https://dictionaryapi.com/api/v3/references/collegiate/json/";

        //get the saved randomIndex
        let randomIndex = localStorage.getItem("wordIndex");

        //if no date stored in local storage, or if it is a new day: set today in local storage & generate new random number and save to local storage
        if((localStorage.getItem("today") == null) || (localStorage.getItem("today") != today)){
            localStorage.setItem("today", today);
            randomIndex = Math.floor((Math.random() * dictionary.length) + 1);
            localStorage.setItem("wordIndex", randomIndex);
        }

        //if index is null, generate new random number and save to local storage
        if(randomIndex === null){
            randomIndex = Math.floor((Math.random() * dictionary.length) + 1);
            localStorage.setItem("wordIndex", randomIndex);
        }     

        //get word of day based on dictionary in wordOfDay.js
        let wordOfDay = dictionary[randomIndex];
        let query = url + wordOfDay + key;

        $.ajax({
            url: query,
            method: "GET"
            
            }).then(function(data){

                $(".word").html(wordOfDay);
            
                //3 definitions, saved class names for easier calling later
                let jQuery = [".wordOne", ".wordTwo", ".wordThree"];

                //get the first three definitions of a word, if less than three defs for a word: STOP!
                for (let i = 0; i < data.length && i < 3; i ++){
                    
                    let definition = data[i].shortdef;
                    let partOfSpeech = data[i].fl;

                    //update HTML with word, definition, & part of speech
                    $(jQuery[i]).append(partOfSpeech + "<ul class=\"wordul" + i + "\">");
                    for( let j = 0; j < definition.length; j++){
                        $(".wordul" + i).append("<li>" + definition[j] + "</li>");
                    }
                } 
            });
    } 
});