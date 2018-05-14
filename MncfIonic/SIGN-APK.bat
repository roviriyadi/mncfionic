@echo on
D:
CD D:\Documents\MncMobileProjects\MncfIonic\
del mncfdroid-wkwebview-arm.apk
del mncfdroid-wkwebview-x86.apk
move "D:\Documents\MncMobileProjects\MncfIonic\platforms\android\build\outputs\apk\android-release-unsigned.apk" "D:\Documents\MncMobileProjects\MncfIonic\i-prove.apk"
jarsigner -verbose -keystore "D:\Documents\MncMobileProjects\MncfIonic\rovidroid.keystore" -storepass romi30092012 -keypass romi30092012 "D:\Documents\MncMobileProjects\MncfIonic\i-prove.apk" rovidroid
del "D:\Documents\MncMobileProjects\Publish\Apk\i-prove.apk"
copy i-prove.apk "D:\Documents\MncMobileProjects\Publish\Apk\i-prove.apk"
