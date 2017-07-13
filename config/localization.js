module.exports = function (msgid, contryCode) {
    var locations = ["en", "pt"];
    var locationIndex = locations.indexOf(contryCode);
    var msgv = [];
    locationIndex = locationIndex > 0 ? locationIndex : 0;
    switch (msgid) {
        case 'Clan Type':
            msgv = [msgid, 'Tipo do clã'];
            return msgv[locationIndex] || msgid;
        case 'Clan Points':
            msgv = [msgid, 'Pontos do clã'];
            return msgv[locationIndex] || msgid;
        case 'Location':
            msgv = [msgid, 'Localização'];
            return msgv[locationIndex] || msgid;
        case 'War Frequency':
            msgv = [msgid, 'Frequência de guerra'];
            return msgv[locationIndex] || msgid;   
        case 'Clan Level':
            msgv = [msgid, 'Nível do clã'];
            return msgv[locationIndex] || msgid;   
        case 'War Wins':
            msgv = [msgid, 'Guerras vencidas'];
            return msgv[locationIndex] || msgid;     
        case 'War Wins Streak':
            msgv = [msgid, 'Guerras vencidas em sequência'];
            return msgv[locationIndex] || msgid;   
        case 'Required Trophies':
            msgv = [msgid, 'Trofeis necessários'];
            return msgv[locationIndex] || msgid;        
        case 'Members':
            msgv = [msgid, 'Membros'];
            return msgv[locationIndex] || msgid;                
        case 'Leader':
            msgv = [msgid, 'Líder'];
            return msgv[locationIndex] || msgid;          
        case 'Co-Leader':
            msgv = [msgid, 'Co-líder'];
            return msgv[locationIndex] || msgid;    
        case 'Elder':
            msgv = [msgid, 'Ancião'];
            return msgv[locationIndex] || msgid;    
        case 'Member':
            msgv = [msgid, 'Membro'];
            return msgv[locationIndex] || msgid;       
        case 'Results':
            msgv = [msgid, 'Resultados'];
            return msgv[locationIndex] || msgid;      
        case 'Search':
            msgv = [msgid, 'Procurar'];
            return msgv[locationIndex] || msgid;      
        case 'lessThanOncePerWeek':
            msgv = ["rarely", 'raramente'];
            return msgv[locationIndex] || msgid;         
        case 'moreThanOncePerWeek':
            msgv = ["often", 'frequentemente'];
            return msgv[locationIndex] || msgid;                                            
    }
    
    return msgid;
}