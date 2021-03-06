/*Copyright (c) 2015-2020, Riku Lahtinen
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
///
/// updateLocation(), row 17
/// loadLocation(), row 89
/// delLocTable(), row 109
/// delCelli(), row 151, deletes a single cell from cell list
/// delLocation(), row 168, deletes a location selected
/// populateView(), row 193
/// checkFences(), row 333
/// addTodayInfo(), row 408
/// addHistoryData(), row 479
/// editInfo(), row 517
/// deleteRecord(), 538
/// extendUpRecord(), 550
/// extendDownRecord(), 581


function updateLocation() {

    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
                function(tx) {
                    // Create the table, if not existing
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Locations(thelongi REAL, thelati REAL, theplace TEXT, tolerlong REAL, tolerlat REAL)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Cellinfo(theplace TEXT, thecelli INTEGER, sigstrength INTEGER, cellat REAL, cellong REAL, celltol REAL)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Priorities(theplace TEXT, gps INTEGER, cell INTEGER, wifi INTEGER, blut INTEGER, other INTEGER)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Wifiinfo(theplace TEXT, thewifi TEXT, sigstrength INTEGER, status TEXT, active INTEGER)');

                    // Updating the location name
                    //if (neimi.text != "") {
                    tx.executeSql('UPDATE Locations SET theplace=? WHERE theplace = ?', [neimi.text, (listix.get(currentIndex-1).pla)] );
                    //}
                    // Updating the location latitude
                    if (latti.text !== "") {
                        tx.executeSql('UPDATE Locations SET thelati=? WHERE theplace = ?', [latti.text, (listix.get(currentIndex-1).pla)]);
                    }
                    // Updating the location longitude
                    if (longi.text !== "") {
                        tx.executeSql('UPDATE Locations SET thelongi=? WHERE theplace = ?', [longi.text, (listix.get(currentIndex-1).pla)]);
                    }
                    // Updating the location tolerance
                    tx.executeSql('UPDATE Locations SET tolerlong=? WHERE theplace = ?', [saissi.text, (listix.get(currentIndex-1).pla)]);

                    // Updating the location fence thickness, later the parameter name should be changed
                    tx.executeSql('UPDATE Locations SET tolerlat=? WHERE theplace = ?', [fence.text, (listix.get(currentIndex-1).pla)]);

                    // Show all
                    var rs = tx.executeSql('SELECT * FROM Locations');
                    listix.set((currentIndex-1),{"pla": rs.rows.item(currentIndex-1).theplace});
                    listix.set((currentIndex-1),{"els": (rs.rows.item(currentIndex-1).thelati + ", "
                                                         + rs.rows.item(currentIndex-1).thelongi + ", " + rs.rows.item(currentIndex-1).tolerlong)});

                    // Updating the cell information
                    if (celli.text !== "") {
                        rs = tx.executeSql('SELECT * FROM Cellinfo WHERE theplace = ? AND thecelli = ?', [(listix.get(currentIndex-1).pla), celli.text]);

                        //tx.executeSql('UPDATE Cellinfo SET thecelli=? WHERE theplace = ?', [celli.text, (listix.get(currentIndex-1).pla)]);
                        if (rs.rows.length === 0) {
                            tx.executeSql('INSERT INTO Cellinfo VALUES(?, ?, ?, ?, ?, ?)', [(listix.get(currentIndex-1).pla), celli.text, '1', '1.0', '1.0', '1.0']);
                        }
                    }

                    rs = tx.executeSql('SELECT * FROM Cellinfo WHERE theplace = ?',(listix.get(currentIndex-1).pla));
                    for(var i = 0; i < rs.rows.length; i++) {
                        listix.set((currentIndex-1),{"cels":", " + rs.rows.item(i).thecelli})
                    }
                    tx.executeSql('UPDATE Priorities SET cell=? WHERE theplace = ?', [sellPri.checked, (listix.get(currentIndex-1).pla)]);

                    rs = tx.executeSql('SELECT * FROM Wifiinfo WHERE theplace = ?', [listix.get(currentIndex-1).pla]);
                    if (wifi.text !== "" || rs.rows.length > 0) {
                        if (rs.rows.length === 0){
                            tx.executeSql('INSERT INTO Wifiinfo VALUES(?, ?, ?, ?, ?)', [listix.get(currentIndex-1).pla, wifi.text,strength_row.text_high*100 + strength_row.text_low, 'idle', wifiAct.checked]);
                        }
                        else {
                            tx.executeSql('UPDATE Wifiinfo SET thewifi=?, sigstrength = ?, active = ? WHERE theplace = ?', [wifi.text, strength_row.text_high*100 +strength_row.text_low, wifiAct.checked, (listix.get(currentIndex-1).pla)]);
                        }
                    }
                    else {
                        //tx.executeSql('INSERT INTO Wifiinfo VALUES(?, ?, ?, ?, ?)', [listix.get(currentIndex-1).pla, wifi.text, '50', 'idle', '0']);

                    }

                    // This section removes old orphan data due to problems in locations deletion prior the version 0.1.8
                    tx.executeSql('DELETE FROM Priorities WHERE theplace NOT IN (SELECT Locations.theplace FROM Locations)');
                    tx.executeSql('DELETE FROM Cellinfo WHERE theplace NOT IN (SELECT Locations.theplace FROM Locations)');
                    tx.executeSql('DELETE FROM Wifiinfo WHERE theplace NOT IN (SELECT Locations.theplace FROM Locations)');

                    // Show all
                    rs = tx.executeSql('SELECT * FROM Locations');

                    listix.set((currentIndex-1),{"pla": rs.rows.item(currentIndex-1).theplace});
                    listix.set((currentIndex-1),{"els": (rs.rows.item(currentIndex-1).thelati + ", "
                                                         + rs.rows.item(currentIndex-1).thelongi + ", " + rs.rows.item(currentIndex-1).tolerlong)});

                }
                )
    populateView()

}

function loadLocation() {

    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
                function(tx) {
                    // Create the table, if not existing
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Locations(thelongi REAL, thelati REAL, theplace TEXT, tolerlong REAL, tolerlat REAL)');

                    // Show all
                    var rs = tx.executeSql('SELECT * FROM Locations');
                    listSize = rs.rows.length;
                    listix.clear();
                    for(var i = 0; i < rs.rows.length; i++) {
                        listix.set(i,{"pla": rs.rows.item(i).theplace});
                    }
                }
                )
}

function delLocTable() { // DROP TABLE does not work yet. Table locking should be solved! Stop Timers??

    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
                function(tx) {
                    switch (deletions.choice) {
                    case "all":
                        //tx.executeSql('DROP TABLE Locations');
                        tx.executeSql('DELETE FROM Locations');
                        tx.executeSql('DELETE FROM Cellinfo');
                        tx.executeSql('DELETE FROM Wifiinfo');
                        tx.executeSql('DELETE FROM Priorities');
                        //tx.executeSql('DROP TABLE Today');
                        tx.executeSql('DELETE FROM Today');
                        //tx.executeSql('DROP TABLE History');
                        deletions.choice = "none";
                        break;
                    case "times":
                        //tx.executeSql('DROP TABLE Today');
                        tx.executeSql('DELETE FROM Today');
                        deletions.choice = "none";
                        break;
                    case "locations":
                        //tx.executeSql('DROP TABLE Locations');
                        tx.executeSql('DELETE FROM Locations');
                        tx.executeSql('DELETE FROM Cellinfo');
                        tx.executeSql('DELETE FROM Wifiinfo');
                        tx.executeSql('DELETE FROM Priorities');
                        deletions.choice = "none";
                        break;
                    case "cells":
                        //tx.executeSql('DROP TABLE Cellinfo');
                        tx.executeSql('DELETE FROM Cellinfo');
                        deletions.choice = "none";
                        break;
                    case "wifi":
                        //tx.executeSql('DROP TABLE Wifiinfo');
                        tx.executeSql('DELETE FROM Wifiinfo');
                        deletions.choice = "none";
                        break;
                    default:
                        deletions.choice = "none";
                    }
                }
                )
}

function delCelli() { // Deleting single cell from the list

    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
                function(tx) {
                    // Create the table, if not existing
                    //tx.executeSql('CREATE TABLE IF NOT EXISTS Locations(thelongi REAL, thelati REAL, theplace TEXT, tolerlong REAL, tolerlat REAL)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Cellinfo(theplace TEXT, thecelli INTEGER, sigstrength INTEGER, cellat REAL, cellong REAL, celltol REAL)');
                    // Deleting the cell
                    tx.executeSql('DELETE FROM Cellinfo WHERE theplace = ? and thecelli = ?', [(listix.get(currentIndex-1).pla),cellistit.get(tempor.ind).cels]);
                    // Refreshing the view
                    populateView()
                }
                )
}

function delLocation() { //

    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
                function(tx) {
                    // Create the table, if not existing
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Locations(thelongi REAL, thelati REAL, theplace TEXT, tolerlong REAL, tolerlat REAL)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Cellinfo(theplace TEXT, thecelli INTEGER, sigstrength INTEGER, cellat REAL, cellong REAL, celltol REAL)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Wifiinfo(theplace TEXT, thewifi TEXT, sigstrength INTEGER, status TEXT, active INTEGER)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Priorities(theplace TEXT, gps INTEGER, cell INTEGER, wifi INTEGER, blut INTEGER, other INTEGER)');

                    tx.executeSql('DELETE FROM Priorities WHERE theplace = ?', (listix.get(currentIndex-1).pla));
                    tx.executeSql('DELETE FROM Cellinfo WHERE theplace = ?', (listix.get(currentIndex-1).pla));
                    tx.executeSql('DELETE FROM Wifiinfo WHERE theplace = ?', (listix.get(currentIndex-1).pla));
                    tx.executeSql('DELETE FROM Locations WHERE theplace = ?', (listix.get(currentIndex-1).pla));

                    var rs = tx.executeSql('SELECT * FROM Locations');
                    listSize = rs.rows.length;
                    currentIndex--;
                    //updateL = true;
                    //seloTim.start()
                    loadLocation();

                    // This section removes old orphan data due to problems in locations deletion prior the version 0.1.8
                    tx.executeSql('DELETE FROM Priorities WHERE theplace NOT IN (SELECT Locations.theplace FROM Locations)');
                    tx.executeSql('DELETE FROM Cellinfo WHERE theplace NOT IN (SELECT Locations.theplace FROM Locations)');
                    tx.executeSql('DELETE FROM Wifiinfo WHERE theplace NOT IN (SELECT Locations.theplace FROM Locations)');
                }
                )
}

function populateView() {  // Loads existing info to Loc.qml page

    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
                function(tx) {
                    // Create the table, if not existing
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Locations(thelongi REAL, thelati REAL, theplace TEXT, tolerlong REAL, tolerlat REAL)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Cellinfo(theplace TEXT, thecelli INTEGER, sigstrength INTEGER, cellat REAL, cellong REAL, celltol REAL)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Priorities(theplace TEXT, gps INTEGER, cell INTEGER, wifi INTEGER, blut INTEGER, other INTEGER)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Wifiinfo(theplace TEXT, thewifi TEXT, sigstrength INTEGER, status TEXT, active INTEGER)');

                    // Show all from Locations
                    var rs = tx.executeSql('SELECT * FROM Locations');

                    // Adding location if location empty
                    if (rs.rows.length < listSize) {
                        tx.executeSql('INSERT INTO Locations VALUES(?, ?, ?, ?, ?)', ['24.37', '61.64', 'Orivesi' + currentIndex, '50.0', '50.0']);
                        rs = tx.executeSql('SELECT * FROM Locations');
                        listix.append({"pla": "new", "els":"new"})
                        neimi.text = rs.rows.item(currentIndex-1).theplace;
                        saissi.text = rs.rows.item(currentIndex-1).tolerlong;
                        fence.text = rs.rows.item(currentIndex-1).tolerlat;
                    }
                    else {
                        neimi.text = rs.rows.item(currentIndex-1).theplace;
                        saissi.text = rs.rows.item(currentIndex-1).tolerlong;
                        fence.text = rs.rows.item(currentIndex-1).tolerlat;
                    }

                    // Filling listix
                    for(var i = 0; i < rs.rows.length; i++) {
                        listix.set(i,{"pla": rs.rows.item(i).theplace});
                        listix.set(i,{"els": (rs.rows.item(i).thelati + ", "
                                              + rs.rows.item(i).thelongi + ", " + rs.rows.item(i).tolerlong)});
                    }

                    // Cell info
                    rs = tx.executeSql('SELECT * FROM Cellinfo WHERE theplace = ?', neimi.text);
                    tempor.backHeight = rs.rows.length*72
                    cellistit.clear()
                    tempor.sellotext = ""

                    for(i = 0; i < rs.rows.length; i++) {
                        tempor.sellotext = tempor.sellotext + ", " + rs.rows.item(i).thecelli;
                        cellistit.set(i,{"cels": rs.rows.item(i).thecelli});
                    }
                    listix.set((currentIndex-1),{"cels": tempor.sellotext});
                    celltitle.text = tempor.selltitleBase + listix.get(currentIndex-1).cels

                    //Priorities

                    rs = tx.executeSql('SELECT * FROM Priorities WHERE theplace = ?', neimi.text);

                    if (rs.rows.length === 0) {
                        sellPri.checked = false
                        tx.executeSql('INSERT INTO Priorities VALUES(?, ?, ?, ?, ?, ?)', [(listix.get(currentIndex-1).pla), '1', '0', '0', '0', '0']);
                    }
                    else {
                        //sellPri.checked = true
                        rs = tx.executeSql('SELECT * FROM Priorities WHERE theplace = ?', neimi.text);
                        sellPri.checked = rs.rows.item(0).cell
                    }

                    ///// Wifi section

                    rs = tx.executeSql('SELECT * FROM Wifiinfo WHERE theplace = ?', neimi.text);

                    if (rs.rows.length === 0) {

                        wifi.text = "";
                        currentWifi = "";
                        wifiAct.checked = false;
                    }
                    // Due to historical reasons if sigstrength is 50 it will be transferred to 50 low and 100 high
                    else if (rs.rows.item(0).sigstrength === 50){
                        wifi.text = rs.rows.item(0).thewifi
                        currentWifi = rs.rows.item(0).thewifi
                        wifi_low.text = 50
                        wifi_high.text = 100
                        wifiAct.checked = rs.rows.item(0).active
                    }

                    else {
                        wifi.text = rs.rows.item(0).thewifi
                        currentWifi = rs.rows.item(0).thewifi
                        wifiAct.checked = rs.rows.item(0).active
                        wifi_low.text = rs.rows.item(0).sigstrength %100
                        wifi_high.text = (rs.rows.item(0).sigstrength - rs.rows.item(0).sigstrength %100)/100
                    }

                    wifisAvailable.text = qsTr("Available wifis") + ":"
                    for (i=0; i<wifis.count; i++) {
                        var j = wifis.count-1
                        if (i === j) {
                            wifisAvailable.text += "\n" + wifis.get(i).name+ ", " + wifis.get(i).strength;
                        }
                        else {
                            wifisAvailable.text += "\n" + wifis.get(i).name+ ", " + wifis.get(i).strength;
                        }
                    }


                }
                )

}

function checkFences() {

    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
                function(tx) {
                    // Creating the tables, if not existing
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Locations(thelongi REAL, thelati REAL, theplace TEXT, tolerlong REAL, tolerlat REAL)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Cellinfo(theplace TEXT, thecelli INTEGER, sigstrength INTEGER, cellat REAL, cellong REAL, celltol REAL)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Today(theday TEXT, thestatus TEXT, starttime TEXT, endtime TEXT, subtotal TEXT)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Priorities(theplace TEXT, gps INTEGER, cell INTEGER, wifi INTEGER, blut INTEGER, other INTEGER)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Wifiinfo(theplace TEXT, thewifi TEXT, sigstrength INTEGER, status TEXT, active INTEGER)');

                    // Show all locations
                    var rs = tx.executeSql('SELECT * FROM Locations ORDER BY tolerlong DESC');
                    // Spherical distance
                    var dfii; // Latitude difference
                    var meanfii; // Latitude difference mean
                    var dlamda; // Longitude difference
                    var ddist; // Distance in meters

                    // Filling movetext
                    varus.inFence = "Not in a paddock"; // Same than varus.inFenceT but without translation
                    varus.inFenceT = qsTr("Free galloping");
                    covLoc = varus.inFenceT;
                    newStatus = 0;

                    var closDist = 20000000.0 //to tell the closest dist to any location
                    var nextClosDist = 0.0 // to estimate if next closDist is in location
                    var biggestTolerance = rs.rows.item(0).tolerlong
                    // Check gps reliability
                    var coord = possut.position.coordinate
                    if (coord.latitude === prevLatitude) {
                        latitudeStagnationInd++;
                    }
                    else {
                        latitudeStagnationInd = 0;
                    }
                    prevLatitude = coord.latitude;

                    // If gpsTrue and gps operable, testing, if in area
                    var tolerat = 40000000.0; // Ordering by this the tighter tolerance to be selected when two possible locations
                    if (gpsTrue && latitudeStagnationInd < 15) {
                        if (possut.position.horizontalAccuracyValid) {
                            var htol = possut.position.horizontalAccuracy
                            //console.log(possut.position.horizontalAccuracy, possut.position.horizontalAccuracyValid)
                        }
                        /// Kalman section
                        /*kalman.z_k_lat = coord.latitude
                        kalman.k_k_lat = kalman.p_k_lat / (kalman.p_k_lat + kalman.r_lat);
                        //console.log(kalman.k_k_lat);
                        kalman.x_k_lat = kalman.x_k_lat + kalman.k_k_lat * (kalman.z_k_lat - kalman.x_k_lat);
                        kalman.p_k_lat = (1.0 - kalman.k_k_lat)*kalman.p_k_lat;
                        console.log(kalman.z_k_lat, kalman.x_k_lat) */
                        /// End Kalman section
                        for(var i = 0; i < rs.rows.length; i++) {
                            dfii = Math.abs(coord.latitude - rs.rows.item(i).thelati)*Math.PI/180;
                            meanfii = (coord.latitude + rs.rows.item(i).thelati)*Math.PI/360
                            dlamda = Math.abs(coord.longitude - rs.rows.item(i).thelongi)*Math.PI/180;
                            ddist = 6371009*Math.sqrt(Math.pow(dfii,2)+Math.pow(Math.cos(meanfii)*dlamda,2));
                            if (ddist < closDist) {closDist = ddist}
                            if ((ddist < rs.rows.item(i).tolerlong)
                                    && (rs.rows.item(i).tolerlong < tolerat)) {
                                varus.inFenceT = rs.rows.item(i).theplace;
                                varus.inFence = rs.rows.item(i).theplace;
                                covLoc = varus.inFenceT;
                                tolerat = rs.rows.item(i).tolerlong;
                                newStatus = 2
                                extraMsg = qsTr("GPS is used")
                                if ((htol+ddist) < tolerat) {
                                    if (ratePass < 55001) {ratePass = ratePass + 5000}
                                    //console.log("Well in", ratePass)
                                }
                                else {
                                    ratePass = 10000
                                    //console.log("Zero wellin", ratePass)
                                }
                            }

                            else if ((ddist < (rs.rows.item(i).tolerlong + rs.rows.item(i).tolerlat))) {
                                if (prevStatus == 2 || prevStatus == 3 || prevStatus == 4 || prevStatus == 5){
                                    varus.inFenceT = rs.rows.item(i).theplace;
                                    varus.inFence = rs.rows.item(i).theplace;
                                    covLoc = varus.inFenceT;
                                    //tolerat = rs.rows.item(i).tolerlong;
                                    newStatus=5
                                    extraMsg = qsTr("Leaving the paddock")
                                }
                                else {
                                    newStatus=1
                                    extraMsg = qsTr("Entering the paddock")
                                }
                                // 2 in GPS, 3 in Cellsupported gps, 4 wifi, 5 leaving area, 6 pure cell
                            }
                        } //endfor
                    }

                    /// This clause tests if in wifi, not sure if the total logic works
                    // 1. List all available wifis
                    // 2. Select acceptable strengths
                    // 3. Select smallest location
                    if (varus.inFence == "Not in a paddock") {
                        // Loop through all available wifis
                        for (i=0; i<wifis.count; i++) {
                            //rs = tx.executeSql('SELECT * FROM Wifiinfo WHERE thewifi = ? AND active = ?', [wifis.get(i).name, wifis.get(i).actbool]);
                            // List all the wifis saved to the locations
                            // rs = tx.executeSql('SELECT * FROM Wifiinfo WHERE thewifi = ? AND ? > sigstrength%100', [wifis.get(i).name, wifis.get(i).strength]);
                            // Select smallest location for that wifi
                            var rz = tx.executeSql('SELECT Locations.theplace AS Theplace, tolerlong, Wifiinfo.active AS Active, Wifiinfo.sigstrength AS Strength FROM Locations INNER JOIN Wifiinfo ON Locations.theplace = Wifiinfo.theplace WHERE Wifiinfo.thewifi = ? ORDER BY Locations.tolerlong ASC LIMIT 1', [wifis.get(i).name]);

                            if (rz.rows.length >0 && rz.rows.item(0).Active === 0
                                    || rz.rows.length >0 && rz.rows.item(0).Active === wifis.get(i).actbool) {
                                if (rz.rows.item(0).tolerlong < tolerat && wifis.get(i).strength >= rz.rows.item(0).Strength%100 && wifis.get(i).strength <= (rz.rows.item(0).Strength - rz.rows.item(0).Strength%100)/100){
                                    varus.inFence = rz.rows.item(0).Theplace;
                                    varus.inFenceT = varus.inFence;
                                    covLoc = varus.inFenceT;
                                    tolerat = rz.rows.item(0).tolerlong;
                                    //console.log(rz.rows.length, wifis.get(i).name, wifis.get(i).strength, rz.rows.item(0).Theplace, tolerat)
                                    newStatus = 4;
                                    extraMsg = qsTr("No GPS, wifi info used instead")
                                }
                            }
                        }
                    }

                    // Maintaining location if in cell though not in gps range (e.g. in building)
                    if (varus.inFence == "Not in a paddock"
                            && (prevStatus == 2 || prevStatus == 3 || prevStatus == 4)
                            && newStatus != 5) {
                        //var rt = tx.executeSql('SELECT * FROM Today WHERE ROWID = last_insert_rowid()');
                        var rt = tx.executeSql('SELECT * FROM Today WHERE strftime(?,theday) = (SELECT MAX(strftime(?,theday))  FROM Today)', ['%s', '%s']);
                        if (rt.rows.length >0) {
                            rs = tx.executeSql('SELECT * FROM Cellinfo WHERE theplace = ? AND thecelli = ?', [rt.rows.item(0).thestatus, currentCell]);
                            if (rs.rows.length > 0) {
                                rs = tx.executeSql('SELECT * FROM Locations WHERE theplace = ?', rt.rows.item(0).thestatus);
                                varus.inFence = rs.rows.item(0).theplace;
                                varus.inFenceT = varus.inFence;
                                covLoc = varus.inFenceT;
                                tolerat = rs.rows.item(0).tolerlong;
                                newStatus = 3;
                                if(!gpsTrue) {
                                    extraMsg = qsTr("No GPS, cells info used instead")
                                }
                                else if (latitudeStagnationInd > 14) {
                                    extraMsg = qsTr("GPS is not reliable, cells info is used instead")
                                }
                            }
                        }
                    }

                    /// This clause sets the location with pure cell info
                    if (varus.inFence == "Not in a paddock") {
                        //First selecting locations from biggest to smallest
                        rs = tx.executeSql('SELECT * FROM Locations INNER JOIN Priorities ON Locations.theplace = Priorities.theplace INNER JOIN Cellinfo ON Priorities.theplace = Cellinfo.theplace WHERE Priorities.cell = ? AND Cellinfo.thecelli = ? ORDER BY tolerlong ASC LIMIT 1', ['1',currentCell]);
                        if (rs.rows.length > 0) {
                            varus.inFence = rs.rows.item(0).theplace;
                            varus.inFenceT = varus.inFence;
                            covLoc = varus.inFenceT;
                            tolerat = rs.rows.item(0).tolerlong;
                            newStatus = 6;
                            extraMsg = qsTr("Pure cell info in use")
                        }
                    }
                    ///// Simple speed estimator, later may be replaced by Kalman
                    if (gpsTrue) {
                        if (closDist === prevClosDist) {
                            //console.log("No speed change", closDist, prevClosDist, blackOut)
                            blackOut++
                        }
                        else {
                            //prevSpeed = closDist-prevClosDist
                            blackOut = 1
                        }
                        nextClosDist = closDist - blackOut*prevSpeed
                        //console.log(newStatus, prevStatus, prevClosDist, closDist, nextClosDist, biggestTolerance)
                        if (newStatus == 0 && prevStatus == 0 && nextClosDist > biggestTolerance) {inSleep = true} else {inSleep = false}
                        var date0 = new Date;
                        //console.log(date0, varus.inFenceT, coord.latitude, coord.longitude, closDist, newStatus, currentCell);
                        prevClosDist = closDist;
                    }
                    ////// End simple estimator
                }
                )
    //if (newStatus == 0) {extraMsg = ""};
    varus.timeSow()
    addTodayInfo()

}

