
echo converting *.wav to *.ogg 
mkdir
for /r %%i in (*.wav) do ffmpeg -y -i "%%i" -acodec libvorbis ".\%%~ni.ogg"