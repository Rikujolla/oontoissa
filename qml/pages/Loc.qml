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
import QtPositioning 5.2
import "dbases.js" as Mydbases


Page {
    id: page

    // To enable PullDownMenu, place our content in a SilicaFlickable
    SilicaFlickable {
        anchors.fill: parent

        // PullDownMenu and PushUpMenu must be declared in SilicaFlickable, SilicaListView or SilicaGridView
        PullDownMenu {
            MenuItem {
                text: qsTr("Delete tables")
                onClicked: pageStack.push(Qt.resolvedUrl("Del.qml"))
            }
            MenuItem {
                text: qsTr("Update values")
                onClicked: {
                    if (varis.itemis[currentIndex-1].pla == "") {
                        Mydbases.addLocation()
                    }
                    else  {Mydbases.updateLocation()}
                }
           }
        }

        PushUpMenu {
            MenuItem {
                text: qsTr("Help")
                onClicked: pageStack.push(Qt.resolvedUrl("HelpLoc.qml"))
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
                title: qsTr("Location")
            }

            Item {
                id: varis
                property string itemi //saved location in database
                property var itemis: [
                    {pla:"",els:""},
                    {pla:"",els:""},
                    {pla:"",els:""}
                ] //saved locations in database
                property string tempur //temporary string
                property int indos // currentIndex
            }

            Text {
                    id: baassi
                    text: varis.itemis[currentIndex-1].pla + ", " + varis.itemis[currentIndex-1].els
                    color: Theme.secondaryHighlightColor
                    x: Theme.paddingLarge
            }

            Text {
                text: "Location name"
                color: Theme.secondaryHighlightColor
                x: Theme.paddingLarge
            }

            TextField {
            id: neimi
            placeholderText: "Work1"
            //label: qsTr("ECO code")
            //visible: openingMode == 2
            width: page.width/2
            //validator: RegExpValidator { regExp: /^([A-E])([0-9])([0-9])$/ }
            //color: errorHighlight? "red" : Theme.primaryColor
            inputMethodHints: Qt.ImhNoPredictiveText
        }

            Text {
                    text: "Latitude"
                    color: Theme.secondaryHighlightColor
                    x: Theme.paddingLarge
                }

            Row {
                TextField {
                id: latti
                placeholderText: "63.1"
                width: page.width/2
                validator: RegExpValidator { regExp: /^\d?\d\.\d*$/ }
                color: errorHighlight? "red" : Theme.primaryColor
                inputMethodHints: Qt.ImhNoPredictiveText
                }
                Text {
                    id: lattite
                    text: possul.position.coordinate.latitude
                    color: Theme.secondaryHighlightColor
                    x: Theme.paddingLarge
                }

            }

            Text {
                    text: "Longitude"
                    color: Theme.secondaryHighlightColor
                    x: Theme.paddingLarge
                }

            Row {
                TextField {
                id: longi
                placeholderText: "24.2"
                //label: qsTr("ECO code")
                //visible: openingMode == 2
                width: page.width/2
                validator: RegExpValidator { regExp: /^\d?\d\.\d*$/ }
                color: errorHighlight? "red" : Theme.primaryColor
                inputMethodHints: Qt.ImhNoPredictiveText
                }
                Text {
                    id: longite
                    text: possul.position.coordinate.longitude
                    color: Theme.secondaryHighlightColor
                    x: Theme.paddingLarge
                }
            }

                Text {
                    text: "Size meters"
                    color: Theme.secondaryHighlightColor
                    x: Theme.paddingLarge
                }

                TextField {
                id: saissi
                placeholderText: "50"
                //label: qsTr("ECO code")
                //visible: openingMode == 2
                width: page.width/2
                validator: RegExpValidator { regExp: /^\d*\.?\d*$/ }
                color: errorHighlight? "red" : Theme.primaryColor
                inputMethodHints: Qt.ImhNoPredictiveText
                }
                Component.onCompleted: {Mydbases.populateView();
                    //varis.indos = currentIndex;
                    //console.log(varis.itemis[currentIndex-1].pla);
                }

                ////Functions etc
                PositionSource {
                    id: possul
                    updateInterval: 1000
                    active: true

                    onPositionChanged: {
                        var coord = possul.position.coordinate;
                        //console.log("Coordinate:", coord.longitude, coord.latitude);
                    }
                }

                Timer {
                    interval: Qt.ApplicationActive ? rateAct : ratePass
                    running: true && Qt.ApplicationActive
                    repeat: true
                    onTriggered: {Mydbases.populateView();
                        baassi.text = varis.itemis[currentIndex-1].pla + ", " + varis.itemis[currentIndex-1].els
                    }
                }



        }
    }
}