// This function adds data to the main page
function addTodayInfo() {
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
                function(tx) {
                    // Create the database if it doesn't already exist
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Today(theday TEXT, thestatus TEXT, starttime TEXT, endtime TEXT, subtotal TEXT)');

                    // Testing, if the status is still same
                    // First selecting the most recent value saved to database, MAXROWID cannot be used anymore after manual events
                    var evid = tx.executeSql('SELECT * FROM Today WHERE date(theday) = date(?,?) ORDER BY theday DESC LIMIT 1', ['now', 'localtime'])
                    // Not recording until the data is valid, currently only time lag, in future much more better logic
                    if (saveLag >0) {
                        saveLag = saveLag -saveDecr
                        newStatus = 7
                        extraMsg = qsTr("Validating the location info")
                    }
                    else if (latitudeStagnationInd > 20 && newStatus != 3 && newStatus != 4 && newStatus != 6) {
                        newStatus = 8; // Status for nonreliable gps
                        if (gpsTrue){
                            extraMsg = qsTr("GPS is not working properly")
                        }
                        else {
                            extraMsg = qsTr("No GPS, cells nor wifi")
                        }
                    }

                    // Recording the first value of the day or if marker set recording that
                    else if (evid.rows.length === 0 || marker == true) {
                        if (varus.inFence == "Not in a paddock" && marker == true) {varus.inFence = qsTr("Manual marker")}
                        tx.executeSql('INSERT INTO Today VALUES(datetime(?,?), ?, time(?,?), time(?,?), time(?,?))', [ 'now', 'localtime', varus.inFence, 'now', 'localtime', 'now', 'localtime', 'now', 'localtime' ]);
                        marker = false
                        prevStatus = newStatus;
                        if (newStatus == 0) {extraMsg = ""};
                    }
                    // Updating existing record
                    else if (evid.rows.item(0).thestatus === varus.inFence){
                        // If leaving the location, not saving the info
                        if (newStatus == 5){
                            //if (varus.inFence == "Not in a paddock" && newStatus == 5 ){
                            prevStatus = newStatus}
                        // Updating the existing record
                        else {
                            var rs = tx.executeSql('SELECT strftime(?,?,?)-strftime(?,?) AS rest  FROM Today WHERE strftime(?,theday) = (SELECT MAX(strftime(?,theday))  FROM Today)',['%s', 'now', 'localtime', '%s', (evid.rows.item(0).theday), '%s', '%s'])
                            //var rs = tx.executeSql('SELECT strftime(?,?,?)-strftime(?,?) AS rest  FROM Today WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)',['%s', 'now', 'localtime', '%s', (evid.rows.item(0).theday)])
                            tx.executeSql('UPDATE Today SET endtime=time(?, ?) WHERE strftime(?,theday) = (SELECT MAX(strftime(?,theday))  FROM Today)', ['now', 'localtime', '%s', '%s']);
                            //tx.executeSql('UPDATE Today SET endtime=time(?, ?) WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)', ['now', 'localtime']);
                            tx.executeSql('UPDATE Today SET subtotal=? WHERE strftime(?,theday) = (SELECT MAX(strftime(?,theday))  FROM Today)', [rs.rows.item(0).rest, '%s', '%s']);
                            //tx.executeSql('UPDATE Today SET subtotal=? WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)', [rs.rows.item(0).rest]);
                            prevStatus = newStatus;
                            if (newStatus == 0) {extraMsg = ""};
                        }
                    }
                    // If ending here starting the new record
                    else {
                        tx.executeSql('INSERT INTO Today VALUES(datetime(?,?), ?, time(?,?), time(?,?), time(?,?))', [ 'now', 'localtime', varus.inFence, 'now', 'localtime', 'now', 'localtime', 'now', 'localtime' ]);
                        prevStatus = newStatus;
                        if (newStatus == 0) {extraMsg = ""};

                    }
                    // Show all values
                    if (evid.rows.length === 0) {
                        varus.timeInFence = 0
                    }
                    else if (newStatus == 5 || newStatus == 7 || newStatus == 8){
                        //rs = tx.executeSql('SELECT strftime(?,?,?)-strftime(?,?) AS rest  FROM Today WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)',['%s', 'now', 'localtime', '%s', (evid.rows.item(0).theday)])
                        rs = tx.executeSql('SELECT strftime(?,?,?)-strftime(?,?) AS rest  FROM Today WHERE strftime(?,theday) = (SELECT MAX(strftime(?,theday))  FROM Today)',['%s', 'now', 'localtime', '%s', (evid.rows.item(0).theday), '%s', '%s'])
                        varus.timeInFence = rs.rows.item(0).rest
                    }
                    else {
                        //rs = tx.executeSql('SELECT subtotal AS resto  FROM Today WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)')
                        rs = tx.executeSql('SELECT subtotal AS resto  FROM Today WHERE strftime(?,theday) = (SELECT MAX(strftime(?,theday))  FROM Today)', ['%s', '%s'])
                        varus.timeInFence = rs.rows.item(0).resto
                    }

                    rs = tx.executeSql('SELECT * FROM Today WHERE date(theday) = date(?,?) AND thestatus NOT IN (?) ORDER BY starttime, endtime ASC', ['now', 'localtime', 'Not in a paddock']);

                    var r = ""
                    for(var i = 0; i < rs.rows.length; i++) {
                        r += rs.rows.item(i).starttime + " - " + rs.rows.item(i).endtime + ", " + rs.rows.item(i).thestatus +"\n"
                    }
                    varus.whatToday = r

                }

                )
    addHistoryData()
}

