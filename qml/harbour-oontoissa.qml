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
    property int ratePass: 15000 // Timers update when application not active but tracking
    property int rateSleep: 58000 // Timers when nothing happens, long away from tracking areas
    property string covLoc: "Test"  // Cover location display
    property string covTim: "07:12" // Cover Time display
    property bool updateL : true // Used to run timers once, obsolete??
    property int currentCell //saves current cell number globally
    property string currentWifi // Maybe later var array to enable multiple wifis
    property real fenceThickness : 50.0 //Utilized ec to stop cell facilitated tracking
    property int saveLag : 50 // Used to postpone saving the values in unstable conditions
    property int saveDecr: 1//Decrement for saveLag
    property string gpsTxt : qsTr("Do not use GPS")
    property bool gpsTrue : true
    property int newStatus // Saving old status
    property int prevStatus // Saving old status
    property string extraMsg
    property bool marker : false // Sets the marker, either breaks the data or if not in apaddock sets marker label

    /*NetworkInfo { // Make multiple signals possible
        id : bestcell
    }*/

    PositionSource {
        id: possut
        updateInterval: Qt.application.active ? rateAct : ratePass/2
        active: gpsTrue
    }

    DBusInterface {
        // Motivated ny shell script https://together.jolla.com/question/24943/howto-retrieve-gsm-cell-coordinates/
        // and other valuable discussions at devel@lists.sailfishos.org and elsewhere
        id: bestBus
        bus: DBus.SystemBus
        service: 'org.ofono'
        iface: 'org.ofono.NetworkRegistration'
        path: '/ril_0'

        signalsEnabled: true

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
        //service: 'com.jolla'
        iface: 'net.connman.Manager'
        //iface: 'com.jolla.Connectiond'
        //path: '/Connectiond'
        path: '/'
        //path: '/net/connman/technology/wifi'
        //path: '/net/connman/service/'
        property string one_name
        property string two_name
        property var wifi_name
        property var wifi_status
        property int wifi_bool
        property var tringi

        signalsEnabled: true

        //https://github.com/aldebaran/connman/blob/master/doc/service-api.txt
        function propertyChanged(name, value){
            console.log("signals2")
            if (name == "Name") {console.log("sig", value)}
        }

        function replacer(key, value) {
          //if (key != "Name") {
            if (typeof value === "number") {
                return undefined;
            }
            return value;
            //return vvlue;
        }


        function getServices() {
            typedCall('GetServices',[],
                      //typedCall('GetTechnologies',[],
                      function(result) {
                          wifis.clear();
                          //console.log("Wifi found ", JSON.stringify(result)); //OK
                          //console.log("Wifi found ", JSON.stringify(result, ['Name'])); //OK
                          one_name = JSON.stringify(result, ['Name', 'State']) //OK
                          //two_name = JSON.stringify(result, replacer) //OK
                          tringi = one_name.split(":")
                          //console.log(tringi)
                          //console.log(tringi.length)
                          for (var i =1; i<tringi.length; i=i+2 ){
                              //console.log(tringi[i-1].indexOf("wifi"))
                              if (tringi[i-1].indexOf("wifi") > -1){
                                  wifi_name = tringi[i].split(",")
                                  wifi_name = wifi_name[0]
                                  wifi_name = wifi_name.replace("\"", "")
                                  wifi_name = wifi_name.replace("\"", "")
                                  wifi_status = tringi[i+1].split("}")
                                  wifi_status = wifi_status[0]
                                  wifi_status = wifi_status.replace("\"", "")
                                  wifi_status = wifi_status.replace("\"", "")
                                  //console.log (wifi_name, wifi_status)
                                  if (wifi_status == "online") {wifi_bool = 1} else {wifi_bool = 0};
                                  wifis.append({"name":wifi_name, "activity":wifi_status, "actbool":wifi_bool})
                              }
                          }
                          //console.log(wifis.get(0).name)
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
                lat: 60.1
                lon: 23.1
            }
    }

    ListModel {
        id:wifis
        ListElement {
            name:""
            activity:""
            actbool:0
        }
    }
}


