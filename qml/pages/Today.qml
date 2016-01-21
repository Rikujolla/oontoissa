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
import QtQuick.LocalStorage 2.0
import "dbases.js" as Mydbases


Page {
    id: page

    // To enable PullDownMenu, place our content in a SilicaFlickable
    SilicaFlickable {
        anchors.fill: parent

        // PullDownMenu and PushUpMenu must be declared in SilicaFlickable, SilicaListView or SilicaGridView
        PullDownMenu {
            MenuItem {
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
            SectionHeader { text: qsTr("Location now") }

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

            SectionHeader { text: qsTr("Today") }
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

            SectionHeader { text: qsTr("History") }
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


            ////Functions etc
            Connections {
                target: possut
                onPositionChanged: {
                    Mydbases.checkFences();
                    varus.timeSow();
                    Mydbases.addTodayInfo();
                    Mydbases.addHistoryData();
                    status.text = varus.inFenceT + ": " + varus.timeInFenceS;
                    todday.text = varus.whatToday;
                    histor.text = varus.niceHistory;
                }
            }

            Item {
                id: varus
                property string inFence  //Stores the value where device is, e.g. Work, Home ..
                property string inFenceT  //Stores the value where device is, e.g. Work, Home ..
                property string timeInFence //Stores the time in fence in seconds
                property string timeInFenceS //Stores the time in fence String
                property string whatToday: "Invent something"
                property string niceHistory: "The whole history"
                property int hoursD //used to display status hours
                property int minutesD //Used to display status minutes
                property int secondsD //Used to display status seconds
                property string secondsDT //Used to display status seconds in text format
                property real tolerat: 40000000.0 // Used to order two locations in order
                function timeSow() {
                    hoursD = (varus.timeInFence-varus.timeInFence%3600)/3600;
                    minutesD = (varus.timeInFence-varus.timeInFence%60)/60-hoursD*60;
                    secondsD = varus.timeInFence%60
                    secondsDT = secondsD < 10 ? ("0"+ secondsD):(secondsD)
                    timeInFenceS = minutesD < 10 ? (hoursD + ":0" + minutesD + ":" + secondsDT):(hoursD + ":" + minutesD + ":" + secondsDT)
                    covTim = minutesD < 10 ? (hoursD + ":0" + minutesD):(hoursD + ":" + minutesD);
                }
            }

            Component.onCompleted: bestBus.getProperties()

            /// Counting time in each location
            Timer {
                interval: Qt.ApplicationActive ? rateAct : ratePass
                running:Qt.ApplicationActive
                repeat:true
                onTriggered: {
                    bestBus.getProperties()
                    timeri.timeInfo();
                    Mydbases.checkFences();
                }
            }

            Item {
                id : timeri
                property string timme
                property string daatta
                function timeInfo() {
                    var date0 = new Date;
                    timme = date0.getHours() + ":" + date0.getMinutes() + ":" + date0.getSeconds();
                    //timme = date0.getHours() + ":" + date0.getMinutes();
                    daatta = date0.getFullYear() + "-" + (date0.getMonth()+1) + "-" + date0.getDate();
                }
            }


        }
    }
}


