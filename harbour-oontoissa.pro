# NOTICE:
#
# Application name defined in TARGET has a corresponding QML filename.
# If name defined in TARGET is changed, the following needs to be done
# to match new name:
#   - corresponding QML filename must be changed
#   - desktop icon filename must be changed
#   - desktop filename must be changed
#   - icon definition filename in desktop file must be changed
#   - translation filenames have to be changed

# The name of your application
TARGET = harbour-oontoissa

CONFIG += sailfishapp

SOURCES += src/harbour-oontoissa.cpp

OTHER_FILES += qml/harbour-oontoissa.qml \
    qml/cover/CoverPage.qml \
    rpm/harbour-oontoissa.spec \
    rpm/harbour-oontoissa.yaml \
    translations/*.ts \
    harbour-oontoissa.desktop \
    qml/pages/Today.qml \
    qml/pages/SetLocation.qml \
    qml/pages/Help.qml \
    qml/pages/About.qml \
    qml/pages/dbases.js \
    qml/pages/Loc.qml \
    qml/pages/HelpLoc.qml \
    qml/pages/HelpSetLoc.qml \
    qml/pages/Del.qml \
    qml/pages/HelpEdit.qml \
    qml/pages/EditData.qml \
    qml/pages/ShowDay.qml

SAILFISHAPP_ICONS = 86x86 108x108 128x128 172x172 256x256

# to disable building translations every time, comment out the
# following CONFIG line
CONFIG += sailfishapp_i18n

# German translation is enabled as an example. If you aren't
# planning to localize your app, remember to comment out the
# following TRANSLATIONS line. And also do not forget to
# modify the localized app name in the the .desktop file.
TRANSLATIONS += translations/harbour-oontoissa-de.ts \
    translations/harbour-oontoissa-fi.ts \
    translations/harbour-oontoissa-zh_cn.ts \
    translations/harbour-oontoissa-fr.ts \
    translations/harbour-oontoissa-nl.ts \
    translations/harbour-oontoissa-nl_be.ts \
    translations/harbour-oontoissa-sv.ts \
    translations/harbour-oontoissa-ru.ts \
    translations/harbour-oontoissa-it.ts

DISTFILES += \
    qml/pages/EditDay.qml \
    qml/pages/LocationDialog.qml \
    rpm/harbour-oontoissa.changes \
    qml/pages/inertianav.js
