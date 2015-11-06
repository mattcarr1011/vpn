$(document).ready(function(){
 getVPNStatus();
 getServers();
});


var SERVER="https://192.168.0.98/";

function getVPNStatus() {
  $.get("https://nordvpn.com/api/vpn/check/full", function( data ) {
    $("#vpn-status").html(data['status']);
    $("#vpn-ip").html(data['ip']);
    $("#vpn-country").html(data['country'] + "<span id='vpn-country-flag'></span>");
    getCountryFlag(data['code']);
  }, "json");
}

function getCountryFlag(countryCode) {
  var flagSrc = "http://www.geonames.org/flags/x/" + countryCode.toLowerCase() + ".gif"; 
  return "<span id=\"vpn-country-flag\"><img width='51' height='25' src=\"" + flagSrc + "\" alt=\"flag.gid\"> </span>";
}

function getOpenVpnStatus() {
  $.get("/openVpnStatus.php", function( data ) {
    
  }, "json");
  
}

function startVpnSession(configFile) {
  $.post();
}

function getServers() {
  $.get("https://nordvpn.com/api/server", function (data ) {
    var servers = "";
    for (var i = 0; i<data.length; i++) {
      servers += buildServer(data[i]);
    }
    $("#vpn-servers").html(servers);
  }, "json");
}

function buildServer(server) {
  var serverStr;
  serverStr ="<tr><td>" + server['name'] + getCountryFlag(server['flag']) + "</td>" ;
  serverStr += "<td>" + isTorrent(server['search_keywords']) + "</td>";
  serverStr += "<td>" + getProgressBar(server['load']) + "</td>";
  serverStr += "</tr>";
  return serverStr;
  
}
function getProgressBar(progInt) {
  var style="";
  if (progInt < 20) {
    style="progress-bar-success";
    
  }
  else if (progInt >= 20 && progInt <=40) {
    style="progress-bar-warning"; 
  }
  else {
    style="progress-bar-danger";
  }
  return "<div class='progress'><div class='progress-bar progress-bar-striped active " + style + "' style=\"width:'100px'\" role='progress-bar' aria-valuenow='" + progInt + "' aria-valuemin='0' aria-valuemax='100'></div></div>";
}
function isTorrent(keywords) {
  var found = false;
  
  for (var i=0; i<keywords.length; i++) {
    if (keywords[i].toLowerCase().indexOf("torrents") >= 0)
      return true;
  }
   
  return false;
