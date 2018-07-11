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


Page {
    id: page

    SilicaFlickable {
        anchors.fill: parent

        /*PullDownMenu {

            MenuItem {
                text: qsTr("Back to settings")
                onClicked: pageStack.pop()
            }
        }*/

        contentHeight: column.height

        Column {
            id: column

            width: page.width
            spacing: Theme.paddingLarge
            PageHeader {
                title: qsTr("Help")
            }

            SectionHeader { text: qsTr("Location") }
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
                text: {qsTr("On this page you can feed the location information: name, coordinates and tolerance.") + " "
                       + qsTr("Current location can be feeded with buttons.") + " "
                       + qsTr("You will see current latitude and longitude to help the feed.") + " "
                       + qsTr("If the app finds to be in two locations simultaneously, the location with a smaller size is selected for the tracking.") + "\n"
                    + qsTr("The fence thickness is used as a virtual aid to determine whether you are entering the location or leaving that.") + " "
                    + qsTr("It can be used also as an extra tolerance of the area you have entered.")
                }
            }

            SectionHeader { text: qsTr("Cell IDs") }
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
                text: {qsTr("By setting the cell information you enable the tracking to continue until you are in the cells.") + " "
                       + qsTr("That enables the tracking to continue e.g. in the buildings without GPS.") + " "
                       + qsTr("The tracking stops when you are out of the cell or enter to another location.") + " "
                       + qsTr("Perhaps you want to set a small gate area as a separate location to stop the tracking.") + "\n"
                    +qsTr("If you use CellId as primary location source, the tracking starts and stops when you are in the cells selected.")
                }
            }



//loppusulkeet
        }
    }
}
