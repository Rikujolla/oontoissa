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

            // Updating the location
            if (neimi.text != "") {
                tx.executeSql('UPDATE Locations SET theplace=? WHERE ROWID = last_insert_rowid()', neimi.text);
            }
            if (latti.text != "") {
                tx.executeSql('UPDATE Locations SET thelati=? WHERE ROWID = last_insert_rowid()', latti.text);
            }
            if (longi.text != "") {
                tx.executeSql('UPDATE Locations SET thelongi=? WHERE ROWID = last_insert_rowid()', longi.text);
            }
            if (saissi.text != "") {
                tx.executeSql('UPDATE Locations SET tolerlong=? WHERE ROWID = last_insert_rowid()', saissi.text);
                tx.executeSql('UPDATE Locations SET tolerlat=? WHERE ROWID = last_insert_rowid()', saissi.text);
            }
            console.log("uprate")

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
            for(var i = 0; i < rs.rows.length; i++) {
                console.log("Varis lentää")
                varis.itemi += rs.rows.item(i).theplace + ", " + rs.rows.item(i).thelati + ", "
                        + rs.rows.item(i).thelongi + ", " + rs.rows.item(i).tolerlong + "\n";
            }
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
            varus.inFence = "";
            for(var i = 0; i < rs.rows.length; i++) {
                console.log("Varis lentää")
                varus.inFence += rs.rows.item(i).theplace;
            }
        }
    )

}
