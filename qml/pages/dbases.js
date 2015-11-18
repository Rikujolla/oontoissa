///
/// addLocation(), row 6
/// updateLocation(), row 35
/// delLocTable(), row 79
/// populateView(), row 91
/// checkFences(), row 120


function addLocation() {
    //console.log("Adding recent moves")
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
        function(tx) {
            // Create the table, if not existing
            tx.executeSql('CREATE TABLE IF NOT EXISTS Locations(thelongi REAL, thelati REAL, theplace TEXT, tolerlong REAL, tolerlat REAL)');

            // Adding location
            tx.executeSql('INSERT INTO Locations VALUES(?, ?, ?, ?, ?)', ['24.3764948', '61.64687276', 'Orivesi', '0.001', '0.001']);

            // Show all
            var rs = tx.executeSql('SELECT * FROM Locations');
            //for(var i = 0; i < rs.rows.length; i++) {
            //    varis.tempur += rs.rows.item(i).theplace + ", " + rs.rows.item(i).rowid + "\n";
            //}
            varis.itemis[currentIndex-1].pla = rs.rows.item(currentIndex-1).theplace;
            varis.itemis[currentIndex-1].els = rs.rows.item(currentIndex-1).thelati + ", "
                    + rs.rows.item(currentIndex-1).thelongi + ", " + rs.rows.item(currentIndex-1).tolerlong
            //console.log("The place ", varis.itemis[currentIndex-1].pla);


        }
    )

}

function updateLocation() {
    //console.log("Adding recent moves")
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
        function(tx) {
            // Create the table, if not existing
            tx.executeSql('CREATE TABLE IF NOT EXISTS Locations(thelongi REAL, thelati REAL, theplace TEST, tolerlong REAL, tolerlat REAL)');

            // Updating the location name
            if (neimi.text != "") {
                tx.executeSql('UPDATE Locations SET theplace=? WHERE ROWID = ?', [neimi.text, currentIndex] );
            }
            // Updating the location latitude
            if (latti.text != "") {
                tx.executeSql('UPDATE Locations SET thelati=? WHERE ROWID = ?', [latti.text, currentIndex]);
            }
            // Updating the location longitude
            if (longi.text != "") {
                tx.executeSql('UPDATE Locations SET thelongi=? WHERE ROWID = ?', [longi.text, currentIndex]);
            }
            // Updating the location tolerance
            if (saissi.text != "") {
                tx.executeSql('UPDATE Locations SET tolerlong=? WHERE ROWID = ?', [saissi.text, currentIndex]);
                tx.executeSql('UPDATE Locations SET tolerlat=? WHERE ROWID = ?', [saissi.text, currentIndex]);
            }

            // Show all
            var rs = tx.executeSql('SELECT rowid, * FROM Locations');
            for(var i = 0; i < rs.rows.length; i++) {
                varis.tempur += rs.rows.item(i).theplace + ", " + rs.rows.item(i).rowid + "\n";
            }
            varis.itemis[currentIndex-1].pla = rs.rows.item(currentIndex-1).theplace;
            varis.itemis[currentIndex-1].els = rs.rows.item(currentIndex-1).thelati + ", "
                    + rs.rows.item(currentIndex-1).thelongi + ", " + rs.rows.item(currentIndex-1).tolerlong
            console.log("uprateee ", varis.tempur);


        }
    )

}

function loadLocation() {

    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
        function(tx) {
            // Create the table, if not existing
            tx.executeSql('CREATE TABLE IF NOT EXISTS Locations(thelongi REAL, thelati REAL, theplace TEST, tolerlong REAL, tolerlat REAL)');

            // Show all
            var rs = tx.executeSql('SELECT rowid, * FROM Locations');
            for(var i = 0; i < rs.rows.length; i++) {
                paramit.itemis[i].pla = rs.rows.item(i).theplace;
                //console.log("uprateee ", paramit.itemis[i].pla, i);
                listis.set(i,{"tekstis": paramit.itemis[i].pla});
            }


        }
    )

}

function delLocTable() { // DROP TABLE does not work yet. Table locking should be solved! Stop Timers??
    console.log("deleting files")
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
            default:
                deletions.choice = "none";
            }
        }
    )
}