function addHistoryData() {
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
                function(tx) {
                    // Create the database if it doesn't already exist
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Today(theday TEXT, thestatus TEXT, starttime TEXT, endtime TEXT, subtotal TEXT)');

                    // Show all values
                    var rs;
                    if (!varus.historyFilter){
                        rs = tx.executeSql('SELECT date(theday) AS deit, thestatus, SUM(subtotal) AS totle FROM Today WHERE thestatus NOT IN (?) GROUP BY deit, thestatus ORDER BY deit DESC', 'Not in a paddock');
                        history.text = qsTr("History")
                    }
                    else {
                        rs = tx.executeSql('SELECT date(theday) AS deit, thestatus, SUM(subtotal) AS totle FROM Today WHERE thestatus NOT IN (?) AND date(theday) >= date(?, ?, ?, ?) GROUP BY deit, thestatus ORDER BY deit DESC', ['Not in a paddock','now', 'localtime', 'weekday 0', '-6 days']);
                        history.text = qsTr("History, this week")
                    }

                    var r = ""
                    var rmos = 0;

                    for(var i = 0; i < rs.rows.length; i++) {

                        rmos = ((rs.rows.item(i).totle-rs.rows.item(i).totle%60)/60 - (rs.rows.item(i).totle-rs.rows.item(i).totle%3600)/60);

                        if (rmos < 10){
                            r += rs.rows.item(i).deit + ", " + rs.rows.item(i).thestatus + ", "
                                    + (rs.rows.item(i).totle-rs.rows.item(i).totle%3600)/3600 + ":" + "0"
                                    + ((rs.rows.item(i).totle-rs.rows.item(i).totle%60)/60 - (rs.rows.item(i).totle-rs.rows.item(i).totle%3600)/60)
                                    +"\n"}
                        else {
                            r += rs.rows.item(i).deit + ", " + rs.rows.item(i).thestatus + ", "
                                    + (rs.rows.item(i).totle-rs.rows.item(i).totle%3600)/3600 + ":"
                                    + ((rs.rows.item(i).totle-rs.rows.item(i).totle%60)/60 - (rs.rows.item(i).totle-rs.rows.item(i).totle%3600)/60)
                                    +"\n"}
                    }
                    varus.niceHistory = r
                }
                )
    status.text = varus.inFenceT + ": " + varus.timeInFenceS;
    todday.text = varus.whatToday;
    //histor.text = varus.niceHistory;

}

