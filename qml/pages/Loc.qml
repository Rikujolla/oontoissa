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
import QtSystemInfo 5.0
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
                text: qsTr("Delete location")
                onClicked: {
                    remorse.execute(qsTr("Deleting"), console.log("remorse") , 3000 )
                }
                RemorsePopup { id: remorse
                onTriggered: {
                    Mydbases.delLocation()
                    pageStack.pop()
                }
                }
            }
            MenuItem {
                text: qsTr("Update values")
                onClicked: {
                    //if (varis.itemis[currentIndex-1].pla == "") {
                      //  Mydbases.addLocation()
                    //}
                    //else  {
                        Mydbases.updateLocation()
                //}
                    baassi.text = listix.get(currentIndex-1).pla + ", " + listix.get(currentIndex-1).els
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
            spacing: Theme.paddingMedium
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
                text: listix.get(currentIndex-1).pla + ", " + listix.get(currentIndex-1).els
                color: Theme.secondaryHighlightColor
                x: Theme.paddingLarge
            }

            Text {
                text: qsTr("Location name")
                color: Theme.secondaryHighlightColor
                x: Theme.paddingLarge
            }

            TextField {
                id: neimi
                placeholderText: qsTr("Work1")
                //label: qsTr("ECO code")
                //visible: openingMode == 2
                width: page.width/2
                //validator: RegExpValidator { regExp: /^([A-E])([0-9])([0-9])$/ }
                //color: errorHighlight? "red" : Theme.primaryColor
                inputMethodHints: Qt.ImhNoPredictiveText
                EnterKey.enabled: !errorHighlight
                EnterKey.iconSource: "image://theme/icon-m-enter-close"
                EnterKey.onClicked: {
                    focus = false
                    Mydbases.updateLocation()
                    baassi.text = listix.get(currentIndex-1).pla + ", " + listix.get(currentIndex-1).els
                    updateL = true
                }
            }

            Text {
                    text: qsTr("Latitude")
                    color: Theme.secondaryHighlightColor
                    x: Theme.paddingLarge
                }

            Row {
                TextField {
                    id: latti
                    placeholderText: "63.1"
                    width: page.width/2
                    validator: RegExpValidator { regExp: /^\-?\d?\d\.\d*$/ }
                    color: errorHighlight? "red" : Theme.primaryColor
                    inputMethodHints: Qt.ImhNoPredictiveText
                    EnterKey.enabled: !errorHighlight
                    EnterKey.iconSource: "image://theme/icon-m-enter-close"
                    EnterKey.onClicked: {
                        focus = false
                        Mydbases.updateLocation()
                        baassi.text = listix.get(currentIndex-1).pla + ", " + listix.get(currentIndex-1).els
                    }
                }
                Button {
                    id: lattite
                    text: possul.position.coordinate.latitude
                    color: Theme.secondaryHighlightColor
                    width:page.width/2
                    onClicked: {
                        latti.text = lattite.text
                        Mydbases.updateLocation()
                        baassi.text = listix.get(currentIndex-1).pla + ", " + listix.get(currentIndex-1).els
                    }
                }

            }
            /*
                IconButton {
                    icon.source: "image://theme/icon-m-enter-accept?" + (pressed
                                 ? Theme.highlightColor
                                 : Theme.primaryColor)
                    onClicked: console.log("Play clicked!")
                }*/

            Text {
                    text: qsTr("Longitude")
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
                    validator: RegExpValidator { regExp: /^\-?\d?\d?\d\.\d*$/ }
                    color: errorHighlight? "red" : Theme.primaryColor
                    inputMethodHints: Qt.ImhNoPredictiveText
                    EnterKey.enabled: !errorHighlight
                    EnterKey.iconSource: "image://theme/icon-m-enter-close"
                    EnterKey.onClicked: {
                        focus = false
                        Mydbases.updateLocation()
                        baassi.text = listix.get(currentIndex-1).pla + ", " + listix.get(currentIndex-1).els
                    }
                }
                Button {
                    id: longite
                    text: possul.position.coordinate.longitude
                    color: Theme.secondaryHighlightColor
                    width:page.width/2
                    onClicked: {
                        longi.text = longite.text
                        Mydbases.updateLocation()
                        baassi.text = listix.get(currentIndex-1).pla + ", " + listix.get(currentIndex-1).els
                    }
                }
            }

            Text {
                    text: qsTr("Size (meters)")
                    color: Theme.secondaryHighlightColor
                    x: Theme.paddingLarge
                }

            TextField {
                id: saissi
                placeholderText: "50"
                width: page.width/2
                validator: RegExpValidator { regExp: /^\d*\.?\d*$/ }
                color: errorHighlight? "red" : Theme.primaryColor
                inputMethodHints: Qt.ImhNoPredictiveText
                EnterKey.enabled: !errorHighlight
                EnterKey.iconSource: "image://theme/icon-m-enter-close"
                EnterKey.onClicked: {
                    focus = false
                    Mydbases.updateLocation()
                    baassi.text = listix.get(currentIndex-1).pla + ", " + listix.get(currentIndex-1).els
                }
            }

            Text {
                id:celltitle
                text: qsTr("Cell ids")
                    color: Theme.secondaryHighlightColor
                    x: Theme.paddingLarge
                }

            Row {
                TextField {
                    id: celli
                    placeholderText: "24.2"
                    width: page.width/2
                    //validator: RegExpValidator { regExp: /^\-?\d?\d?\d\.\d*$/ }
                    //color: errorHighlight? "red" : Theme.primaryColor
                    inputMethodHints: Qt.ImhNoPredictiveText
                    //EnterKey.enabled: !errorHighlight
                    EnterKey.iconSource: "image://theme/icon-m-enter-close"
                    EnterKey.onClicked: {
                        focus = false
                        Mydbases.updateLocation()
                        baassi.text = listix.get(currentIndex-1).pla + ", " + listix.get(currentIndex-1).els
                    }
                }
                Button {
                    id: cellie
                    text: tempor.sello
                    color: Theme.secondaryHighlightColor
                    width:page.width/2
                    onClicked: {
                        tempor.sello = testsell.cellId(0)
                        celli.text = cellie.text
                        //Mydbases.updateLocation()
                        //baassi.text = listix.get(currentIndex-1).pla + ", " + listix.get(currentIndex-1).els
                    }
                }
            }

            Component.onCompleted: {Mydbases.populateView();
                baassi.text = listix.get(currentIndex-1).pla + ", " + listix.get(currentIndex-1).els
                celltitle.text = qsTr("Cell ids") + listix.get(currentIndex-1).cels
            }

                ////Functions etc
                PositionSource {
                    id: possul
                    updateInterval: 1000
                    active: true
                    //preferredPositioningMethods: NonSatellitePositioningMethods

                    onPositionChanged: {
                        var coord = possul.position.coordinate;
                        tempor.sello = testsell.cellId(0)
                        //possul.position.latitudeValid ? console.log("valid") : console.log("notvalid")
                        /*
                        console.log("CellID", testsell.cellId(0))
                        console.log("MCC", testsell.homeMobileCountryCode(0))
                        console.log("MNC", testsell.homeMobileNetworkCode(0))
                        console.log("LAC", testsell.locationAreaCode(0))
                        console.log("GSM", testsell.networkSignalStrength(1,0))
                        console.log("CDMA", testsell.networkSignalStrength(2,0))
                        console.log("W-CDMA", testsell.networkSignalStrength(3,0))
                        console.log("WLAN", testsell.networkSignalStrength(4,0))
                        console.log("LAN", testsell.networkSignalStrength(5,0))
                        console.log("Bluetooth", testsell.networkSignalStrength(6,0))
                        console.log("Wimax", testsell.networkSignalStrength(7,0))
                        console.log("Lte", testsell.networkSignalStrength(8,0))
                        //*/
                    }
                }

                NetworkInfo {
                    id:testsell
                    //updateinterval:2000
                    onNetworkSignalStrengthChanged: {
                        tempor.sello = testsell.cellId(0)

                        console.log("SignalCellID", testsell.cellId(0))
                        console.log("MCC", testsell.homeMobileCountryCode(0))
                        console.log("MNC", testsell.homeMobileNetworkCode(0))
                        console.log("LAC", testsell.locationAreaCode(0))
                        console.log("GSM", testsell.networkSignalStrength(1,0))
                        console.log("CDMA", testsell.networkSignalStrength(2,0))
                        console.log("W-CDMA", testsell.networkSignalStrength(3,0))
                        console.log("WLAN", testsell.networkSignalStrength(4,0))
                        console.log("LAN", testsell.networkSignalStrength(5,0))
                        console.log("Bluetooth", testsell.networkSignalStrength(6,0))
                        console.log("Wimax", testsell.networkSignalStrength(7,0))
                        console.log("Lte", testsell.networkSignalStrength(8,0))

                    }

                    onCellIdChanged: {
                        tempor.sello = testsell.cellId(0)
                        console.log("Cellidchanged")
                    }


                }

                Item {
                id: tempor
                property int sello //temporary celllid
                property string sellotext // sellotext
                }

                ListModel {
                        id: listix
                        ListElement {
                            pla: "place"
                            els: "else"
                            cels: "cells"
                        }
                }

        }
    }
}


