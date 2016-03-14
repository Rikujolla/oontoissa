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
                    Mydbases.updateLocation()
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

            Row {
                x: Theme.paddingLarge

                Text {
                    text: qsTr("Location name")
                    color: Theme.secondaryHighlightColor
                    x: Theme.paddingLarge
                    width:page.width/2
                    wrapMode: Text.WordWrap
                }

                TextArea {
                    id: neimi
                    placeholderText: qsTr("Work1")
                    width: page.width/2
                    wrapMode:Text.Wrap
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
            }

            Row {
                x: Theme.paddingLarge
                Text {
                    text: qsTr("Location size (m)")
                    //visible: tempor.gpsVisible
                    color: Theme.secondaryHighlightColor
                    x: Theme.paddingLarge
                    width:page.width/2
                    wrapMode: Text.WordWrap
                }

                TextField {
                    id: saissi
                    //visible: tempor.gpsVisible
                    placeholderText: "50"
                    width: page.width/2
                    validator: RegExpValidator { regExp: /^\d*\.?\d*$/ }
                    color: errorHighlight? "red" : Theme.primaryColor
                    inputMethodHints: Qt.ImhDigitsOnly
                    EnterKey.enabled: !errorHighlight
                    EnterKey.iconSource: "image://theme/icon-m-enter-close"
                    EnterKey.onClicked: {
                        focus = false
                        Mydbases.updateLocation()
                        baassi.text = listix.get(currentIndex-1).pla + ", " + listix.get(currentIndex-1).els
                    }
                }
            }

            Row {
                x: Theme.paddingLarge
                Text {
                    text: qsTr("Fence thickness (m)")
                    //visible: tempor.gpsVisible
                    color: Theme.secondaryHighlightColor
                    x: Theme.paddingLarge
                    width:page.width/2
                    wrapMode: Text.WordWrap
                }

                TextField {
                    id: fence
                    //visible: tempor.gpsVisible
                    placeholderText: "50"
                    width: page.width/2
                    validator: RegExpValidator { regExp: /^\d*\.?\d*$/ }
                    color: errorHighlight? "red" : Theme.primaryColor
                    inputMethodHints: Qt.ImhDigitsOnly
                    EnterKey.enabled: !errorHighlight
                    EnterKey.iconSource: "image://theme/icon-m-enter-close"
                    EnterKey.onClicked: {
                        focus = false
                        Mydbases.updateLocation()
                        baassi.text = listix.get(currentIndex-1).pla + ", " + listix.get(currentIndex-1).els
                    }
                }
            }

            TextSwitch {
                text: "Show and set GPS info"
                onCheckedChanged: tempor.gpsVisible = !tempor.gpsVisible
            }

            Text {
                id: baassi
                width: page.width*9/10
                text: listix.get(currentIndex-1).pla + ", " + listix.get(currentIndex-1).els
                visible: tempor.gpsVisible
                color: Theme.secondaryHighlightColor
                x: Theme.paddingLarge
                wrapMode: Text.WordWrap
            }

            Text {
                    text: qsTr("Latitude")
                    visible: tempor.gpsVisible
                    color: Theme.secondaryHighlightColor
                    x: Theme.paddingLarge
                }

            Row {
                visible: tempor.gpsVisible
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
                    text: possut.position.coordinate.latitude
                    color: Theme.secondaryHighlightColor
                    width:page.width/2
                    onClicked: {
                        latti.text = lattite.text
                        Mydbases.updateLocation()
                        baassi.text = listix.get(currentIndex-1).pla + ", " + listix.get(currentIndex-1).els
                    }
                }

            }


            Text {
                    text: qsTr("Longitude")
                    visible: tempor.gpsVisible
                    color: Theme.secondaryHighlightColor
                    x: Theme.paddingLarge
                }

            Row {
                visible: tempor.gpsVisible
                TextField {
                    id: longi
                    placeholderText: "24.2"
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
                    text: possut.position.coordinate.longitude
                    color: Theme.secondaryHighlightColor
                    width:page.width/2
                    onClicked: {
                        longi.text = longite.text
                        Mydbases.updateLocation()
                        baassi.text = listix.get(currentIndex-1).pla + ", " + listix.get(currentIndex-1).els
                    }
                }
            }


            //SectionHeader { text: qsTr("Cells info") }
            // Cells section
            TextSwitch {
                text: "Show and set cells info"
                onCheckedChanged: tempor.cellsVisible = !tempor.cellsVisible
            }

            TextSwitch {
                id: sellPri
                text: qsTr("Use CellId as a primary location source")
                visible : tempor.cellsVisible
                onCheckedChanged: {
                    checked ? tempor.cellPriori = true : tempor.cellPriori = false
                    console.log(tempor.cellPriori)
                    Mydbases.updateLocation()
                }
            }

            Text {
                id:celltitle
                text: tempor.selltitleBase
                color: Theme.secondaryHighlightColor
                x: Theme.paddingLarge
                width: page.width*9/10
                wrapMode: Text.WordWrap
                visible: tempor.cellsVisible
                }

            Row {
                visible: tempor.cellsVisible
                TextField {
                    id: celli
                    placeholderText: "243546"
                    width: page.width/2
                    validator: RegExpValidator { regExp: /^\d{1,10}$/ }
                    color: errorHighlight? "red" : Theme.primaryColor
                    inputMethodHints: Qt.ImhNoPredictiveText
                    EnterKey.enabled: !errorHighlight
                    EnterKey.iconSource: "image://theme/icon-m-enter-close"
                    EnterKey.onClicked: {
                        focus = false
                        Mydbases.updateLocation()
                        celltitle.text = tempor.selltitleBase + listix.get(currentIndex-1).cels
                    }
                }
                Button {
                    id: cellie
                    text: tempor.sello
                    color: Theme.secondaryHighlightColor
                    width:page.width/2
                    onClicked: {
                        tempor.sello = currentCell
                        celli.text = cellie.text
                        Mydbases.updateLocation()
                        celltitle.text = tempor.selltitleBase + listix.get(currentIndex-1).cels
                    }
                }
            }

            // Wifi settings section
            TextSwitch {
                text: "Show and set wifi info"
                onCheckedChanged: tempor.wifiVisible = !tempor.wifiVisible
            }

            TextSwitch {
                id: wifiAct
                text: qsTr("Request wifi to be active")
                visible : tempor.wifiVisible
                onCheckedChanged: {
                    checked ? tempor.wifiActiveReq = true : tempor.wifiActiveReq = false
                    console.log(tempor.wifiActiveReq)
                    Mydbases.updateLocation()
                }
            }

            Text {
                id:wifisSelected
                text: "Selected wifis" + " :"
                color: Theme.secondaryHighlightColor
                x: Theme.paddingLarge
                width: page.width*9/10
                wrapMode: Text.WordWrap
                visible: tempor.wifiVisible
                }

            Text {
                id:wifisAvailable
                text: "Available wifis" + " :"
                color: Theme.secondaryHighlightColor
                x: Theme.paddingLarge
                width: page.width*9/10
                wrapMode: Text.WordWrap
                visible: tempor.wifiVisible
                }

            Row {
                visible: tempor.wifiVisible
                TextField {
                    id: wifi
                    placeholderText: "Saunalahti"
                    label: "Wifi station name" //does not work
                    width: page.width/2
                    //validator: RegExpValidator { regExp: /^\d{1,10}$/ }
                    //validator: wifi.text.length() > 0
                    color: errorHighlight? "red" : Theme.primaryColor
                    inputMethodHints: Qt.ImhNoPredictiveText
                    EnterKey.enabled: !errorHighlight
                    EnterKey.iconSource: "image://theme/icon-m-enter-close"
                    EnterKey.onClicked: {
                        focus = false
                        Mydbases.updateLocation()
                        //celltitle.text = tempor.selltitleBase + listix.get(currentIndex-1).cels
                    }
                }
                Button {
                    id: wifie
                    //text: tempor.sello
                    visible: false
                    text: "Update"
                    color: Theme.secondaryHighlightColor
                    width:page.width/2
                    onClicked: {
                        //tempor.sello = currentCell
                        //celli.text = cellie.text
                        Mydbases.updateLocation()
                        //celltitle.text = tempor.selltitleBase + listix.get(currentIndex-1).cels
                    }
                }
            }

            Component.onCompleted: {
                bestBus.getProperties()
                wifiBus.getServices()
                Mydbases.populateView();
                baassi.text = listix.get(currentIndex-1).pla + ", " + listix.get(currentIndex-1).els
                celltitle.text = tempor.selltitleBase + listix.get(currentIndex-1).cels
                cellie.text = currentCell
                //sellPri.checked = true
            }

                ////Functions etc
            Connections {
                target: possut
                    onPositionChanged: {
                        tempor.sello = currentCell
                    }
                }

                Timer { //ensures the cellinfo to be get if GPS is not locating
                    interval: ratePass
                    repeat: true
                    running: true && Qt.ApplicationActive
                    onTriggered: {
                        bestBus.getProperties()
                        cellie.text = currentCell
                        //wifiBus.getProperties()

                    }
                }

                Item {
                id: tempor
                property int sello //temporary celllid
                property string sellotext // sellotext
                property int ind
                property string selltitleBase : qsTr("Cell IDs") //
                property int backHeight : 300 // Height of backround Item
                property bool gpsVisible : false
                property bool cellsVisible : false
                property bool wifiVisible : false
                property bool cellPriori :false
                property bool wifiActiveReq :false // Requests wifi to be active if used in tracking
                }

                ListModel {
                        id: cellistit
                        ListElement {
                            cels: 0
                        }
                }
                BackgroundItem {
                    width: page.width
                    height: tempor.backHeight
                    visible: tempor.cellsVisible
                GridView {
                    id: grid
                    cellWidth: page.width
                    cellHeight: page.width/8
                    anchors.fill: parent
                    model: cellistit
                    delegate:
                        Button {
                        text: qsTr("Delete") + " " + cels
                        onClicked: {
                            tempor.ind = index
                            Mydbases.delCelli()
                        }
                    }
                }
                }
        }


    }
}