function editInfo() {
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
                function(tx) {
                    // Create the database if it doesn't already exist
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Today(theday TEXT, thestatus TEXT, starttime TEXT, endtime TEXT, subtotal TEXT)');
                    var rs = tx.executeSql('DELETE FROM Today WHERE thestatus = ?', ['Not in a paddock']);
                    rs = tx.executeSql('SELECT * FROM Today WHERE date(theday) = ? AND thestatus NOT IN (?) ORDER BY starttime, endtime ASC', [button.selectedDate, 'Not in a paddock']);
                    for(var i = 0; i < rs.rows.length; i++) {
                        dayValues.set((i),{"starttime": rs.rows.item(i).starttime});
                        dayValues.set((i),{"endtime": rs.rows.item(i).endtime});
                        dayValues.set((i),{"pla": rs.rows.item(i).thestatus});
                        dayValues.set((i),{"subtotal": rs.rows.item(i).subtotal});
                    }

                }

                )
}

function deleteRecord() {
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
                function(tx) {
                    // Create the database if it doesn't already exist
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Today(theday TEXT, thestatus TEXT, starttime TEXT, endtime TEXT, subtotal TEXT)');
                    tx.executeSql('DELETE FROM Today WHERE date(theday) = ? AND thestatus = ? AND starttime = ? AND endtime = ?', [button.selectedDate, (dayValues.get(dayValues.indexEdit).pla), (dayValues.get(dayValues.indexEdit).starttime), (dayValues.get(dayValues.indexEdit).endtime)]);
                }
                )
}

