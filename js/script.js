$(document).ready(function() {
    var oddsArray = null;
    preLoadImages();
    $("#roll").click(function() {
        generateChampion(function(championArray) {
            refreshShop(championArray);
        });
    });
    $('#roll').trigger('click');
    function preLoadImages() {
        $.getJSON("../assets/tft-champion.json", function(data) {
            //todo replace with directory search
            var imageUrls = ['assets/hud-images/border_1.png','assets/hud-images/border_2.png', 'assets/hud-images/border_3.png', 'assets/hud-images/border_4.png', 'assets/hud-images/border_5.png'];

            $.each(data.data, function() {
                var championobj = $(this);
                var image = championobj[0]['image']['full'];
                var imagefile = "assets/tft-champion/"+image
                imageUrls.push(imagefile);
            });
            $.each(imageUrls, function(index, url) {
                $('<img/>')[0].src = url;
            });
        });
    }
    $(document).on('keydown', function(e) {
        if (e.key === "d") {
            $('#roll').click();
            var sound = new Audio('../assets/tft-rollsound.mp3');

        }
    });

    function getOddsArray(currentlevel, callback) {
        $.getJSON("../odds.json", function(data) {
            $.each(data.level_odds, function() {
                var levelobj = $(this);
                if (parseInt(levelobj[0]['level']) === parseInt(currentlevel)) {
                    oddsArray = levelobj[0]['odds'];
                    callback(oddsArray);
                }
            });
        });
    }
    function getChampionData(tierIndex, callback) {
        $.getJSON("../assets/tft-champion.json", function(data) {
            var champArray = [];
            $.each(data.data, function() {
                var championobj = $(this);

                if (parseInt(championobj[0]['tier']) === parseInt(tierIndex)) {
                    var championData = {
                        image: championobj[0]['image']['full'],
                        name: championobj[0]['name'],
                        traits: championobj[0]['traits']
                    };

                    champArray.push(championData);
                }
            });
            callback(champArray);
        });
    }

    function generateChampion(callback) {
        var currentlevel = $("#CurrentLevel").val();
        getOddsArray(currentlevel, function(oddsArray) {
            var cost1odds = oddsArray[0]['percent'];
            var cost2odds = oddsArray[1]['percent'];
            var cost3odds = oddsArray[2]['percent'];
            var cost4odds = oddsArray[3]['percent'];
            var cost5odds = oddsArray[4]['percent'];

            var championArray = [];
            for (var i = 0; i < 5; i++) {
                var random_num = Math.floor(Math.random() * 100);
                if (random_num < cost1odds ) {
                    var champion_tier = 1;
                } else if (random_num < cost1odds + cost2odds) {
                    var champion_tier = 2;
                } else if (random_num < cost1odds + cost2odds + cost3odds) {
                    var champion_tier = 3;
                } else if (random_num < cost1odds + cost2odds + cost3odds + cost4odds) {
                    var champion_tier = 4;
                } else if (random_num < cost1odds + cost2odds + cost3odds + cost4odds + cost5odds) {
                    var champion_tier = 5;
                }
                championArray.push(champion_tier);
            }
            callback(championArray);
        });
    }
    function onClickChampion(){
        console.log("click");
    }
    function refreshShop(championArray) {
        sound.play();
        var championPanel = $('.champion-panel');
        $.each(championArray, function(i, tierIndex) {
            getChampionData(tierIndex, function(champArray) {
                var number = Math.floor(Math.random() * champArray.length);
                var champTraits = '';
                $.each(champArray[number]['traits'], function(index, trait) {
                    champTraits += trait + '<br>';
                });
                championPanel.eq(i-1).html(
                    "<img id='champ-art' src='../assets/tft-champion/" + champArray[number]['image'] + "'/> " +
                    "<img id='champ-border' src='../assets/hud-images/border_" + tierIndex + ".png'/>" +
                    "<div id='champ-name'>" + champArray[number]['name'] + "</div>" +
                    "<img id='coin-img' src='../assets/hud-images/tft-coin.png'/>" +
                    "<div id='champion-cost'>" + tierIndex + "</div>" +
                    "<div id='champ-trait'>"+champTraits+"</div>");

            });
        });
    }
});
