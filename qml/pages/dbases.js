///
/// addLocation(), row 6
/// delLocTable(), row 25


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
            tx.executeSql('DROP TABLE Locations');
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
            varus.inFence = "?";
            for(var i = 0; i < rs.rows.length; i++) {
                if (Math.abs(possu.position.coordinate.latitude - rs.rows.item(i).thelati) < rs.rows.item(i).tolerlat) {
                varus.inFence = rs.rows.item(i).theplace;
                    console.log("checkFences", possu.position.coordinate.latitude - rs.rows.item(i).thelati, varus.inFence)

                }
            }
        }
    )

}
