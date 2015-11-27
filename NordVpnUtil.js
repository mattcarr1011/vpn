$(document).ready(function(){
 getVPNStatus();
 getServers();
 
 $("#search_text").on('input', function () {
   filterServers($("#search_text").val());
 });
});


var SERVER="https://192.168.0.98/";
function filterServers(searchTxt) {
  //get all buttons
  //clear the list group
  //if the button's search mattches then showit
  var re = new RegExp(searchTxt, "i");
  $(".vpn_button").each(function(index) {
    if (re.test($(this).text())) {
		$(this).show();
    }
    else {
      $(this).hide();
    }
  });
  
}
function getVPNStatus() {
  $.get("https://nordvpn.com/api/vpn/check/full", function( data ) {
    if (data['status'] == "Unprotected") {
      $("#vpn-status").addClass("label-danger")
    }
    else {
      $("#vpn-status").addClass("label-success")
    }
    $("#vpn-status").html(data['status']);
    $("#vpn-ip").html(data['ip']);
    $("#vpn-country").html(data['country'] );
    $("#vpn-country-flag").html(getCountryFlag(data['code']));
  }, "json");
}

function getCountryFlag(countryCode) {
  var flagSrc = "http://geotree.geonames.org/img/flags18/" + countryCode.toUpperCase() + ".png"; 
  return "<img src=\"" + flagSrc + "\" alt=\"flag.png\">";
}

function getOpenVpnStatus() {
  $.get("/openVpnStatus.php", function( data ) {
    
  }, "json");
  
}

function startVpnSession(configFile) {
  $.post();
}

function getServers() {
  $.get("https://nordvpn.com/api/server", function ( data ) {
    var servers = "";
    data.sort(function(a, b) {
      var aNum = parseInt(a['name'].match("[0-9]+"));
      var bNum = parseInt(b['name'].match("[0-9]+"));
      
      if (a['country'] == b['country'] && aNum==bNum) {
        return 0;
      }
      if (a['country'] == b['country']) {
        if (aNum < bNum) {
        }
			return aNum < bNum ? -1 : 1;        
      }
      return a['country'] < b['country'] ? -1 : 1;
    });
    for (var i = 0; i<data.length; i++) {
      servers += buildServer(data[i]);
    }
    $("#vpn-servers").html(servers);
  }, "json");
}

function buildServer(server) {
  var serverStr;
  var listClass;
  if (server['load'] < 15) {
    listClass = "list-group-item-success";
  }
  else if (server['load']>=15 && server['load'] <=30) {
    listClass = "list-group-item-warning";
  }
  else {
    listClass = "list-group-item-danger";
  }
  serverStr = "<button type=\"button\" class=\"list-group-item vpn_button " + listClass + "\"> " + server['name'];
  serverStr += getSearchKeywords(server['search_keywords']);
  serverStr += "<span class=\"badge\">" + getCountryFlag(server['flag']) + "</span></button>";
  return serverStr;
  
}
function getSearchKeywords(search_keywords) {
  var keywordStr = "<span class='keywords hidden-xs hidden-sm'>";
  for (var i=0; i<search_keywords.length; i++) {
    keywordStr += "<span class='label label-info'>" + search_keywords[i] + "</span>";
  }
  keywordStr += "</span>";
  return keywordStr;
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
}