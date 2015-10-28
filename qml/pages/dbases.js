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
            console.log("The place ", varis.itemis[currentIndex-1].pla);


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

function delLocTable() {
    console.log("deleting files")
    var db = LocalStorage.openDatabaseSync("AtworkDB", "1.0", "At work database", 1000000);

    db.transaction(
        function(tx) {
            // Create the database if it doesn't already exist
            //tx.executeSql('DROP TABLE Locations');
            tx.executeSql('DROP TABLE Today');
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
            varus.inFence = "Not in any fence";
            for(var i = 0; i < rs.rows.length; i++) {
                if ((Math.abs(possu.position.coordinate.latitude - rs.rows.item(i).thelati) < rs.rows.item(i).tolerlat)
                        && (Math.abs(possu.position.coordinate.longitude - rs.rows.item(i).thelongi) < rs.rows.item(i).tolerlong)) {
                varus.inFence = rs.rows.item(i).theplace;
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
            var evid = tx.executeSql('SELECT * FROM Today WHERE ROWID = last_insert_rowid()')
            if (evid.rows.length == 0) {
                tx.executeSql('INSERT INTO Today VALUES(?, ?, ?, ?, ?)', [ timeri.daatta, varus.inFence, timeri.timme, timeri.timme, timeri.timme ]);
            }

            else if (evid.rows.item(0).thestatus == varus.inFence){
                // Update
                tx.executeSql('UPDATE Today SET endtime=? WHERE ROWID = last_insert_rowid()', [timeri.timme]);
            }
            else {
                // Add a row
                tx.executeSql('INSERT INTO Today VALUES(?, ?, ?, ?, ?)', [ timeri.daatta, varus.inFence, timeri.timme, timeri.timme, timeri.timme ]);
            }
            console.log("evid", evid.rows.item(0).thestatus)
            // Show all values
            var rs = tx.executeSql('SELECT * FROM Today');

            var r = ""
            for(var i = 0; i < rs.rows.length; i++) {
                r += rs.rows.item(i).starttime + " - " + rs.rows.item(i).endtime + ", " + rs.rows.item(i).thestatus +"\n"
            }
            varus.whatToday = r
        }
    )
}
