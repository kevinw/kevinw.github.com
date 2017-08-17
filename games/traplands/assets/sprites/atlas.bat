@setlocal
@set ASEPRITE="%USERPROFILE%\Aseprite-v1.2-beta12\aseprite.exe"

@set OUTPUT_NAME=sprite_atlas
@set OUTPUT_PNG=%OUTPUT_NAME%.png
@set OUTPUT_JSON=%OUTPUT_NAME%.json

cd %~dp0
%ASEPRITE% -b ase/*.ase --sheet %OUTPUT_PNG% --sheet-pack --data %OUTPUT_JSON% --list-tags
optipng -o7 %OUTPUT_PNG%
