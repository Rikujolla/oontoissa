/*Copyright (c) 2019, Riku Lahtinen
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
import "dbases.js" as Mydbases //RLAH
import QtQuick.LocalStorage 2.0 //RLAH


Page {
    id: page

    onStatusChanged: {
        //console.log("status", page.status)
        if (page.status == 2) {
            Mydbases.getDayMinutes(selectedDate_g)
            canvas.clear();
        }
    }

    SilicaFlickable {
        anchors.fill: parent

        PullDownMenu {

            MenuItem {
                text: qsTr("Edit data")
                onClicked: pageStack.push(Qt.resolvedUrl("EditData.qml"))
            }
            MenuItem {
                text: qsTr("Show day data")
                onClicked:  {
                    pageStack.replace(Qt.resolvedUrl("ShowDay.qml"))
                }

            }
        }

        contentHeight: column.height

        Column {
            id: column

            width: page.width
            //spacing: Theme.paddingLarge
            PageHeader {
                id:_header
                title: qsTr("Show day graphics")
            }

            Canvas {
                id: canvas
                width:parent.width
                height: page.height-_header.height
                property int margin : Theme.fontSizeExtraSmall

                function clear() {
                    var ctx = getContext("2d");
                    ctx.reset();
                    canvas.requestPaint()
                }
                function drawBackground(ctx)
                {
                    ctx.save();

                    // clear previous plot
                    ctx.clearRect(0,0,canvas.width, canvas.height);

                    // fill translucent background
                    // ctx.fillStyle = Qt.rgba(0,0,0,0.5);
                    // ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // draw grid lines
                    ctx.strokeStyle = Qt.rgba(1,1,1,0.3);
                    ctx.fillStyle = Theme.secondaryColor;
                    ctx.beginPath();

                    var cols = 1.0;
                    var rows = 24.0;

                    for (var i = 0; i < rows+1; i++)
                    {
                        ctx.moveTo(0, i * ((canvas.height-2*margin)/rows) + Theme.fontSizeExtraSmall);
                        ctx.lineTo(canvas.width, i * ((canvas.height-2*margin)/rows)+ Theme.fontSizeExtraSmall);
                        ctx.fillText(i+":00", 10, i * ((canvas.height-2*margin)/rows) + 1.35 *Theme.fontSizeExtraSmall)
                    }
                    for (i = 0; i < cols; i++)
                    {
                        ctx.moveTo(i * (width/cols), 0);
                        ctx.lineTo(i * (width/cols), height);
                    }
                    ctx.stroke();
                    ctx.restore();
                }

                function drawRecordings(ctx) {
                    ctx.save();

                    ctx.fillStyle = "blue"; //Later to be made selectable

                    for (var i = 0; i < dayDraw.count; i++)
                    {
                        ctx.fillRect(0.17*width, margin+ dayDraw.get(i).start_time*(height-2*margin)/1440, 0.78*width, (dayDraw.get(i).end_time-dayDraw.get(i).start_time)*(height-2*margin)/1440);
                        //console.log(height, margin, dayDrawValues.get(i).start_time, margin+dayDrawValues.get(i).start_time*(height-2*margin)/1440)
                        //console.log(height, margin, dayDrawValues.get(i).end_time, margin+dayDrawValues.get(i).end_time*(height-2*margin)/1440)
                    }
                    ctx.stroke();
                    ctx.restore();

                }

                function drawTexts(ctx) {
                    ctx.save();

                    ctx.fillStyle = Theme.primaryColor;

                    for (var i = 0; i < dayDraw.count; i++)
                    {
                        ctx.fillText(dayDraw.get(i).name, 0.2*width + width*(i%3)/5, margin+ dayDraw.get(i).start_time*(height-2*margin)/1440+ (dayDraw.get(i).end_time-dayDraw.get(i).start_time)*(height-2*margin)/1440/2+ 0.35 *Theme.fontSizeExtraSmall)
                    }
                    ctx.stroke();
                    ctx.restore();

                }




                onPaint: {

                    var ctx = getContext("2d");
                    ctx.globalCompositeOperation = "source-over";
                    ctx.lineWidth = 2;

                    ctx.font = Theme.fontSizeExtraSmall + "px sans-serif"

                    drawBackground(ctx);
                    drawRecordings(ctx);
                    drawTexts(ctx);
                }
            }

            ListModel {
                id:dayDraw
                ListElement {
                    start_time: 120
                    end_time: 180
                    name:""
                }

            }

            Component.onCompleted: {
                Mydbases.getDayMinutes(selectedDate_g)
                Mydbases.editInfo_n()
            }

            //loppusulkeet
        }
    }
}
