/*Copyright (c) 2015-2016, Riku Lahtinen
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
/*        PullDownMenu {
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
        }*/

        // Tell SilicaFlickable the height of its content.
        contentHeight: column.height

        // Place our content in a Column.  The PageHeader is always placed at the top
        // of the page, followed by our content.
        Column {
            id: column

            width: page.width
            spacing: Theme.paddingLarge
            PageHeader {
                title: qsTr("Delete data")
            }

            SectionHeader { text: qsTr("Warning!") }
            Text {
                font.pixelSize: Theme.fontSizeSmall
                color: Theme.primaryColor
                wrapMode: Text.WordWrap
                width: parent.width
                anchors {
                    left: parent.left
                    right: parent.right
                    margins: Theme.paddingLarge
                }
                text: {qsTr("The data will be deleted without warning when buttons are pressed!")
                }
            }

            Item {
                id:deletions
                property string choice: "none"

            }

            Button {
                text: qsTr("Delete all!")
                anchors.horizontalCenter: parent.horizontalCenter
                onClicked: {
                    deletions.choice = "all";
                    Mydbases.delLocTable();
                    deletions.choice = "none";
                }
            }

            Button {
                text: qsTr("Delete times!")
                anchors.horizontalCenter: parent.horizontalCenter
                onClicked: {
                    deletions.choice = "times";
                    Mydbases.delLocTable();
                    deletions.choice = "none";
                }
            }

            Button {
                text: qsTr("Delete locations!")
                anchors.horizontalCenter: parent.horizontalCenter
                onClicked: {
                    deletions.choice = "locations";
                    Mydbases.delLocTable();
                    deletions.choice = "none";
                }
            }

            Button {
                text: qsTr("Delete cells info!")
                anchors.horizontalCenter: parent.horizontalCenter
                onClicked: {
                    deletions.choice = "cells";
                    Mydbases.delLocTable();
                    deletions.choice = "none";
                }
            }

            Button {
                text: qsTr("Delete wifi info!")
                anchors.horizontalCenter: parent.horizontalCenter
                onClicked: {
                    deletions.choice = "wifi";
                    Mydbases.delLocTable();
                    deletions.choice = "none";
                }
            }

//loppusulkeet
        }
    }
}