function extendUpRecord() {
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
                function(tx) {
                    // Create the database if it doesn't already exist
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Today(theday TEXT, thestatus TEXT, starttime TEXT, endtime TEXT, subtotal TEXT)');
                    var dfmt1 = new Date()
                    var dfmt2 = new Date()
                    if (dayValues.indexEdit == 0) {} //The first record cannot be extended up
                    // Join adjacent records of the same location
                    else if(dayValues.get(dayValues.indexEdit-1).pla == dayValues.get(dayValues.indexEdit).pla) {
                        dfmt1 = "2016-02-28T" + (dayValues.get(dayValues.indexEdit).endtime)
                        dfmt2 = "2016-02-28T" + (dayValues.get(dayValues.indexEdit-1).starttime)
                        var rs = tx.executeSql('SELECT strftime(?,?)-strftime(?,?) AS tulos', ['%s', dfmt1, '%s', dfmt2]);
                        tx.executeSql('UPDATE Today SET starttime=?, subtotal=? WHERE date(theday) = ? AND thestatus = ? AND starttime = ?', [(dayValues.get(dayValues.indexEdit-1).starttime), rs.rows.item(0).tulos, button.selectedDate, (dayValues.get(dayValues.indexEdit).pla), (dayValues.get(dayValues.indexEdit).starttime)] );
                        tx.executeSql('DELETE FROM Today WHERE date(theday) = ? AND thestatus = ? AND endtime = ?', [button.selectedDate, (dayValues.get(dayValues.indexEdit-1).pla), (dayValues.get(dayValues.indexEdit-1).endtime)]);
                    }
                    // Filling gap to adjacent record
                    else {
                        dfmt1 = "2016-02-28T" + (dayValues.get(dayValues.indexEdit).endtime)
                        dfmt2 = "2016-02-28T" + (dayValues.get(dayValues.indexEdit-1).endtime)
                        rs = tx.executeSql('SELECT strftime(?,?)-strftime(?,?) AS tulos', ['%s', dfmt1, '%s', dfmt2]);
                        tx.executeSql('UPDATE Today SET starttime=?, subtotal=? WHERE date(theday) = ? AND thestatus = ? AND starttime = ?', [dayValues.get(dayValues.indexEdit-1).endtime, rs.rows.item(0).tulos, button.selectedDate, (dayValues.get(dayValues.indexEdit).pla), (dayValues.get(dayValues.indexEdit).starttime)] );
                    }
                }
                )
}