function populateView() {
    //console.log("populating")
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
        function(tx) {
            // Create the table, if not existing
            tx.executeSql('CREATE TABLE IF NOT EXISTS Locations(thelongi REAL, thelati REAL, theplace TEST, tolerlong REAL, tolerlat REAL)');

            // Show all
            var rs = tx.executeSql('SELECT * FROM Locations');


            // Filling movetext
            varis.itemi = "";
            for(var i = 0; i < rs.rows.length; i++) {
                console.log("populateView", rs.rows.item(currentIndex-1).theplace)
                varis.itemi += rs.rows.item(i).theplace + ", " + rs.rows.item(i).thelati + ", "
                        + rs.rows.item(i).thelongi + ", " + rs.rows.item(i).tolerlong + "\n";
            }
            varis.itemis[currentIndex-1].pla = rs.rows.item(currentIndex-1).theplace;
            varis.itemis[currentIndex-1].els = rs.rows.item(currentIndex-1).thelati + ", "
                    + rs.rows.item(currentIndex-1).thelongi + ", " + rs.rows.item(currentIndex-1).tolerlong
        }
    )

}

function checkFences() {
    //console.log("populating")
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
        function(tx) {
            // Create the table, if not existing
            tx.executeSql('CREATE TABLE IF NOT EXISTS Locations(thelongi REAL, thelati REAL, theplace TEST, tolerlong REAL, tolerlat REAL)');

            // Show all
            var rs = tx.executeSql('SELECT * FROM Locations');


            // Filling movetext
            varus.inFence = qsTr("Not in a paddock");
            varus.tolerat = 40000000.0; // Ordering by this the tighter tolerance to be selected when two possible locations
            for(var i = 0; i < rs.rows.length; i++) {
                if ((Math.abs(possu.position.coordinate.latitude - rs.rows.item(i).thelati) < rs.rows.item(i).tolerlat)
                        && (Math.abs(possu.position.coordinate.longitude - rs.rows.item(i).thelongi) < rs.rows.item(i).tolerlong)
                        && (rs.rows.item(i).tolerlong < varus.tolerat)) {
                    varus.inFence = rs.rows.item(i).theplace;
                    covLoc = varus.inFence;
                    varus.tolerat = rs.rows.item(i).tolerlong;
                    console.log("checkFences", possu.position.coordinate.latitude - rs.rows.item(i).thelati,
                                possu.position.coordinate.longitude - rs.rows.item(i).thelongi, varus.inFence)

                }
            }
        }
    )

}

