#!/bin/sh
rm uBoulder.apk
cordova build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore uboulder.keystore platforms/android/ant-build/uBoulder-release-unsigned.apk uboulder
zipalign -v 4 platforms/android/ant-build/uBoulder-release-unsigned.apk uBoulder.apk
exit 0
