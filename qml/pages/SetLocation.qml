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
    SilicaListView {
        id: listView
        model: listix
        anchors.fill: parent

        PullDownMenu {
            /*MenuItem {
                text: qsTr("Data maintenance")
                onClicked: pageStack.push(Qt.resolvedUrl("Del.qml"))
            }*/
            /*MenuItem {
                text: qsTr("Export location")
                onClicked:{
                    console.log("export")
                }
            }
            MenuItem {
                text: qsTr("Import location")
                onClicked:{
                    console.log("import")
                }
            }*/
            MenuItem {
                text: qsTr("Add location")
                onClicked:{
                    currentIndex = listSize+1;
                    listSize++;
                    pageStack.push(Qt.resolvedUrl("Loc.qml"))
                }
            }
        }
        PushUpMenu {
            MenuItem {
                text: qsTr("Help")
                onClicked: pageStack.push(Qt.resolvedUrl("HelpSetLoc.qml"))
            }
        }


        header: PageHeader {
            title: qsTr("Set location page")
        }
        delegate: BackgroundItem {
            id: delegate

            Label {
                id: listos
                x: Theme.paddingLarge
                text: qsTr("Location") + " " + (index+1) + ": " + pla
                anchors.verticalCenter: parent.verticalCenter
                color: delegate.highlighted ? Theme.highlightColor : Theme.primaryColor
            }
            onClicked: {
                currentIndex = index+1;
                pageStack.push(Qt.resolvedUrl("Loc.qml"))
            }
        }
        VerticalScrollDecorator {}

        Component.onCompleted: {
            Mydbases.loadLocation()
        }

        Timer {
            id: seloTim
            interval: rateAct
            //running: Qt.application.active
            running: false
            repeat: false
            onTriggered: {
                Mydbases.loadLocation()
                //updateL = false
                //console.log("Select Location Timer")
            }
        }
    }
}





