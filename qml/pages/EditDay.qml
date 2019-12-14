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
            //spacing: Theme.paddingLarge
            PageHeader {
                id:_header
                title: qsTr("Edit day page")
            }

            //SectionHeader { text: qsTr("Location now") }
            /*Text {
                font.pixelSize: Theme.fontSizeSmall
                color: Theme.primaryColor
                wrapMode: Text.WordWrap
                width: parent.width
                anchors {
                    left: parent.left
                    right: parent.right
                    margins: Theme.paddingLarge
                }
                text: {qsTr("Location now.")
                }
            }*/

            Canvas {
                id: canvas
                width:parent.width
                height: page.height-_header.height
                property int margin : Theme.fontSizeExtraSmall

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
                    ctx.fillStyle = Qt.rgba(1, 0, 0, 1);
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
                        ctx.moveTo(i * (canvas.width/cols), 0);
                        ctx.lineTo(i * (canvas.width/cols), canvas.height);
                    }
                    ctx.stroke();

                    ctx.restore();
                }

                function drawRecordings(ctx) {
                    ctx.save();

                    ctx.fillStyle = Qt.rgba(1, 0, 0, 1);

                    ctx.fillRect(150, margin+ 0.2*height, width-200, height-2*margin);

                    ctx.stroke();

                    ctx.restore();

                }





                onPaint: {
                    var ctx = getContext("2d");
                    ctx.globalCompositeOperation = "source-over";
                    ctx.lineWidth = 2;

                    ctx.font = Theme.fontSizeExtraSmall + "px sans-serif"
                    //ctx.fillStyle = Qt.rgba(1, 0, 0, 1);
                    drawBackground(ctx);
                    drawRecordings(ctx);

                    //ctx.fillRect(150, margin, width-200, height-2*margin);
                    //ctx.font = texti
                    //ctx.fillText("0:00", 10, 200)
                }

            }


            //loppusulkeet
        }
    }
}
