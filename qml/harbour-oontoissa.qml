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
import QtPositioning 5.2
import org.nemomobile.dbus 2.0
import "pages"

ApplicationWindow
{
    initialPage: Component { Today { } }
    cover: Qt.resolvedUrl("cover/CoverPage.qml")
    allowedOrientations: Orientation.All
    _defaultPageOrientations: Orientation.All

    property int currentIndex: 1 //
    property int listSize: 0 //
    property int rateAct: 900 // Timers update rate when active
    property int ratePass: 10000 // Timers update when application not active
    property string covLoc: "Test"  // Cover location display
    property string covTim: "07:12" // Cover Time display
    property bool updateL : true //
    property int currentCell //saves current cell number globally
    property real fenceThickness : 50.0 //Utilized ec to stop cell facilitated tracking

    /*NetworkInfo { // Make multiple signals possible
        id : bestcell
    }*/

    PositionSource {
        id: possut
        updateInterval: Qt.ApplicationActive ? rateAct : ratePass
        active: true
    }

    DBusInterface {
        // Motivated ny shell script https://together.jolla.com/question/24943/howto-retrieve-gsm-cell-coordinates/
        // and other valuable discussions at devel@lists.sailfishos.org and elsewhere
        id: bestBus
        bus: DBus.SystemBus
        service: 'org.ofono'
        iface: 'org.ofono.NetworkRegistration'
        path: '/ril_0'

        function getProperties() {
            typedCall('GetProperties',[],
                      function(result) {
                          //console.log('call completed with:', result.Status,
                          //result.Mode, result.CellId, result.Technology, result.MobileCountryCode,
                          //result.MobileNetworkCode, result.Name, result.Strength);
                          currentCell = result.CellId;
                          //console.log("CellId found ", currentCell);
                      },
                      function() { console.log('call failed') })
        }
    }

    DBusInterface {
        // Under construction
        id: wifiBus
        bus: DBus.SystemBus
        service: 'net.connman'
        iface: 'net.connman.Manager'
        path: '/'
        //path: '/net/connman/technology/wifi'

        function getProperties() {
            typedCall('GetTechnologies',[],
                      function(result) {
                          //console.log('call completed with:', result.Status,
                          //result.Mode, result.CellId, result.Technology, result.MobileCountryCode,
                          //result.MobileNetworkCode, result.Name, result.Strength);
                          //currentCell = result.CellId;
                          console.log("Wifi found ", result.Type);
                      },
                      function() { console.log('call failed') })
        }
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


