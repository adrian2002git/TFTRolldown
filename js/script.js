$(document).ready(function() {
    var oddsArray = null;

    $(document).on('keydown', function(e) {
        if (e.key === "d") {
            $('#roll').click();
        }
    });

    $("#roll").click(function() {
        generateChampion(function(championArray) {
            refreshShop(championArray);
        });
    });

    $('#roll').trigger('click');

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
        //console.log("this function");
        $.getJSON("../assets/tft-champion.json", function(data) {
            var champArray = [];
            $.each(data.data, function() {
                var championobj = $(this);
                if (parseInt(championobj[0]['tier']) === parseInt(tierIndex)) {
                    champArray.push(championobj[0]['image']['full']);
                    //champArray[1].push(championobj[0]['name']);
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
                console.log(random_num);
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
        var championPanel = $('.champion-panel');
        $.each(championArray, function(i, tierIndex) {
            getChampionData(tierIndex, function(champArray) {
                var number = Math.floor(Math.random() * champArray.length);
                championPanel.eq(i-1).html("<img id='champ-art' src='../assets/tft-champion/" + champArray[number] + "'/> " +
                    "<img id='champ-border' src='../assets/hud-img/border_" + tierIndex + ".png'/>");
            });
        });
    }


});
