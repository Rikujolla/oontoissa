/*Copyright (c) 2018, Riku Lahtinen
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

import QtQuick 2.2
import Sailfish.Silica 1.0
import QtQuick.LocalStorage 2.0
import "dbases.js" as Mydbases

Page {
    SilicaFlickable {
        anchors.fill: parent
        contentHeight: mainColumn.height
        PullDownMenu {
            MenuItem {
                text: qsTr("Edit data")
                onClicked: pageStack.push(Qt.resolvedUrl("EditData.qml"))
            }
        }

        Column {
            id: mainColumn
            width: parent.width

            PageHeader {
            title: qsTr("Show and edit data page")
            }

            SectionHeader { text: qsTr("Selected day recordings") }

            ColumnView {
                id: firstColumn
                model:dayValues_g
                width: parent.width
                itemHeight: Theme.itemSizeSmall

                delegate: ComboBox {
                    id: listos
                    x: Theme.paddingLarge
                    label: starttime + " - " + endtime + ", " + pla
                    //color: delegate.highlighted ? Theme.highlightColor : Theme.primaryColor
                    menu: ContextMenu {
                        id:listosMenu
                        MenuItem {
                                text: qsTr("Extend up")
                                onClicked: {dayValues_g.indexEdit=index;
                                    remorseExtendUp.execute(qsTr("Extending up"), console.log("remorse") , 3000 )
                                }
                                RemorsePopup { id: remorseExtendUp
                                    onTriggered: {
                                        Mydbases.extendUpRecord_n();
                                        editDataUpdate.start();
                                    }
                                }
                            }
                        MenuItem {
                            text: qsTr("Delete")
                            onClicked: {dayValues_g.indexEdit=index;
                                remorseDel.execute(qsTr("Deleting"), console.log("remorse") , 3000 )
                                //Mydbases.deleteRecord();
                                //editDataUpdate.start();
                            }
                            RemorsePopup { id: remorseDel
                                onTriggered: {
                                    Mydbases.deleteRecord_n();
                                    editDataUpdate.start();
                                }
                            }
                        }
                        MenuItem {
                                text: qsTr("Extend down")
                                onClicked: {dayValues_g.indexEdit=index;
                                    remorseExtendDown.execute(qsTr("Extending down"), console.log("remorse") , 3000 )
                                }
                                RemorsePopup { id: remorseExtendDown
                                    onTriggered: {
                                        Mydbases.extendDownRecord_n();
                                        editDataUpdate.start();
                                    }
                                }
                            }
                    }

                }
            }


            SectionHeader { text: qsTr("Subtotals of the day")}

            ColumnView {
                id: secondColumn
                model:theSubTot
                width: parent.width
                itemHeight: Theme.itemSizeSmall

                delegate: BackgroundItem {
                    width: parent.width
                    Label {
                        text: theSubTot.get(index).categor+', '+ ((theSubTot.get(index).subtot%3600 <600? (theSubTot.get(index).subtot-theSubTot.get(index).subtot%3600)/3600+':0'+(theSubTot.get(index).subtot%3600-theSubTot.get(index).subtot%60)/60 : (theSubTot.get(index).subtot-theSubTot.get(index).subtot%3600)/3600+':'+(theSubTot.get(index).subtot%3600-theSubTot.get(index).subtot%60)/60))
                        //text: theSubTot.get(index).categor
                        anchors.centerIn: parent
                    }
                }
            }

            SectionHeader { text: qsTr("The day total")}

            ColumnView {
                id: thirdColumn
                model:theDayTotal
                width: parent.width
                itemHeight: Theme.itemSizeSmall

                delegate: BackgroundItem {
                    width: parent.width
                    Label {
                        text:theDayTotal.get(0).date+', '+ ((theDayTotal.get(0).total%3600 <600? (theDayTotal.get(0).total-theDayTotal.get(0).total%3600)/3600+':0'+(theDayTotal.get(0).total%3600-theDayTotal.get(0).total%60)/60 : (theDayTotal.get(0).total-theDayTotal.get(0).total%3600)/3600+':'+(theDayTotal.get(0).total%3600-theDayTotal.get(0).total%60)/60)) + " "+qsTr("hours")
                        anchors.centerIn: parent
                    }
                }
            }
        }
        Timer {
            id: editDataUpdate
            interval: 60
            running: false
            repeat: false
            onTriggered: {
                dayValues_g.clear();
                Mydbases.editInfo_n();
                editDataUpdate.stop();
            }
        }

    }
    Component.onCompleted:{
        //firstColumn.model = 4
        Mydbases.editInfo_n()
        Mydbases.daySubTot()
        Mydbases.dayTotals()
        //console.log("test"+theDayTotal.get(0).total)
    }
}