function addTodayInfo() {
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
        function(tx) {
            // Create the database if it doesn't already exist
            tx.executeSql('CREATE TABLE IF NOT EXISTS Today(theday TEXT, thestatus TEXT, starttime TEXT, endtime TEXT, subtotal TEXT)');

            //Testing, if the status is still same
            //var evid = tx.executeSql('SELECT * FROM Today WHERE ROWID = last_insert_rowid()')
            var evid = tx.executeSql('SELECT * FROM Today WHERE date(theday) = date(?) ORDER BY theday DESC LIMIT 1', 'now')
            console.log("Statukset", evid.rows.length)

            if (evid.rows.length == 0) {
                tx.executeSql('INSERT INTO Today VALUES(datetime(?), ?, time(?), time(?), time(?))', [ 'now', varus.inFence, 'now', 'now', 'now' ]);
            }

            else if (evid.rows.item(0).thestatus == varus.inFence){
                // Update
                //var evied = tx.executeSql('SELECT strftime(?,?)-strftime(?,?) AS rest  FROM Today WHERE ROWID = last_insert_rowid()',['%s', 'now',  '%s', (evid.rows.item(0).theday)])
                var evied = tx.executeSql('SELECT strftime(?,?)-strftime(?,?) AS rest  FROM Today WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)',['%s', 'now',  '%s', (evid.rows.item(0).theday)])
                tx.executeSql('UPDATE Today SET endtime=time(?) WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)', 'now');
                //var begi = tx.executeSql('SELECT starttime AS begil FROM Today WHERE ROWID = last_insert_rowid()');
                var begi = tx.executeSql('SELECT starttime AS begil FROM Today WHERE ROWID = last_insert_rowid()');
                //console.log('alku', begi.rows.item(0).begil)
                //var endi = tx.executeSql('SELECT endtime AS endil FROM Today WHERE ROWID = last_insert_rowid()');
                var endi = tx.executeSql('SELECT endtime AS endil FROM Today WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)');
                //console.log('alku', begi.rows.item(0).begil, endi.rows.item(0).endil)
                //tx.executeSql('UPDATE Today SET subtotal=? WHERE ROWID = last_insert_rowid()', [evied.rows.item(0).rest]);
                tx.executeSql('UPDATE Today SET subtotal=? WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)', [evied.rows.item(0).rest]);
            }
            else {
                // Add a row
                tx.executeSql('INSERT INTO Today VALUES(datetime(?), ?, time(?), time(?), time(?))', [ 'now', varus.inFence, 'now', 'now', 'now' ]);
            }
            //console.log("evid", evid.rows.item(0).thestatus)
            //console.log("evied", evied.rows.item(0).rest)
            // Show all values
            //var evider = tx.executeSql('SELECT subtotal AS resto  FROM Today WHERE ROWID = last_insert_rowid()')
            var evider = tx.executeSql('SELECT subtotal AS resto  FROM Today WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)')
            //var evidy = tx.executeSql('SELECT time(subtotal) AS resta  FROM Today WHERE ROWID = (SELECT MAX(ROWID)  FROM Today)')
            //var evider = tx.executeSql('SELECT time(?,?) AS rest  FROM Today WHERE ROWID = last_insert_rowid()')

            var rs = tx.executeSql('SELECT * FROM Today WHERE date(theday) = date(?) AND thestatus NOT IN (?)', ['now', 'Not in a paddock']);

            var r = ""
            for(var i = 0; i < rs.rows.length; i++) {
                //r += rs.rows.item(i).starttime + " - " + rs.rows.item(i).endtime + ", " + rs.rows.item(i).thestatus + ", " + rs.rows.item(i).subtotal +"\n"
                r += rs.rows.item(i).starttime + " - " + rs.rows.item(i).endtime + ", " + rs.rows.item(i).thestatus +"\n"
            }
            varus.whatToday = r
            varus.timeInFence = evider.rows.item(0).resto
            //varus.timeInFenceQ = evidy.rows.item(0).resta
            //console.log(varus.timeInFenceQ)

        }
    )
}

function addHistoryData() {
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
        function(tx) {
            // Create the database if it doesn't already exist
            tx.executeSql('CREATE TABLE IF NOT EXISTS Today(theday TEXT, thestatus TEXT, starttime TEXT, endtime TEXT, subtotal TEXT)');
            //tx.executeSql('CREATE TABLE IF NOT EXISTS History(hday TEXT, hstatus TEXT, htotal TEXT)');

            // Show all values
            //var rs = tx.executeSql('SELECT theday, thestatus, SUM(time(?)) AS totle FROM Today GROUP BY theday, thestatus', 'subtotal');
            var rs = tx.executeSql('SELECT date(theday) AS deit, thestatus, SUM(subtotal) AS totle FROM Today WHERE thestatus NOT IN (?) GROUP BY deit, thestatus', 'Not in a paddock');
            //var rs = rt.executeSql('SELECT deit, thestatus, time(totle) AS totles FROM Today GROUP BY deit, thestatus');
            //var rt = tx.executeSql('INSERT INTO History SELECT date(theday) AS hday, thestatus AS hstatus, SUM(subtotal) AS htotal FROM Today GROUP BY hday, hstatus');

            var r = ""
            for(var i = 0; i < rs.rows.length; i++) {
                //console.log(i, rs.rows.item(i).totle);
                r += rs.rows.item(i).deit + ", " + rs.rows.item(i).thestatus + ", "
                        + (rs.rows.item(i).totle-rs.rows.item(i).totle%3600)/3600 + ":"
                        + ((rs.rows.item(i).totle-rs.rows.item(i).totle%60)/60 - (rs.rows.item(i).totle-rs.rows.item(i).totle%3600)/60)
                        +"\n"
            }
            varus.niceHistory = r
        }
    )
}