function extendDownRecord() {
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
                function(tx) {
                    // Create the database if it doesn't already exist
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Today(theday TEXT, thestatus TEXT, starttime TEXT, endtime TEXT, subtotal TEXT)');
                    var dfmt1 = new Date()
                    var dfmt2 = new Date()
                    if (dayValues.indexEdit == dayValues.count-1) {console.log("laST LINE")} //The LAST record cannot be extended DOWN
                    // Join adjacent records of the same location
                    else if(dayValues.get(dayValues.indexEdit+1).pla == dayValues.get(dayValues.indexEdit).pla) {
                        dfmt1 = "2016-02-28T" + (dayValues.get(dayValues.indexEdit+1).endtime)
                        dfmt2 = "2016-02-28T" + (dayValues.get(dayValues.indexEdit).starttime)
                        var rs = tx.executeSql('SELECT strftime(?,?)-strftime(?,?) AS tulos', ['%s', dfmt1, '%s', dfmt2]);
                        tx.executeSql('UPDATE Today SET endtime=?, subtotal=? WHERE date(theday) = ? AND thestatus = ? AND starttime = ?', [(dayValues.get(dayValues.indexEdit+1).endtime), rs.rows.item(0).tulos, button.selectedDate, (dayValues.get(dayValues.indexEdit).pla), (dayValues.get(dayValues.indexEdit).starttime)] );
                        tx.executeSql('DELETE FROM Today WHERE date(theday) = ? AND thestatus = ? AND starttime = ?', [button.selectedDate, (dayValues.get(dayValues.indexEdit+1).pla), (dayValues.get(dayValues.indexEdit+1).starttime)]);
                    }
                    // Filling gap to adjacent record
                    else {
                        dfmt1 = "2016-02-28T" + (dayValues.get(dayValues.indexEdit+1).starttime)
                        dfmt2 = "2016-02-28T" + (dayValues.get(dayValues.indexEdit).starttime)
                        rs = tx.executeSql('SELECT strftime(?,?)-strftime(?,?) AS tulos', ['%s', dfmt1, '%s', dfmt2]);
                        tx.executeSql('UPDATE Today SET endtime=?, subtotal=? WHERE date(theday) = ? AND thestatus = ? AND starttime = ?', [dayValues.get(dayValues.indexEdit+1).starttime, rs.rows.item(0).tulos, button.selectedDate, (dayValues.get(dayValues.indexEdit).pla), (dayValues.get(dayValues.indexEdit).starttime)] );
                    }
                }
                )
}

