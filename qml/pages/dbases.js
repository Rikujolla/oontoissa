///
/// updateLocation(), row 12
/// loadLocation(), row 65
/// delLocTable(), row 85
/// delCelli(), row 123
/// delLocation(), row 141
/// populateView(), row 166
/// checkFences(), row 215
/// addTodayInfo(), row 273
/// addHistoryData(), row 322



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
                tx.executeSql('UPDATE Locations SET tolerlat=? WHERE theplace = ?', [saissi.text, (listix.get(currentIndex-1).pla)]);

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
            }
            else {
                neimi.text = rs.rows.item(currentIndex-1).theplace;
                saissi.text = rs.rows.item(currentIndex-1).tolerlong;
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
            // Create the table, if not existing
            tx.executeSql('CREATE TABLE IF NOT EXISTS Locations(thelongi REAL, thelati REAL, theplace TEXT, tolerlong REAL, tolerlat REAL)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Cellinfo(theplace TEXT, thecelli INTEGER, sigstrength INTEGER, cellat REAL, cellong REAL, celltol REAL)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Today(theday TEXT, thestatus TEXT, starttime TEXT, endtime TEXT, subtotal TEXT)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Priorities(theplace TEXT, gps INTEGER, cell INTEGER, wifi INTEGER, blut INTEGER, other INTEGER)');

            // Show all
            var rs = tx.executeSql('SELECT * FROM Locations');
            // Spherical distance
            var dfii; // Latitude difference
            var meanfii; // Latitude difference mean
            var dlamda; // Longitude difference
            var ddist; // Distance in meters

            // Filling movetext
            varus.inFence = "Not in a paddock";
            varus.inFenceT = qsTr("Free galloping");
            covLoc = varus.inFenceT;
            varus.tolerat = 40000000.0; // Ordering by this the tighter tolerance to be selected when two possible locations
            var coord = possut.position.coordinate
            for(var i = 0; i < rs.rows.length; i++) {
                //dfii = Math.abs(possut.position.coordinate.latitude - rs.rows.item(i).thelati)*Math.PI/180;
                dfii = Math.abs(coord.latitude - rs.rows.item(i).thelati)*Math.PI/180;
                //meanfii = (possut.position.coordinate.latitude + rs.rows.item(i).thelati)*Math.PI/360
                meanfii = (coord.latitude + rs.rows.item(i).thelati)*Math.PI/360
                //dlamda = Math.abs(possut.position.coordinate.longitude - rs.rows.item(i).thelongi)*Math.PI/180;
                dlamda = Math.abs(coord.longitude - rs.rows.item(i).thelongi)*Math.PI/180;
                ddist = 6371009*Math.sqrt(Math.pow(dfii,2)+Math.pow(Math.cos(meanfii)*dlamda,2));
                if ((ddist < rs.rows.item(i).tolerlong)
                        && (rs.rows.item(i).tolerlong < varus.tolerat)) {
                    varus.inFenceT = rs.rows.item(i).theplace;
                    varus.inFence = rs.rows.item(i).theplace;
                    covLoc = varus.inFenceT;
                    varus.tolerat = rs.rows.item(i).tolerlong;
                }
            } //endfor
            // Maintaining location if in cell though not in gps range (e.g. in building)
            if (varus.inFence == "Not in a paddock") {
                var rt = tx.executeSql('SELECT * FROM Today WHERE ROWID = last_insert_rowid()');
                if (rt.rows.length >0) {
                    rs = tx.executeSql('SELECT * FROM Cellinfo WHERE theplace = ? AND thecelli = ?', [rt.rows.item(0).thestatus, currentCell]);
                    if (rs.rows.length > 0) {
                        //console.log("last insertred", rt.rows.item(0).thestatus, rt.rows.length, currentCell)
                        rs = tx.executeSql('SELECT * FROM Locations WHERE theplace = ?', rt.rows.item(0).thestatus);
                        varus.inFence = rs.rows.item(0).theplace;
                        varus.inFenceT = varus.inFence;
                        covLoc = varus.inFenceT;
                        varus.tolerat = rs.rows.item(0).tolerlong;
                    }
                }
            }
            if (varus.inFence == "Not in a paddock") {
                //console.log("pelkällä sellillä")
                rs = tx.executeSql('SELECT * FROM Locations');
                //rt = tx.executeSql('SELECT * FROM Priorities WHERE theplace = ?', neimi.text);
                for(i = 0; i < rs.rows.length; i++) {
                    rt = tx.executeSql('SELECT cell FROM Priorities WHERE theplace = ?', rs.rows.item(i).theplace);
                    //taking any accepted cell from the list. Thinkin priorities later, (smallest or largest?? size)
                    if (rt.rows.item(0) == 1) {
                        varus.inFence = rs.rows.item(i).theplace;
                        varus.inFenceT = varus.inFence;
                        covLoc = varus.inFenceT;
                        varus.tolerat = rs.rows.item(i).tolerlong;
                    }
                }


            }
        }
    )
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
            // Recording the first value of the day
            if (evid.rows.length == 0) {
                tx.executeSql('INSERT INTO Today VALUES(datetime(?,?), ?, time(?,?), time(?,?), time(?,?))', [ 'now', 'localtime', varus.inFence, 'now', 'localtime', 'now', 'localtime', 'now', 'localtime' ]);
            if (varus.inFence == "Not in a paddock" ){saveLag = 0} else {saveLag = 50}
            }
            // Updating existing record
            else if (evid.rows.item(0).thestatus == varus.inFence){
                // Update

                var evied = tx.executeSql('SELECT strftime(?,?,?)-strftime(?,?) AS rest  FROM Today WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)',['%s', 'now', 'localtime', '%s', (evid.rows.item(0).theday)])
                tx.executeSql('UPDATE Today SET endtime=time(?, ?) WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)', ['now', 'localtime']);
                var begi = tx.executeSql('SELECT starttime AS begil FROM Today WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)');
                var endi = tx.executeSql('SELECT endtime AS endil FROM Today WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)');
                tx.executeSql('UPDATE Today SET subtotal=? WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)', [evied.rows.item(0).rest]);
                if (varus.inFence == "Not in a paddock" ){saveLag = 0} else {saveLag = 50}
            }
            else {
                // Add a row. For not in a paddock lag is utilized. today view have to be thinked and time is lost also for one minute
                //console.log(saveLag)
                if (saveLag > 0 && varus.inFence == "Not in a paddock") {
                    saveLag = saveLag -saveDecr
                    evied = tx.executeSql('SELECT strftime(?,?,?)-strftime(?,?) AS rest  FROM Today WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)',['%s', 'now', 'localtime', '%s', (evid.rows.item(0).theday)])
                    tx.executeSql('UPDATE Today SET endtime=time(?, ?) WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)', ['now', 'localtime']);
                    begi = tx.executeSql('SELECT starttime AS begil FROM Today WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)');
                    endi = tx.executeSql('SELECT endtime AS endil FROM Today WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)');
                    tx.executeSql('UPDATE Today SET subtotal=? WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)', [evied.rows.item(0).rest]);

                }
                else {
                    tx.executeSql('INSERT INTO Today VALUES(datetime(?,?), ?, time(?,?), time(?,?), time(?,?))', [ 'now', 'localtime', varus.inFence, 'now', 'localtime', 'now', 'localtime', 'now', 'localtime' ]);
                    saveLag = 50
                }

            }
            // Show all values
            var evider = tx.executeSql('SELECT subtotal AS resto  FROM Today WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)')

            var rs = tx.executeSql('SELECT * FROM Today WHERE date(theday) = date(?,?) AND thestatus NOT IN (?)', ['now', 'localtime', 'Not in a paddock']);

            var r = ""
            for(var i = 0; i < rs.rows.length; i++) {
                r += rs.rows.item(i).starttime + " - " + rs.rows.item(i).endtime + ", " + rs.rows.item(i).thestatus +"\n"
            }
            varus.whatToday = r
            varus.timeInFence = evider.rows.item(0).resto

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
