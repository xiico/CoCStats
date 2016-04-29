module.exports = function (msgid, contryCode) {
    var locations = ["en", "pt"];
    var locationIndex = locations.indexOf(contryCode);
    var msgv = [];
    locationIndex = locationIndex > 0 ? locationIndex : 0;
    switch (msgid) {
        case 'Clan Type':
            msgv = [msgid, 'Tipo do Clã'];
            return msgv[locationIndex] || msgid;
        case 'Clan Points':
            msgv = [msgid, 'Pontos do Clã'];
            return msgv[locationIndex] || msgid;
        case 'Location':
            msgv = [msgid, 'Localização'];
            return msgv[locationIndex] || msgid;
    }
    
    return msgid;
}