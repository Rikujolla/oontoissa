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
    property string _location_name : "Prisma"
    id: page

    onStatusChanged: {
        //console.log("status")
        Mydbases.editInfo()
    }


    SilicaListView {
        id: listView2
        model: dayValues
        anchors.fill: parent

        ViewPlaceholder {
            enabled: dayValues.get(0).starttime === ""
            text: qsTr("No recordings on the day")
            hintText: qsTr("Pull down to change the day or add data manually")
        }

        PullDownMenu {

            MenuItem {
                id: button0
                text: qsTr("Add manual mark in the past")
                onClicked: {
                    pageStack.push(Qt.resolvedUrl("LocationDialog.qml"))
                }
            }

            MenuItem {
                id: button
                property string selectedDate
                function dateFormat() {
                    var tempo = new Date(selectedDate_g)
                    selectedDate = tempo.getFullYear() + "-"
                            + ((tempo.getMonth()+1) < 10 ? ("0" + (tempo.getMonth()+1)) : (tempo.getMonth()+1)) + "-"
                            + (tempo.getDate() < 10 ? ("0"+ tempo.getDate()) : tempo.getDate())
                    labeli.text = qsTr("Selected date") + ": " + tempo.toLocaleDateString();
                }
                text: qsTr("Select a date")
                onClicked: {
                    var dialog = pageStack.push(pickerComponent, {
                                                    date: new Date() // Selects current date
                                                    //date: new Date('2016/01/26') // Jun 26 2015
                                                })
                    dialog.accepted.connect(function() {
                        labeli.text = qsTr("Selected date") + ": " + dialog.dateText;
                        selectedDate = dialog.date.getFullYear() + "-"
                                + ((dialog.date.getMonth()+1) < 10 ? ("0" + (dialog.date.getMonth()+1)) : (dialog.date.getMonth()+1)) + "-"
                                + (dialog.date.getDate() < 10 ? ("0"+ dialog.date.getDate()) : dialog.date.getDate())
                        selectedDate_g = selectedDate
                        editDataUpdate.start();
                    })
                }

                Component {
                    id: pickerComponent
                    DatePickerDialog {}
                }
            }
            MenuLabel {
                id: labeli
            }

        }
        PushUpMenu {
            MenuItem {
                text: qsTr("Help")
                onClicked: pageStack.push(Qt.resolvedUrl("HelpEdit.qml"))
            }
        }


        header: PageHeader {
            title: qsTr("Edit data page")
        }
        delegate: ComboBox {
            id: listos
            visible: dayValues.get(0).starttime !== ""
            x: Theme.paddingLarge
            label: starttime + " - " + endtime + ", " + pla
            //color: delegate.highlighted ? Theme.highlightColor : Theme.primaryColor
            menu: ContextMenu {
                id:listosMenu
                MenuItem {
                    text: qsTr("Extend up")
                    onClicked: {dayValues.indexEdit=index;
                        remorseExtendUp.execute(qsTr("Extending up"), console.log("remorse") , 3000 )
                        //Mydbases.extendUpRecord();
                        //editDataUpdate.start();
                    }
                    RemorsePopup { id: remorseExtendUp
                        onTriggered: {
                            Mydbases.extendUpRecord();
                            editDataUpdate.start();
                        }
                    }
                }
                MenuItem {
                    text: qsTr("Delete")
                    onClicked: {dayValues.indexEdit=index;
                        remorseDel.execute(qsTr("Deleting"), console.log("remorse") , 3000 )
                        //Mydbases.deleteRecord();
                        //editDataUpdate.start();
                    }
                    RemorsePopup { id: remorseDel
                        onTriggered: {
                            Mydbases.deleteRecord();
                            editDataUpdate.start();
                        }
                    }
                }
                MenuItem {
                    text: qsTr("Extend down")
                    onClicked: {dayValues.indexEdit=index;
                        remorseExtendDown.execute(qsTr("Extending down"), console.log("remorse") , 3000 )
                    }
                    RemorsePopup { id: remorseExtendDown
                        onTriggered: {
                            Mydbases.extendDownRecord();
                            editDataUpdate.start();
                        }
                    }
                }
            }


        }


        VerticalScrollDecorator {}

        /*Component.onCompleted: {
            Mydbases.editInfo()
        }*/

        ListModel {
            id: dayValues
            property int indexEdit
            ListElement {
                pla: "place"
                starttime: ""
                endtime: ""
                subtotal: ""
            }
        }


        Timer {
            id: timeSelect
            interval: 500
            running: false
            repeat: false
            onTriggered: {
                var dialog1 = pageStack.push("Sailfish.Silica.TimePickerDialog", {
                                                 hour: 13,
                                                 minute: 30,
                                                 //hourMode: DateTime.TwelveHours
                                             })
                dialog1.accepted.connect(function() {
                    Mydbases.addMarkerManually(selectedDate_g, dialog1.timeText, _location_name)
                    button0.text = "Y" + dialog1.timeText
                    editDataUpdate.start();
                })
                timeSelect.stop();
            }
        }


        Timer {
            id: editDataUpdate
            interval: 60
            running: false
            repeat: false
            onTriggered: {
                dayValues.clear();
                Mydbases.editInfo();
                editDataUpdate.stop();
            }
        }

    }

    Component.onCompleted:{
        button.dateFormat()
        Mydbases.editInfo()
    }
}





