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
import QtPositioning 5.0
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
            Label {
                x: Theme.paddingLarge
                text: qsTr("Location now")
                color: Theme.secondaryHighlightColor
                font.pixelSize: Theme.fontSizeExtraLarge
            }

            Text {
                id: status
                color: Theme.secondaryHighlightColor
                anchors {
                    left: parent.left
                    right: parent.right
                    margins: Theme.paddingLarge
                }
                text: varus.inFence
            }

            Label {
                x: Theme.paddingLarge
                text: qsTr("GPS info")
                color: Theme.secondaryHighlightColor
                font.pixelSize: Theme.fontSizeExtraLarge
            }
            Text {
                color: Theme.secondaryHighlightColor
                anchors {
                    left: parent.left
                    right: parent.right
                    margins: Theme.paddingLarge
                }
                text: qsTr("Latitude") + ", " + qsTr("Longitude")
            }

            Text {
                color: Theme.secondaryHighlightColor
                anchors {
                    left: parent.left
                    right: parent.right
                    margins: Theme.paddingLarge
                }
                text: possu.position.coordinate.latitude + ", " + possu.position.coordinate.longitude
            }

            Label {
                x: Theme.paddingLarge
                text: qsTr("Today")
                color: Theme.secondaryHighlightColor
                font.pixelSize: Theme.fontSizeExtraLarge
            }
            Text {
                id: todday
                color: Theme.secondaryHighlightColor
                anchors {
                    left: parent.left
                    right: parent.right
                    margins: Theme.paddingLarge
                }
                text: varus.whatToday
            }

            Label {
                x: Theme.paddingLarge
                text: qsTr("GPS is on")
                color: Theme.secondaryHighlightColor
                font.pixelSize: Theme.fontSizeExtraLarge
            }

            ////Functions etc
            PositionSource {
                id: possu
                updateInterval: 1000
                active: true

                onPositionChanged: {
                    var coord = possu.position.coordinate;
                    console.log("Coordinate:", coord.longitude, coord.latitude);
                    Mydbases.checkFences();
                    status.text = varus.inFence;
                    todday.text = varus.whatToday;
                }
            }

            Item {
                id: varus
                property string inFence  //Stores the value where device is, e.g. Work, Home ..
                property string whatToday: "Invent something"
            }

            /// Counting time in each location
            Timer {
                interval:5000
                running:Qt.ApplicationActive
                repeat:true
                onTriggered: {
                    timeri.timeInfo();
                    console.log(timeri.timme)
                    Mydbases.addTodayInfo();
                }
            }

            Item {
                id : timeri
                property string timme
                property string daatta
                function timeInfo() {
                    var date0 = new Date;
                    //timme = date0.getHours() + ":" + date0.getMinutes() + ":" + date0.getSeconds();
                    timme = date0.getHours() + ":" + date0.getMinutes();
                    daatta = date0.getFullYear() + ":" + (date0.getMonth()+1) + ":" + date0.getDate();
                }
            }


        }
    }
}


