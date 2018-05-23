$(document).ready(function () {

    if (navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv 11/))) {
        $("body").html("<h6>Deze site werkt niet in Internet Explorer (denk ik). Gebruik een browser zoals <a href='https://chrome.com/' target='_blank'>Chrome</a>, Firefox of Edge</h6>");
        return;
    }

    console.log("voel je welkom");

    

});