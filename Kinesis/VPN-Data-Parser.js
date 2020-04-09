/*
This project involved making a mini parser that takes in raw logs from a file and parses the data from it into a json format. The code has been modified for safety purposes.
*/

main = () => {
    const readline = require('readline'); // Creating a readline process
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Input RAW Data: ', (ans) => {
        rl.close();
        dealWithInput(ans); // parser function
    });
}

dealWithInput = (str) => {
    try {
        var jsonObj = new Object();
        jsonObj.timestamp = str.split(" ").slice(0,3).join(" ").trim();
        jsonObj.ip_string = str.split(" ").slice(3,4).join(" ").trim();
        jsonObj.process = str.split(" ").slice(4,5).join(" ").slice(0,-1).trim();
        var r = /(: )(.*)/;
        var payload = str.match(r)[2].trim();
        // If Charon set connecting_ip and connecting_user
        if (jsonObj.process == "MOCK_PROCESS_NAME") { // Mock process name for safety reasons
            if (!payload.includes("MOCK_NAME")) { //ignore Mock_name connections
                var ip_r = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;
                var ip_matches = payload.match(ip_r);
                jsonObj.connecting_ip = ip_matches[ip_matches.length - 1];
                if (!payload.includes("MOCK_WORD")) {
                    var user_r = /\[[^\]]*\]+/g;
                    var user_matches = payload.match(user_r);
                    jsonObj.connecting_user = user_matches[user_matches.length - 1].slice(1,-1);
                } else {
                    jsonObj.connecting_user = null;
                }
                
            }
        } else {
            jsonObj.connecting_ip = null;
            jsonObj.connecting_user = null;
        }
        jsonObj.payload = payload; // line

        // Make JSON Object
        var jsonString= JSON.stringify(jsonObj);
        console.log(jsonString);

    } catch (err) {
        console.log(`err: ${err}\n`);
    }
}

main();