function editInfo_n() {
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);
    var date_e= selectedDate_g.substring(0, 10)
    db.transaction(
                function(tx) {
                    // Create the database if it doesn't already exist
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Today(theday TEXT, thestatus TEXT, starttime TEXT, endtime TEXT, subtotal TEXT)');
                    var rs = tx.executeSql('DELETE FROM Today WHERE thestatus = ?', ['Not in a paddock']);
                    rs = tx.executeSql('SELECT * FROM Today WHERE date(theday) = ? AND thestatus NOT IN (?) ORDER BY starttime, endtime ASC', [date_e, 'Not in a paddock']);
                    dayValues_g.clear();
                    for(var i = 0; i < rs.rows.length; i++) {
                        dayValues_g.set((i),{"starttime": rs.rows.item(i).starttime});
                        dayValues_g.set((i),{"endtime": rs.rows.item(i).endtime});
                        dayValues_g.set((i),{"pla": rs.rows.item(i).thestatus});
                        dayValues_g.set((i),{"subtotal": rs.rows.item(i).subtotal});
                    }
                }
                )
}

function deleteRecord_n() {
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);
    var date_e= selectedDate_g.substring(0, 10)
    db.transaction(
                function(tx) {
                    // Create the database if it doesn't already exist
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Today(theday TEXT, thestatus TEXT, starttime TEXT, endtime TEXT, subtotal TEXT)');
                    tx.executeSql('DELETE FROM Today WHERE date(theday) = ? AND thestatus = ? AND starttime = ?', [date_e, (dayValues_g.get(dayValues_g.indexEdit).pla), (dayValues_g.get(dayValues_g.indexEdit).starttime)]);
                }
                )
}

function extendUpRecord_n() {
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);
    var date_e= selectedDate_g.substring(0, 10)
    db.transaction(
                function(tx) {
                    // Create the database if it doesn't already exist
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Today(theday TEXT, thestatus TEXT, starttime TEXT, endtime TEXT, subtotal TEXT)');
                    var dfmt1 = new Date()
                    var dfmt2 = new Date()
                    if (dayValues_g.indexEdit == 0) {} //The first record cannot be extended up
                    // Join adjacent records of the same location
                    else if(dayValues_g.get(dayValues_g.indexEdit-1).pla == dayValues_g.get(dayValues_g.indexEdit).pla) {
                        dfmt1 = "2016-02-28T" + (dayValues_g.get(dayValues_g.indexEdit).endtime)
                        dfmt2 = "2016-02-28T" + (dayValues_g.get(dayValues_g.indexEdit-1).starttime)
                        var rs = tx.executeSql('SELECT strftime(?,?)-strftime(?,?) AS tulos', ['%s', dfmt1, '%s', dfmt2]);
                        tx.executeSql('UPDATE Today SET starttime=?, subtotal=? WHERE date(theday) = ? AND thestatus = ? AND starttime = ?', [(dayValues_g.get(dayValues_g.indexEdit-1).starttime), rs.rows.item(0).tulos, date_e, (dayValues_g.get(dayValues_g.indexEdit).pla), (dayValues_g.get(dayValues_g.indexEdit).starttime)] );
                        tx.executeSql('DELETE FROM Today WHERE date(theday) = ? AND thestatus = ? AND endtime = ?', [date_e, (dayValues_g.get(dayValues_g.indexEdit-1).pla), (dayValues_g.get(dayValues_g.indexEdit-1).endtime)]);
                    }
                    // Filling gap to adjacent record
                    else {
                        dfmt1 = "2016-02-28T" + (dayValues_g.get(dayValues_g.indexEdit).endtime)
                        dfmt2 = "2016-02-28T" + (dayValues_g.get(dayValues_g.indexEdit-1).endtime)
                        rs = tx.executeSql('SELECT strftime(?,?)-strftime(?,?) AS tulos', ['%s', dfmt1, '%s', dfmt2]);
                        tx.executeSql('UPDATE Today SET starttime=?, subtotal=? WHERE date(theday) = ? AND thestatus = ? AND starttime = ?', [dayValues_g.get(dayValues_g.indexEdit-1).endtime, rs.rows.item(0).tulos, date_e, (dayValues_g.get(dayValues_g.indexEdit).pla), (dayValues_g.get(dayValues_g.indexEdit).starttime)] );
                    }
                }
                )
}

function extendDownRecord_n() {
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);
    var date_e= selectedDate_g.substring(0, 10)
    db.transaction(
                function(tx) {
                    // Create the database if it doesn't already exist
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Today(theday TEXT, thestatus TEXT, starttime TEXT, endtime TEXT, subtotal TEXT)');
                    var dfmt1 = new Date()
                    var dfmt2 = new Date()
                    if (dayValues_g.indexEdit == dayValues_g.count-1) {console.log("last LINE")} //The LAST record cannot be extended DOWN
                    // Join adjacent records of the same location
                    else if(dayValues_g.get(dayValues_g.indexEdit+1).pla == dayValues_g.get(dayValues_g.indexEdit).pla) {
                        dfmt1 = "2016-02-28T" + (dayValues_g.get(dayValues_g.indexEdit+1).endtime)
                        dfmt2 = "2016-02-28T" + (dayValues_g.get(dayValues_g.indexEdit).starttime)
                        var rs = tx.executeSql('SELECT strftime(?,?)-strftime(?,?) AS tulos', ['%s', dfmt1, '%s', dfmt2]);
                        tx.executeSql('UPDATE Today SET endtime=?, subtotal=? WHERE date(theday) = ? AND thestatus = ? AND starttime = ?', [(dayValues_g.get(dayValues_g.indexEdit+1).endtime), rs.rows.item(0).tulos, date_e, (dayValues_g.get(dayValues_g.indexEdit).pla), (dayValues_g.get(dayValues_g.indexEdit).starttime)] );
                        tx.executeSql('DELETE FROM Today WHERE date(theday) = ? AND thestatus = ? AND starttime = ?', [date_e, (dayValues_g.get(dayValues_g.indexEdit+1).pla), (dayValues_g.get(dayValues_g.indexEdit+1).starttime)]);
                    }
                    // Filling gap to adjacent record
                    else {
                        dfmt1 = "2016-02-28T" + (dayValues_g.get(dayValues_g.indexEdit+1).starttime)
                        dfmt2 = "2016-02-28T" + (dayValues_g.get(dayValues_g.indexEdit).starttime)
                        rs = tx.executeSql('SELECT strftime(?,?)-strftime(?,?) AS tulos', ['%s', dfmt1, '%s', dfmt2]);
                        tx.executeSql('UPDATE Today SET endtime=?, subtotal=? WHERE date(theday) = ? AND thestatus = ? AND starttime = ?', [dayValues_g.get(dayValues_g.indexEdit+1).starttime, rs.rows.item(0).tulos, date_e, (dayValues_g.get(dayValues_g.indexEdit).pla), (dayValues_g.get(dayValues_g.indexEdit).starttime)] );
                    }
                }
                )
}

