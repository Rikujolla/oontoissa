///
/// updateLocation(), row 14
/// loadLocation(), row 70
/// delLocTable(), row 90
/// delCelli(), row 127, deletes a single cell from cell list
/// delLocation(), row 144
/// populateView(), row 169
/// checkFences(), row 234
/// addTodayInfo(), row 315
/// addHistoryData(), row 378
///


function updateLocation() {

    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
                function(tx) {
                    // Create the table, if not existing
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Locations(thelongi REAL, thelati REAL, theplace TEXT, tolerlong REAL, tolerlat REAL)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Cellinfo(theplace TEXT, thecelli INTEGER, sigstrength INTEGER, cellat REAL, cellong REAL, celltol REAL)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Priorities(theplace TEXT, gps INTEGER, cell INTEGER, wifi INTEGER, blut INTEGER, other INTEGER)');

                    // Updating the location name
                    //if (neimi.text != "") {
                    tx.executeSql('UPDATE Locations SET theplace=? WHERE theplace = ?', [neimi.text, (listix.get(currentIndex-1).pla)] );
                    //}
                    // Updating the location latitude
                    if (latti.text != "") {
                        tx.executeSql('UPDATE Locations SET thelati=? WHERE theplace = ?', [latti.text, (listix.get(currentIndex-1).pla)]);
                    }
                    // Updating the location longitude
                    if (longi.text != "") {
                        tx.executeSql('UPDATE Locations SET thelongi=? WHERE theplace = ?', [longi.text, (listix.get(currentIndex-1).pla)]);
                    }
                    // Updating the location tolerance
                    tx.executeSql('UPDATE Locations SET tolerlong=? WHERE theplace = ?', [saissi.text, (listix.get(currentIndex-1).pla)]);

                    // Updating the location fence thickness, later the parameter name should be changed
                    tx.executeSql('UPDATE Locations SET tolerlat=? WHERE theplace = ?', [fence.text, (listix.get(currentIndex-1).pla)]);

                    // Updating the cell information
                    if (celli.text != "") {
                        var rs = tx.executeSql('SELECT * FROM Cellinfo WHERE theplace = ? AND thecelli = ?', [(listix.get(currentIndex-1).pla), celli.text]);

                        //tx.executeSql('UPDATE Cellinfo SET thecelli=? WHERE theplace = ?', [celli.text, (listix.get(currentIndex-1).pla)]);
                        if (rs.rows.length == 0) {
                            tx.executeSql('INSERT INTO Cellinfo VALUES(?, ?, ?, ?, ?, ?)', [(listix.get(currentIndex-1).pla), celli.text, '1', '1.0', '1.0', '1.0']);
                        }
                    }

                    // Show all
                    rs = tx.executeSql('SELECT * FROM Locations');

                    listix.set((currentIndex-1),{"pla": rs.rows.item(currentIndex-1).theplace});
                    listix.set((currentIndex-1),{"els": (rs.rows.item(currentIndex-1).thelati + ", "
                                                         + rs.rows.item(currentIndex-1).thelongi + ", " + rs.rows.item(currentIndex-1).tolerlong)});

                    rs = tx.executeSql('SELECT * FROM Cellinfo WHERE theplace = ?',(listix.get(currentIndex-1).pla));
                    for(var i = 0; i < rs.rows.length; i++) {
                        listix.set((currentIndex-1),{"cels":", " + rs.rows.item(i).thecelli})
                    }
                    tx.executeSql('UPDATE Priorities SET cell=? WHERE theplace = ?', [sellPri.checked, (listix.get(currentIndex-1).pla)]);

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
                        deletions.choice = "none";
                        break;
                    case "cells":
                        //tx.executeSql('DROP TABLE Cellinfo');
                        tx.executeSql('DELETE FROM Cellinfo');
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

function delLocation() { // DROP TABLE does not work yet. Table locking should be solved! Stop Timers??

    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
                function(tx) {
                    // Create the table, if not existing
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Locations(thelongi REAL, thelati REAL, theplace TEXT, tolerlong REAL, tolerlat REAL)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Cellinfo(theplace TEXT, thecelli INTEGER, sigstrength INTEGER, cellat REAL, cellong REAL, celltol REAL)');
                    // Show all
                    //var rs = tx.executeSql('SELECT * FROM Locations');

                    // tx.executeSql('DELETE FROM Locations WHERE rowid = ?', (currentIndex));
                    tx.executeSql('DELETE FROM Locations WHERE theplace = ?', (listix.get(currentIndex-1).pla));
                    tx.executeSql('DELETE FROM Cellinfo WHERE theplace = ?', (listix.get(currentIndex-1).pla));

                    //rs = tx.executeSql('SELECT * FROM Cellinfo');

                    var rs = tx.executeSql('SELECT * FROM Locations');
                    listSize = rs.rows.length;
                    currentIndex--;
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

                    // Show all
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

                    if (rs.rows.length == 0) {
                        sellPri.checked = false
                        tx.executeSql('INSERT INTO Priorities VALUES(?, ?, ?, ?, ?, ?)', [(listix.get(currentIndex-1).pla), '1', '0', '0', '0', '0']);
                    }
                    else {
                        //sellPri.checked = true
                        rs = tx.executeSql('SELECT * FROM Priorities WHERE theplace = ?', neimi.text);
                        //console.log("selle, ", rs.rows.item(0).cell)
                        sellPri.checked = rs.rows.item(0).cell
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
                    //tx.executeSql('CREATE TABLE IF NOT EXISTS Enterstatus(theplace TEXT, previous INTEGER, current INTEGER)');

                    // Show all
                    var rs = tx.executeSql('SELECT * FROM Locations');
                    //var rt = tx.executeSql('SELECT * FROM Enterstatus');
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
                    var tolerat = 40000000.0; // Ordering by this the tighter tolerance to be selected when two possible locations
                    var coord = possut.position.coordinate
                    for(var i = 0; i < rs.rows.length; i++) {
                        dfii = Math.abs(coord.latitude - rs.rows.item(i).thelati)*Math.PI/180;
                        meanfii = (coord.latitude + rs.rows.item(i).thelati)*Math.PI/360
                        dlamda = Math.abs(coord.longitude - rs.rows.item(i).thelongi)*Math.PI/180;
                        ddist = 6371009*Math.sqrt(Math.pow(dfii,2)+Math.pow(Math.cos(meanfii)*dlamda,2));
                        if ((ddist < rs.rows.item(i).tolerlong)
                                && (rs.rows.item(i).tolerlong < tolerat)) {
                            varus.inFenceT = rs.rows.item(i).theplace;
                            varus.inFence = rs.rows.item(i).theplace;
                            covLoc = varus.inFenceT;
                            tolerat = rs.rows.item(i).tolerlong;
                            newStatus = 2
                            extraMsg = ""
                            //if (newStatus != prevStatus) {console.log("In the paddock", newStatus, ddist)}
                        }
                        else if ((ddist < (rs.rows.item(i).tolerlong + rs.rows.item(i).tolerlong))) {
                            if (prevStatus == 2 || prevStatus == 3 || prevStatus == 4 || prevStatus == 5){
                                newStatus=5
                                extraMsg = qsTr("Leaving the paddock")
                                //if (newStatus != prevStatus) {console.log("Leaving the paddock", newStatus, ddist)}
                            }
                            else {
                                newStatus=1
                                extraMsg = qsTr("Entering the paddock")
                                //if (newStatus != prevStatus) {console.log("Entering the paddock", newStatus, ddist)}
                            }
                            // 2 in GPS, 3 in Cellsupported gps, 4 wifi, 5 leaving area, 6 pure cell
                        }
                    } //endfor
                    // Maintaining location if in cell though not in gps range (e.g. in building)
                    if (varus.inFence == "Not in a paddock"
                            && (prevStatus == 2 || prevStatus == 3 || prevStatus == 4)
                            && newStatus != 5) {
                        var rt = tx.executeSql('SELECT * FROM Today WHERE ROWID = last_insert_rowid()');
                        if (rt.rows.length >0) {
                            rs = tx.executeSql('SELECT * FROM Cellinfo WHERE theplace = ? AND thecelli = ?', [rt.rows.item(0).thestatus, currentCell]);
                            if (rs.rows.length > 0) {
                                //console.log("last insertred", rt.rows.item(0).thestatus, rt.rows.length, currentCell)
                                rs = tx.executeSql('SELECT * FROM Locations WHERE theplace = ?', rt.rows.item(0).thestatus);
                                varus.inFence = rs.rows.item(0).theplace;
                                varus.inFenceT = varus.inFence;
                                covLoc = varus.inFenceT;
                                tolerat = rs.rows.item(0).tolerlong;
                                newStatus = 3;
                                extraMsg = qsTr("No GPS, cells info used instead")
                                //if (newStatus != prevStatus) {console.log("Work without GPS", newStatus, ddist)}
                            }
                        }
                    }

                    /// This clause sets the location with pure cell info
                    if (varus.inFence == "Not in a paddock") {
                        //First selecting locations from biggest to smallest
                        //rs = tx.executeSql('SELECT * FROM Locations ORDER BY tolerlong DESC');
                        rs = tx.executeSql('SELECT * FROM Locations INNER JOIN Priorities ON Locations.theplace = Priorities.theplace INNER JOIN Cellinfo ON Priorities.theplace = Cellinfo.theplace WHERE Priorities.cell = ? AND Cellinfo.thecelli = ? ORDER BY tolerlong ASC LIMIT 1', ['1',currentCell]);
                        //console.log("phase1")
                        //rt = tx.executeSql('SELECT * FROM Priorities WHERE theplace = ?', neimi.text);
                        //for(i = 0; i < rs.rows.length; i++) {
                            //console.log("phase2", rs.rows.item(i).theplace)
                            //Selecting
                            //rt = tx.executeSql('SELECT cell FROM Priorities WHERE theplace = ?', rs.rows.item(i).theplace);
                            //taking any accepted cell from the list. Thinkin priorities later, (smallest or largest?? size)
                            //if (rt.rows.length > 0) {
                                if (rs.rows.length > 0) {
                                //console.log("phase3", rs.rows.item(0).theplace)
                                varus.inFence = rs.rows.item(0).theplace;
                                varus.inFenceT = varus.inFence;
                                covLoc = varus.inFenceT;
                                tolerat = rs.rows.item(0).tolerlong;
                                newStatus = 6;
                                extraMsg = qsTr("Pure cell info in use")
                                //if (newStatus != prevStatus) {console.log("Pure cell info", newStatus)}
                            }
                        //}


                    }
                }
                )
    if (newStatus == 0) {extraMsg = ""};
    varus.timeSow()
    addTodayInfo()

}

function addTodayInfo() {
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
                function(tx) {
                    // Create the database if it doesn't already exist
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Today(theday TEXT, thestatus TEXT, starttime TEXT, endtime TEXT, subtotal TEXT)');

                    // Testing, if the status is still same
                    // First selecting the most recent value saved to database
                    var evid = tx.executeSql('SELECT * FROM Today WHERE date(theday) = date(?,?) ORDER BY theday DESC LIMIT 1', ['now', 'localtime'])
                    // Not recording until the data is valid, currently only time lag, in future much more better logic
                    if (saveLag >0) {
                        saveLag = saveLag -saveDecr
                        newStatus = 7
                        extraMsg = qsTr("Validating the location info")
                    }
                    // Recording the first value of the day or if marker set recording that
                    else if (evid.rows.length == 0 || marker == true) {
                        if (varus.inFence == "Not in a paddock" && marker == true) {varus.inFence = qsTr("Manual marker")}
                        tx.executeSql('INSERT INTO Today VALUES(datetime(?,?), ?, time(?,?), time(?,?), time(?,?))', [ 'now', 'localtime', varus.inFence, 'now', 'localtime', 'now', 'localtime', 'now', 'localtime' ]);
                        //console.log("first of the day or a marker", prevStatus, newStatus)
                        marker = false
                        prevStatus = newStatus;
                    }
                    // Updating existing record
                    else if (evid.rows.item(0).thestatus == varus.inFence){
                        // If leaving the location, not saving the info
                        if (varus.inFence == "Not in a paddock" && newStatus == 5 ){
                            prevStatus = newStatus}
                        // Updating the existing record
                        else {
                            var evied = tx.executeSql('SELECT strftime(?,?,?)-strftime(?,?) AS rest  FROM Today WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)',['%s', 'now', 'localtime', '%s', (evid.rows.item(0).theday)])
                            tx.executeSql('UPDATE Today SET endtime=time(?, ?) WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)', ['now', 'localtime']);
                            var begi = tx.executeSql('SELECT starttime AS begil FROM Today WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)');
                            var endi = tx.executeSql('SELECT endtime AS endil FROM Today WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)');
                            tx.executeSql('UPDATE Today SET subtotal=? WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)', [evied.rows.item(0).rest]);
                            prevStatus = newStatus;
                        }
                    }
                    // If ending here starting the new record
                    else {
                        tx.executeSql('INSERT INTO Today VALUES(datetime(?,?), ?, time(?,?), time(?,?), time(?,?))', [ 'now', 'localtime', varus.inFence, 'now', 'localtime', 'now', 'localtime', 'now', 'localtime' ]);
                        prevStatus = newStatus;
                    }
                    // Show all values
                    var evider = tx.executeSql('SELECT subtotal AS resto  FROM Today WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)')
                    //The next row will fail if the days first record and validating data. FIX in some phase. Not fatal.
                    evied = tx.executeSql('SELECT strftime(?,?,?)-strftime(?,?) AS rest  FROM Today WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)',['%s', 'now', 'localtime', '%s', (evid.rows.item(0).theday)])
                    if (newStatus == 5 || newStatus == 7){
                        varus.timeInFence = evied.rows.item(0).rest
                    }
                    else {
                        varus.timeInFence = evider.rows.item(0).resto
                    }

                    var rs = tx.executeSql('SELECT * FROM Today WHERE date(theday) = date(?,?) AND thestatus NOT IN (?)', ['now', 'localtime', 'Not in a paddock']);

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
                    var rs = tx.executeSql('SELECT date(theday) AS deit, thestatus, SUM(subtotal) AS totle FROM Today WHERE thestatus NOT IN (?) GROUP BY deit, thestatus ORDER BY deit DESC', 'Not in a paddock');

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
    histor.text = varus.niceHistory;

}

function editInfo() {
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
                function(tx) {
                    // Create the database if it doesn't already exist
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Today(theday TEXT, thestatus TEXT, starttime TEXT, endtime TEXT, subtotal TEXT)');
                    if (button.tiikro_done){
                        var rs = tx.executeSql('SELECT * FROM Today WHERE date(theday) = ? AND thestatus NOT IN (?)', [button.selectedDate, 'Not in a paddock']);
                        //console.log(rs.rows.item(0).theday)
                    }
                    else {
                        rs = tx.executeSql('SELECT * FROM Today WHERE date(theday) = date(?,?) AND thestatus NOT IN (?)', ['now', 'localtime', 'Not in a paddock']);
                        //console.log("not date")
                    }
                    //var r = ""
                    for(var i = 0; i < rs.rows.length; i++) {
                        dayValues.set((i),{"starttime": rs.rows.item(i).starttime});
                        dayValues.set((i),{"endtime": rs.rows.item(i).endtime});
                        dayValues.set((i),{"pla": rs.rows.item(i).thestatus});
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
                    if (button.tiikro_done){
                    var rs = tx.executeSql('DELETE FROM Today WHERE date(theday) = ? AND thestatus = ? AND starttime = ?', [button.selectedDate, (dayValues.get(dayValues.indexEdit).pla), (dayValues.get(dayValues.indexEdit).starttime)]);
                    }
                    else{
                        rs = tx.executeSql('DELETE FROM Today WHERE date(theday) = date(?,?) AND thestatus = ? AND starttime = ?', ['now', 'localtime', (dayValues.get(dayValues.indexEdit).pla), (dayValues.get(dayValues.indexEdit).starttime)]);
                    }
                    //var r = ""
                    /*for(var i = 0; i < rs.rows.length; i++) {
                        //r += rs.rows.item(i).starttime + " - " + rs.rows.item(i).endtime + ", " + rs.rows.item(i).thestatus +"\n"
                        dayValues.set((i),{"starttime": rs.rows.item(i).starttime});
                        dayValues.set((i),{"endtime": rs.rows.item(i).endtime});
                        dayValues.set((i),{"pla": rs.rows.item(i).thestatus});
                        //rs.rows.item(i).starttime + " - " + rs.rows.item(i).endtime + ", " + rs.rows.item(i).thestatus +"\n"


                    }*/
                    //dayValues.clear();
                    //editDataUpdate.start();

                }

                )
}
