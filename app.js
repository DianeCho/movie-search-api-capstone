$(document).ready(function () {
    //step 1- get input from user
    $('.js-search-form').submit(function (event) {
        //if the page refreshes when you submit the form use 'preventDefault() to force Javascript to handle the form submit
        event.preventDefault();
        //get value from the input box
        var userInput = $('.js-query').val();
        //use that value to call the getResults function defined below
        getYoutubeResults(userInput);
        getWikiResults(userInput);
        getDiveResults(userInput);
    });

    //step 2 - using input from the user (query) make the API call to get the JSON response
    function getYoutubeResults(userSearchTerm) {
        $.getJSON("https://www.googleapis.com/youtube/v3/search", {
                part: "snippet", //Youtube API special parameter
                maxResults: 10, //number of results per page
                key: "AIzaSyBVRHSu3BHi9mMF9c2C_TC8SxT05U0KAJg",
                q: userSearchTerm, //shearch query from the user
                type: "video", //only return videos (no channels or playlists) so we can take the video ID and link it back to Youtube
                videoType: "movie",
            },

            function (receivedApiData) {
                //show json array received from the API call
                console.log(receivedApiData);
                //if no results show an error
                if (receivedApiData.pageInfo.totalResults == 0) {
                    alert("No videos found!");
                }
                //if there are results, call the displaySearchResults
                else {
                    displayYoutubeSearchResults(receivedApiData.items);
                }

            });
    }

    // STEP 3 - using the JSON response (videos), populate the relevant part of your HTML with the variable inside the JSON
    function displayYoutubeSearchResults(videosArray) {

        //create an empty variable to store one LI for each one the results
        var buildTheHtmlOutput = "";

        $.each(videosArray, function (videosArrayKey, videosArrayValue) {
            //create and populate one LI for each of the results ( "+=" means concatenate to the previous one)
            buildTheHtmlOutput += "<li>";
            buildTheHtmlOutput += "<p>" + videosArrayValue.snippet.title + "</p>"; //output vide title
            buildTheHtmlOutput += "<a href='https://www.youtube.com/watch?v=" + videosArrayValue.id.videoId + "' target='_blank'>"; //taget blank is going to open the video in a new window
            buildTheHtmlOutput += "<img src='" + videosArrayValue.snippet.thumbnails.high.url + "'/>"; //display video's thumbnail
            buildTheHtmlOutput += "</a>";
            buildTheHtmlOutput += "</li>";
        });

        //use the HTML output to show it in the index.html
        $(".js-youtube-search-results").html(buildTheHtmlOutput);
    }


    //step 2 - using input from the user (query) make the API call to get the JSON response
    function getWikiResults(userSearchTerm) {

        // encodeURIComponent() Function This function encodes special characters. In addition, it encodes the following characters: , / ? : @ & = + $ #
        // https://www.w3schools.com/jsref/jsref_encodeURIComponent.asp
        var result = $.ajax({
                url: "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages|extracts&generator=search&plimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrlimit=10&callback=?&gsrsearch=" + encodeURIComponent(userSearchTerm),
                type: "GET",
                dataType: 'jsonp'
            })
            /* if the call is successful (status 200 OK) show results */
            .done(function (result) {
                /* if the results are meeningful, we can just console.log them */
                console.log(result);
                displayWikiSearchResults(result);

            })

            /* if the call is NOT successful show errors */
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });


    }
    // STEP 3 - using the JSON response (videos), populate the relevant part of your HTML with the variable inside the JSON

    function displayWikiSearchResults(wikipediasArray) {
        console.log(wikipediasArray);
        var pages = wikipediasArray['query']['pages'];
        var pagesArr = Object.keys(pages);
        var buildTheHtmlOutput = "<h3 class='bold-word'>Wiki Trivia</h3>";
        for (var i = 0; i < pagesArr.length; i++) {
            if (i < 3) {
                buildTheHtmlOutput += '<div class="item">';
                buildTheHtmlOutput += '<a href="https://en.wikipedia.org/?curid=' + pagesArr[i] + '" target="_blank">';
                buildTheHtmlOutput += '<p>' + pages[pagesArr[i]].title + '<br />';
                buildTheHtmlOutput += pages[pagesArr[i]].extract + '</p>';
                buildTheHtmlOutput += '</a>';
                buildTheHtmlOutput += '</div>';
            }

        }
        $(".js-wiki-search-results").html(buildTheHtmlOutput);
    }


    //step 2 - using input from the user (query) make the API call to get the JSON response
    function getDiveResults(userSearchTerm) {

        var params = {
            type: 'movies',
            info: '1',
            k: '292564-DianeCho-26RP2OI4'

        };

        var result = $.ajax({
                /* update API end point */
                url: "https://tastedive.com/api/similar?q=" + userSearchTerm,
                data: params,
                dataType: "jsonp",
                /*set the call type GET / POST*/
                type: "GET"
            })

            /* if the call is successful (status 200 OK) show results */
            .done(function (result) {
                /* if the results are meeningful, we can just console.log them */
                console.log(result.Similar.Results);
                displayDiveSearchResults(result.Similar.Results);

            })

            /* if the call is NOT successful show errors */
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });



    }
    // STEP 3 - using the JSON response (videos), populate the relevant part of your HTML with the variable inside the JSON
    function displayDiveSearchResults(diveArrays) {

        //create an empty variable to store one LI for each one the results
        var buildTheHtmlOutput = "";

        $.each(diveArrays, function (diveArraysKey, diveArraysValue) {
            //create and populate one LI for each of the results ( "+=" means concatenate to the previous one)
            buildTheHtmlOutput += "<li>";
            buildTheHtmlOutput += "<p>" + diveArraysValue.Name + "</p>"; //output vide title
            buildTheHtmlOutput += "<p>" + diveArraysValue.wTeaser + "</p>"; //output vide title
            buildTheHtmlOutput += "<a href='" + diveArraysValue.yUrl + "' target='_blank'>";
            buildTheHtmlOutput += "Preview"; //display video's thumbnail
            buildTheHtmlOutput += "</a>";
            buildTheHtmlOutput += "<a href='" + diveArraysValue.wUrl + "' target='_blank'>";
            buildTheHtmlOutput += "WikiPage"; //display video's thumbnail
            buildTheHtmlOutput += "</a>";
            buildTheHtmlOutput += "</li>";
        });

        //use the HTML output to show it in the index.html
        $(".js-dive-search-results").html(buildTheHtmlOutput);
    }



});