/// Find data for the datepicker element. Search and return seconds of recorded data of the day
function findIfData(y,m,d) {
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);
    var time_e = 0
    var date_e = y + (m<10? '-0'+m: '-'+m)+(d<10? '-0'+d: '-'+d)
    db.transaction(
                function(tx) {
                    // Create the database if it doesn't already exist
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Today(theday TEXT, thestatus TEXT, starttime TEXT, endtime TEXT, subtotal TEXT)');
                    var rs = tx.executeSql('SELECT date(theday) AS deit, thestatus, SUM(subtotal) AS totle FROM Today WHERE deit = ? AND thestatus NOT IN (?) GROUP BY deit', [date_e,'Not in a paddock']);
                    if (rs.rows.length > 0)
                        time_e = rs.rows.item(0).totle
                    else
                        time_e = 0
                }
                )

    return time_e;
}

/// Find the day total values for a view
function dayTotals() {
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);
    var date_e= selectedDate_g.substring(0, 10)
    db.transaction(
                function(tx) {
                    // Create the database if it doesn't already exist
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Today(theday TEXT, thestatus TEXT, starttime TEXT, endtime TEXT, subtotal TEXT)');
                    var rs = tx.executeSql('SELECT date(theday) AS deit, thestatus, SUM(subtotal) AS totle FROM Today WHERE deit = ? AND thestatus NOT IN (?) GROUP BY deit', [date_e,'Not in a paddock']);
                    theDayTotal.clear();
                    for (var i=0;i<rs.rows.length;i++)   {
                        theDayTotal.append({"date":date_e, "total": rs.rows.item(i).totle});
                    }
                }
                )
}

/// Find the day subtotal values for a view
function daySubTot() {
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);
    var date_e= selectedDate_g.substring(0, 10)
    db.transaction(
                function(tx) {
                    // Create the database if it doesn't already exist
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Today(theday TEXT, thestatus TEXT, starttime TEXT, endtime TEXT, subtotal TEXT)');
                    var rs = tx.executeSql('SELECT date(theday) AS deit, thestatus, SUM(subtotal) AS totle FROM Today WHERE deit = ? AND thestatus NOT IN (?) GROUP BY deit, thestatus ORDER BY deit DESC', [date_e,'Not in a paddock']);
                    theSubTot.clear();
                    for (var i=0;i<rs.rows.length;i++)   {
                        theSubTot.append({"date":date_e, "categor":rs.rows.item(i).thestatus, "subtot": rs.rows.item(i).totle});
                    }
                }
                )
}

function addMarkerManually(_date, _time, _where) {
    var _timestr = _time + ":00"
    var _datestr = _date.substring(0,11)+_time+":00"

    //console.log("manualMarker", _date, _time, _datestr)
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
                function(tx) {
                    // Create the database if it doesn't already exist
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Today(theday TEXT, thestatus TEXT, starttime TEXT, endtime TEXT, subtotal TEXT)');
                    // First checking if the value to be set is in past
                    var rs = tx.executeSql('SELECT strftime(?,?,?)-strftime(?,?) AS past  FROM Today WHERE strftime(?,theday) = (SELECT MAX(strftime(?,theday))  FROM Today)',['%s', 'now', 'localtime', '%s', _datestr, '%s', '%s'])
                    // Then checking if value to be added is breaking the existing period
                    var ry = tx.executeSql('SELECT * FROM Today WHERE date(theday) = date(?) AND time(endtime) > time(?) AND time(starttime) < time(?)',[_date, _datestr, _datestr]);
                    if (ry.rows.length > 0) {
                        //console.log("Hard task to break", ry.rows.length, ry.rows.item(0).theday, ry.rows.item(0).starttime, ry.rows.item(0).endtime)
                        tx.executeSql('DELETE FROM Today WHERE date(theday) = date(?) AND time(endtime) > time(?) AND time(starttime) < time(?)',[_date, _datestr, _datestr]);
                        tx.executeSql('INSERT INTO Today VALUES(datetime(?), ?, time(?), time(?), strftime(?,?)-strftime(?,?))', [ ry.rows.item(0).theday, ry.rows.item(0).thestatus, ry.rows.item(0).starttime, _datestr, '%s', _timestr,'%s', ry.rows.item(0).starttime, ]);
                        if (_where !== ry.rows.item(0).thestatus) {
                            tx.executeSql('INSERT INTO Today VALUES(datetime(?), ?, time(?), time(?), ?)', [ _datestr, _where, _datestr, _datestr, '0.0' ]);
                        }
                        tx.executeSql('INSERT INTO Today VALUES(datetime(?), ?, time(?), time(?), strftime(?,?)-strftime(?,?))', [ _datestr, ry.rows.item(0).thestatus, _datestr, ry.rows.item(0).endtime, '%s', ry.rows.item(0).endtime, '%s', _timestr]);

                    }
                    else if (rs.rows.length > 0 && rs.rows.item(0).past > 0) {
                        tx.executeSql('INSERT INTO Today VALUES(datetime(?), ?, time(?), time(?), ?)', [ _datestr, _where, _datestr, _datestr, '0.0' ]);
                    }
                    else {
                        //console.log("Future value can not to be set")
                    }
                }
                )
}

function getDayMinutes(_date) {
    var _puretimestr = "00:00:00"
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
                function(tx) {
                    // Create the database if it doesn't already exist
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Today(theday TEXT, thestatus TEXT, starttime TEXT, endtime TEXT, subtotal TEXT)');
                    // Get day minute values
                    var rs = tx.executeSql('SELECT thestatus, (strftime(?,starttime)-strftime(?,?))/60 AS start_time, (strftime(?,endtime)-strftime(?,?))/60 as end_time FROM Today WHERE date(theday) = date(?) AND thestatus NOT IN (?) ORDER BY start_time',['%s','%s',_puretimestr,'%s','%s',_puretimestr, _date, 'Not in a paddock'])
                    dayDraw.clear();
                    for (var i=0;i<rs.rows.length;i++)   {
                        // adding one to end time to eable drawing in the case there is only a marker
                        dayDraw.append({"start_time":rs.rows.item(i).start_time, "end_time":rs.rows.item(i).end_time+1, "name":rs.rows.item(i).thestatus});
                        //console.log(rs.rows.item(i).start_time, rs.rows.item(i).end_time)
                    }
                }
                )
}
