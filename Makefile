all: release upload say

clean:
	rm -f ServiceGas.apk

release: clean build sign zipalign

build:
	cordova build --release android

sign:
	jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk alias_name

zipalign:
	zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk ServiceGas.apk

upload:
	cp ServiceGas.apk ~/Dropbox/bro/

say:
	say "Job is done"

all-debug: build-debug upload-debug say
build-debug:
	cordova build android
upload-debug:
	cp platforms/android/build/outputs/apk/android-debug.apk ~/Dropbox/ForMe/
