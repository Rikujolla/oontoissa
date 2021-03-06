/*Copyright (c) 2015-2020, Riku Lahtinen
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

            Row {
                x: Theme.paddingLarge
                spacing: Theme.paddingMedium

                Text {
                    text: qsTr("Location name")
                    color: Theme.secondaryHighlightColor
                    x: Theme.paddingLarge
                    font.pixelSize: Theme.fontSizeSmall
                    width:page.width/2
                    wrapMode: Text.WordWrap
                }

                TextField {
                    id: neimi
                    placeholderText: qsTr("Work1")
                    width: page.width/2
                    //wrapMode:Text.WordWrap
                    inputMethodHints: Qt.ImhNoPredictiveText
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
                spacing: Theme.paddingMedium
                Text {
                    text: qsTr("Location size (m)")
                    color: Theme.secondaryHighlightColor
                    x: Theme.paddingLarge
                    font.pixelSize: Theme.fontSizeSmall
                    width:page.width/2
                    wrapMode: Text.WordWrap
                }

                TextField {
                    id: saissi
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
                spacing: Theme.paddingMedium
                Text {
                    text: qsTr("Fence thickness (m)")
                    color: Theme.secondaryHighlightColor
                    x: Theme.paddingLarge
                    font.pixelSize: Theme.fontSizeSmall
                    width:page.width/2
                    wrapMode: Text.WordWrap
                }

                TextField {
                    id: fence
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
                spacing: Theme.paddingMedium
                visible: false
                Text {
                    text: qsTr("Location color")
                    color: Theme.secondaryHighlightColor
                    x: Theme.paddingLarge
                    font.pixelSize: Theme.fontSizeSmall
                    width:page.width/2
                    wrapMode: Text.WordWrap
                }

                BackgroundItem {
                    width:page.width/3
                    height:Theme.fontSizeSmall
                    onClicked: {
                        var dialog = pageStack.push("Sailfish.Silica.ColorPickerDialog")
                        dialog.accepted.connect(function() {
                            color_box.color = dialog.color
                        })
                    }
                    Rectangle{
                        id:color_box
                        width:page.width/3
                        height:Theme.fontSizeSmall
                        color: "blue"
                    }
                }
            }



            ///////////////////////////////////////
            /// GPS-section
            ///////////////////////////////////
            BackgroundItem {
                SectionHeader {
                    text: tempor.gpsVisible ? qsTr("Minimize GPS info view") : qsTr("Show and set GPS info")
                }
                onClicked: tempor.gpsVisible = !tempor.gpsVisible
            }

            Text {
                id: baassi
                width: page.width*9/10
                text: listix.get(currentIndex-1).pla + ", " + listix.get(currentIndex-1).els
                visible: tempor.gpsVisible
                color: Theme.secondaryHighlightColor
                x: Theme.paddingLarge
                font.pixelSize: Theme.fontSizeSmall
                wrapMode: Text.WordWrap
            }

            Text {
                text: qsTr("Latitude")
                visible: tempor.gpsVisible
                color: Theme.secondaryHighlightColor
                x: Theme.paddingLarge
                font.pixelSize: Theme.fontSizeSmall
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
                font.pixelSize: Theme.fontSizeSmall
            }

            Row {
                visible: tempor.gpsVisible
                TextField {
                    id: longi
                    placeholderText: "24.2"
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

            //////////////////
            /// Cells section
            //////////////////
            BackgroundItem {
                SectionHeader {
                    text: tempor.cellsVisible ? qsTr("Minimize cells info view") : qsTr("Show and set cells info")
                }
                onClicked: tempor.cellsVisible = !tempor.cellsVisible
            }

            TextSwitch { // Sometimes need manual update
                id: sellPri
                text: qsTr("Use CellId as a primary location source")
                visible : tempor.cellsVisible
                automaticCheck:false
                onClicked: {
                    checked ? checked = false : checked = true
                    Mydbases.updateLocation()
                }
            }

            Text {
                id:celltitle
                text: tempor.selltitleBase
                color: Theme.secondaryHighlightColor
                x: Theme.paddingLarge
                font.pixelSize: Theme.fontSizeSmall
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
                        cellie.text = currentCell
                        celli.text = cellie.text
                        Mydbases.updateLocation()
                        celltitle.text = tempor.selltitleBase + listix.get(currentIndex-1).cels
                    }
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

            ////////////////////////////
            // Wifi settings section
            ////////////////////////////
            BackgroundItem {
                SectionHeader {
                    text: tempor.wifiVisible ? qsTr("Minimize wifi info view") : qsTr("Show and set wifi info")
                }
                onClicked: tempor.wifiVisible = !tempor.wifiVisible
            }

            TextSwitch {
                id: wifiAct
                //visible: false  //maybe removing this switch in future
                text: qsTr("Require wifi to be online")
                visible : tempor.wifiVisible
                checked: tempor.wifiActiveReq
                automaticCheck:false
                onClicked: {
                    checked ? checked = false : checked = true
                    Mydbases.updateLocation()
                }
            }

            Text {
                id:wifisSelected
                //text: qsTr("Selected wifis") + ": " + wifi.text
                text: qsTr("Selected wifis") + ": " + currentWifi
                color: Theme.secondaryHighlightColor
                x: Theme.paddingLarge
                font.pixelSize: Theme.fontSizeSmall
                width: page.width*9/10
                wrapMode: Text.WordWrap
                visible: tempor.wifiVisible
            }

            Text {
                id:wifisAvailable
                text: qsTr("Available wifis") + ": "
                color: Theme.secondaryHighlightColor
                x: Theme.paddingLarge
                font.pixelSize: Theme.fontSizeSmall
                width: page.width*9/10
                wrapMode: Text.WordWrap
                visible: tempor.wifiVisible
            }

            Row {
                visible: tempor.wifiVisible
                TextField {
                    id: wifi
                    placeholderText: "Saunalahti"
                    label: qsTr("Write wifi station name") //too long
                    width: page.width*3/4
                    //validator: RegExpValidator { regExp: /^\d{1,10}$/ }
                    //validator: wifi.text.length() > 0
                    color: errorHighlight? "red" : Theme.primaryColor
                    inputMethodHints: Qt.ImhNoPredictiveText
                    EnterKey.enabled: !errorHighlight
                    EnterKey.iconSource: "image://theme/icon-m-enter-close"
                    EnterKey.onClicked: {
                        focus = false
                        currentWifi = wifi.text
                        Mydbases.updateLocation()
                    }
                }
                Text {
                    id: wifi_strength
                    text: ""
                    width: page.width*1/8
                }

            }
            Row {
                id: strength_row
                visible: tempor.wifiVisible
                property int text_low: 0
                property int text_high: 0

            TextField {
                id: wifi_low
                placeholderText: "50"
                //: Limited size to tell to input wifi strength low value
                label: qsTr("Low strength")
                labelVisible: true
                width: page.width*3/7
                validator: IntValidator { bottom: 0; top: 99 }
                color: errorHighlight? "red" : Theme.primaryColor
                inputMethodHints: Qt.ImhNoPredictiveText
                EnterKey.enabled: !errorHighlight
                EnterKey.iconSource: "image://theme/icon-m-enter-close"
                EnterKey.onClicked: {
                    focus = false
                    strength_row.text_low = wifi_low.text
                    strength_row.text_high = wifi_high.text
                    if (strength_row.text_high < strength_row.text_low +1) {
                        strength_row.text_high = strength_row.text_low +1
                        wifi_high.text = strength_row.text_low +1
                    }
                    Mydbases.updateLocation()
                }
            }
            TextField {
                id: wifi_high
                placeholderText: "90"
                //: Limited size to tell to input wifi strength high value
                label: qsTr("High strength")
                width: page.width*3/7
                validator: IntValidator { bottom: 1; top: 100 }
                color: errorHighlight? "red" : Theme.primaryColor
                inputMethodHints: Qt.ImhNoPredictiveText
                EnterKey.enabled: !errorHighlight
                EnterKey.iconSource: "image://theme/icon-m-enter-close"
                EnterKey.onClicked: {
                    focus = false
                    strength_row.text_low = wifi_low.text
                    strength_row.text_high = wifi_high.text
                    if (strength_row.text_low > strength_row.text_high - 1) {
                        strength_row.text_low = strength_row.text_high - 1
                        wifi_low.text = strength_row.text_high - 1
                    }
                    Mydbases.updateLocation()
                }
            }
            }

            Button {
                id: wifie
                visible: false
                text: "Scroll"
                color: Theme.secondaryHighlightColor
                width:page.width/2
                onClicked: {
                    Mydbases.updateLocation()
                }
            }

            Component.onCompleted: {
                bestBus.getProperties()
                wifiBus.getServices()
                Mydbases.populateView();
                baassi.text = listix.get(currentIndex-1).pla + ", " + listix.get(currentIndex-1).els
                celltitle.text = tempor.selltitleBase + listix.get(currentIndex-1).cels
                cellie.text = currentCell
            }

            ////Functions etc

            Timer { //ensures the cellinfo to be get if GPS is not locating
                interval: ratePass
                repeat: true
                running: Qt.application.active
                onTriggered: {
                    //bestBus.getProperties()
                    cellie.text = currentCell
                    //Mydbases.populateView(); //problems with this in the location name feed
                    /*wifisAvailable.text = qsTr("Available wifis") + ": "
                        for (i=0; i<wifis.count; i++) {
                            var j = wifis.count-1
                            if (i == j) {
                                wifisAvailable.text += wifis.get(i).name;
                            }
                            else {
                                wifisAvailable.text += wifis.get(i).name + ", ";
                            }
                        }*/


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
                property bool wifiActiveReq :true // Require wifi to be active if used in tracking
            }

            ListModel {
                id: cellistit
                ListElement {
                    cels: 0
                }
            }
        }


    }
}


