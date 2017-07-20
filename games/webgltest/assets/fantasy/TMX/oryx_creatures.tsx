<?xml version="1.0" encoding="UTF-8"?>
<tileset name="oryx_creatures" tilewidth="24" tileheight="24" tilecount="486" columns="18">
 <tileoffset x="0" y="-4"/>
 <image source="../oryx_creatures.png" trans="000000" width="432" height="648"/>
 <tile id="0" type="player_spawn"/>
 <tile id="324" type="dragon">
  <properties>
   <property name="hasShadow" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="369" type="eyeballs">
  <properties>
   <property name="anim_frame" type="int" value="0"/>
   <property name="anim_name" value="eyeballs"/>
   <property name="hasShadow" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="376">
  <properties>
   <property name="anim_frame" type="int" value="0"/>
   <property name="anim_name" value="fireball_red"/>
   <property name="anim_speed" type="float" value="4.5"/>
  </properties>
 </tile>
 <tile id="387" type="eyeballs">
  <properties>
   <property name="anim_frame" type="int" value="1"/>
   <property name="anim_name" value="eyeballs"/>
   <property name="hasShadow" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="394">
  <properties>
   <property name="anim_frame" type="int" value="1"/>
   <property name="anim_name" value="fireball_red"/>
  </properties>
 </tile>
 <tile id="468">
  <properties>
   <property name="shadow" type="int" value="0"/>
  </properties>
 </tile>
 <tile id="469">
  <properties>
   <property name="shadow" type="int" value="1"/>
  </properties>
 </tile>
 <tile id="470">
  <properties>
   <property name="shadow" type="int" value="2"/>
  </properties>
 </tile>
</tileset>
