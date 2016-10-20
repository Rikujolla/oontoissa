/*Copyright (c) 2015, Riku Lahtinen
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

import QtQuick 2.0
import Sailfish.Silica 1.0
import QtQuick.LocalStorage 2.0 //RLAH
import "dbases.js" as Mydbases //RLAH
import "inertianav.js" as Myinertia //RLAH
import QtSensors 5.0


Page {
    id: page

    // To enable PullDownMenu, place our content in a SilicaFlickable
    SilicaFlickable {
        anchors.fill: parent

        // PullDownMenu and PushUpMenu must be declared in SilicaFlickable, SilicaListView or SilicaGridView
        PullDownMenu {
            MenuItem {
                id: gpsUse
                text: gpsTxt
                onClicked: {
                    gpsTrue = !gpsTrue
                    gpsTrue ? (gpsUse.text = qsTr("Do not use GPS")) : (gpsUse.text = qsTr("Use GPS"))
                }
            }
            MenuItem {
                text: qsTr("Edit data")
                onClicked: pageStack.push(Qt.resolvedUrl("EditData.qml"))
            }
            MenuItem {
                text: qsTr("Set marker")
                onClicked: marker = true
            }
            MenuItem { //RLAH
                text: qsTr("Set location")
                onClicked: pageStack.push(Qt.resolvedUrl("SetLocation.qml"))
            }
        }

        PushUpMenu {
            MenuItem {
                text: qsTr("Help")
                onClicked: pageStack.push(Qt.resolvedUrl("Help.qml"))
            }
            MenuItem {
                text: qsTr("About")
                onClicked: pageStack.push(Qt.resolvedUrl("About.qml"))
            }
        }

        // Tell SilicaFlickable the height of its content.
        contentHeight: column.height

        // Place our content in a Column.  The PageHeader is always placed at the top
        // of the page, followed by our content.
        Column {
            id: column

            width: page.width
            spacing: Theme.paddingLarge
            PageHeader {
                title: qsTr("At work")
            }

            BackgroundItem {
                SectionHeader { text: qsTr("Location now") }
                onClicked: pageStack.push(Qt.resolvedUrl("SetLocation.qml"))
            }

            Text {
                id: status
                color: Theme.primaryColor
                anchors {
                    left: parent.left
                    right: parent.right
                    margins: Theme.paddingLarge
                }
                text: varus.inFence + ": " + varus.timeInFenceS
            }
            Text {
                id: statusExtra
                visible: statusExtra.text != ""
                color: Theme.secondaryColor
                wrapMode: Text.WordWrap
                font.pixelSize: Theme.fontSizeSmall
                anchors {
                    left: parent.left
                    right: parent.right
                    margins: Theme.paddingLarge
                }
                text: extraMsg
            }

            BackgroundItem {
                SectionHeader { text: qsTr("Today") }
                onClicked: pageStack.push(Qt.resolvedUrl("EditData.qml"))
            }

            Text {
                id: todday
                color: Theme.primaryColor
                anchors {
                    left: parent.left
                    right: parent.right
                    margins: Theme.paddingLarge
                }
                text: varus.whatToday
            }
            BackgroundItem {
                SectionHeader {
                    id: history
                    text: qsTr("History")
                }
                onClicked: varus.historyFilter = !varus.historyFilter
            }
            Text {
                id: histor
                font.pixelSize: Theme.fontSizeSmall
                color: Theme.primaryColor
                wrapMode: Text.WordWrap
                width: parent.width
                anchors {
                    left: parent.left
                    right: parent.right
                    margins: Theme.paddingLarge
                }
                text: varus.niceHistory
            }

            ///////////////////////////////////
            ///// Start of At work Today.qml to wht transfer
            ///////////////////////////////////

            Item {
                id: varus
                property string inFence  //Stores the value where device is, e.g. Work, Home ..
                property string inFenceT  //Stores the value where device is, e.g. Work, Home ..
                property string timeInFence //Stores the time in fence in seconds
                property string timeInFenceS //Stores the time in fence String
                property string whatToday: ""
                property string niceHistory: ""
                property int hoursD //used to display status hours
                property int minutesD //Used to display status minutes
                property int secondsD //Used to display status seconds
                property string secondsDT //Used to display status seconds in text format
                //property real tolerat: 40000000.0 // Used to order two locations in order
                property real temp1
                property real temp2
                property bool historyFilter : false // False showing all data in History, true the current week
                function timeSow() {
                    hoursD = (varus.timeInFence-varus.timeInFence%3600)/3600;
                    minutesD = (varus.timeInFence-varus.timeInFence%60)/60-hoursD*60;
                    secondsD = varus.timeInFence%60
                    secondsDT = secondsD < 10 ? ("0"+ secondsD):(secondsD)
                    timeInFenceS = minutesD < 10 ? (hoursD + ":0" + minutesD + ":" + secondsDT):(hoursD + ":" + minutesD + ":" + secondsDT)
                    covTim = minutesD < 10 ? (hoursD + ":0" + minutesD):(hoursD + ":" + minutesD);
                }
            }

            Item {
                id: kalman
                property real z_k_lat // Measured latitude
                property real x_k_lat : 0.0 //Kalman latitude
                property real p_k_lat : 1.0 //Parameter
                property real k_k_lat
                property real r_lat : 0.00001 //Parameter
            }
            Component.onCompleted:bestBus.getProperties()

            /// Counting time in each location


            Timer { // Timer when the app is active
                interval: rateAct
                running:Qt.application.active
                repeat:true
                onTriggered: {
                    Qt.application.active && newStatus !=4 ? saveDecr = 1 : saveDecr = ratePass/1000
                    bestBus.getProperties()
                    wifiBus.getServices()
                    Mydbases.checkFences();
                    statusExtra.text = extraMsg
                    //console.log("aktiivist", varus.timeInFenceS)
                    //varus.timeSow();
                    //Mydbases.addTodayInfo();
                    //Mydbases.addHistoryData();
                    //status.text = varus.inFenceT + ": " + varus.timeInFenceS;
                    //todday.text = varus.whatToday;
                    //histor.text = varus.niceHistory;
                }
            }

            Timer { //Timer when the app is passive
                interval: ratePass
                running: true && !inSleep
                repeat:true
                onTriggered: {
                    Qt.application.active && newStatus !=4 ? saveDecr = 1 : saveDecr = ratePass/1000
                    bestBus.getProperties()
                    wifiBus.getServices()
                    Mydbases.checkFences();
                    statusExtra.text = extraMsg
                    rot.active ? (console.log("Rottaa")):console.log("Ei Rottaa")
                    rot.active ? rot.stop() : rot.start()
                    //console.log("passiivist", varus.timeInFenceS)
                }
            }

            Timer { //Timer when the app is in sleep
                interval: rateSleep
                running: true
                repeat:true
                onTriggered: {
                    //Qt.application.active && newStatus !=4 ? saveDecr = 1 : saveDecr = ratePass/1000
                    bestBus.getProperties()
                    wifiBus.getServices()
                    Mydbases.checkFences();
                    statusExtra.text = extraMsg
                    //inSleep ? console.log("In sleep", varus.timeInFenceS) : console.log("Only sleep timer")
                }
            }

            Accelerometer {
                id:accelo
                alwaysOn: true
                active:false
                dataRate: 20
                //skipDuplicates: true
                //onReadingChanged: console.log("Translaatio", reading.x,reading.y,reading.z)
                //position estimation
                // x, positive acceleration right
                // y, positive acceleration forward
                // z, positive acceleration up
            }

            Compass {
                id:kompassi
                active:true && Qt.application.active
                //alwaysOn: true
                dataRate: 20
                //onReadingChanged: console.log("Kompassi", reading.azimuth)

            }

            Gyroscope {
                id: gyroo
                active:false
                alwaysOn: true
                dataRate: 20
                //skipDuplicates: true
                //onReadingChanged: console.log("Gyro", reading.x,reading.y,reading.z)
                // xrot, positive rotation nose up
                // yrot, positive rotation roll right
                // zrot, positive rotation yaw left
            }

            RotationSensor {
                id: rot
                active:false
                alwaysOn: true
                dataRate: 1
                onReadingChanged: console.log ("Rotation", reading.x, reading.y, reading.z)
                //x == 0 when horizontal
                //y == 0 when screen downwards
                //z == 0 ???? south??
            }

            /*Timer{
                interval : rateAct
                running: !Qt.application.active && !inSleep
                repeat: true
                onTriggered: Myinertia.flyInertia()
            }*/



            ///////////////////////////////////
            ///// End of At work Today.qml to wht transfer
            ///////////////////////////////////




        }
    }
}


