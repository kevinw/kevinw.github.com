---
layout: post
title: A Game Failures Graveyard Tour
cover_url: /img/gamefailures/mouf.jpg
---

## how I learned game dev ain't easy: a story in 3 playable prototypes

<img src="/img/gamefailures/mouf.jpg">

Last time here I attempted [deconstructing a programmer's lament](//2013/04/30/why-did-why-the-lucky-stiff-quit/) about the hermetic nature of entrepreneurial programming culture and why it might be more fun to make art instead (for me? maybe?). In retrospect I was psyching myself up to leave internet startups and set off on my own making my own stuff.

And it's been **lovely**. I've been really lucky to be part of teams shipping really cool stuff during my time as a freelancer to pay the bills and to work with people making amazing art and tech. But my solo game ventures haven't thus far painted quite so rosy a picture.

I've been trying to make games with some of my time. And I've learned a ton. But also...I've been failing.

I know this was maybe only news to me and me alone, but: I'm learning that making games is hard. Much harder than I had imagined.

Why? Come along with me as we skip merrily through a tiny graveyard of unfinished projects and I proposition some answers.

## how I learned interactive fiction is hard to make

First I wanted to learn Unity, so I could stay away from all that engine programming I was doing. I thought I would start with something "easy" and 2D--soon I was making a surreal gay app dating simulator called [Strange Dates](https://keelo.itch.io/strangedates).

{% include image.html url="/img/StrangeDatesTitle.jpg" description="embarrassingly homonormative title screen, check" %}

I thought cloning some existing UI would be instructive and that getting a feel for Unity's 2D frameworks would pay off. Then hopefully, I thought, I could build a game around the result.

So after a bit I had made this whole "dating app" interface with Unity's UI tools.

<img src="/img/gamefailures/strange_dates.jpg">

And you'd have conversations of varying degrees of realism and value with strangers!

<img src="/img/gamefailures/strange_dates_convo.jpg">

And even go on random "dates" with them.

<p><iframe width="560" height="315" src="https://www.youtube.com/embed/mWKdsbO-F9A" frameborder="0" allowfullscreen></iframe></p>

In the process, I realized a few things. One, that good interactive writing isn't easy--I felt pressure that if my game had all these multiple paths, I had better make all of them really engaging/funny/surprising/nuanced/multi-layered. All of them! I was also realizing that the engineer in me loves solving technical challenges and that I enjoyed procrastinating from writing by engineering more *stuff* ("Tech dolt dramatically chucks pencil into bonfire of writing-on-writing books in disgust over creative writing's surprising difficulty before tweeting about it").

{% include image.html url="/img/gamefailures/pandy.jpg" %}

Some things I remember doing instead of writing the actual game's content:

- making the UI "responsive" so it would work on different desktop ratios and on differently sized mobile screens
- creating from scratch an entire [script language format](/img/gamefailures/convo.png) for interactive fiction
- creating a parser for said totally over-engineered format
- keyboard accessibility for tablets, keyboards, gamepads, mice
- emoji support?!
- a bunch of complicated text fading and wrapping code that made things feel more polished
- conversation pauses and natural feeling rhythms to texting inserted automatically based on sentences' grammatical structure
- shaders to wobble stuff for when you get drunk
- support for embedding pics in conversations
- adapting the conversation system to an "IRL" mode so some scenes could be outside your phone
- scene transitions
- a save/load system
- ...more

I'm sure you can spot the problem here--I was adding features and polish instead of planning and writing the game.

<img src="/img/gamefailures/pandy-selfie.jpg">

The more time I spent crafting this polished interactive text engine thing, the less time I was seeing if there was a game there I wanted to have made at the end of it. Worse, after awhile I got a bit bored by the limitations I had created--preprogrammed conversations with multiple-choice style forking. It was in no way even flirting with anything anyone would call a "new mechanic." Which is fine. But I didn't have enough energy left over to feel inspired about how to make it a compelling game.

<iframe width="560" height="315" src="https://www.youtube.com/embed/hxKb7o1vLCI" frameborder="0" allowfullscreen></iframe>

I didn't even really get to the thing I wanted to explore; that maybe the story would present itself at first in guise of an alarmist and heavy-handed cautionary tale about sex addiction--but then would gradually reveal itself to be more of a radically sex-positive embrace of playfulness, in all forms. Or maybe it would just be kind of funny (without being too gross)?

In what was a big mistake I was also mostly too shy to show it to friends. Something I learned later is that the hit/nervousness/minor adrenaline rush you get from watching people play your stuff (and find its limitations!) is a really nice motivating factor when you're feeling stuck.

But in the meantime, I found another way to procrastinate on it--by starting a new project.

## how I learned puzzle games are hard to make

To cure my ills I distracted myself by starting on a new game with laser puzzles eventually called [Laser Wart Removal](https://keelo.itch.io/laserwartremoval).

{% include image.html url="/img/gamefailures/lwr_proto.gif" description="ah, really cartoony yet nonetheless hypnotic light transport simulations" %}

I wanted to make something with more 3D assets this time, but still on a 2D plane, to uh, keep things easy. I started playing around with a laser I made by raycasting a LineRenderer around. I started drawing puzzles where you had to get the lasers to bounce around and do things in a small constrained space. I remember enjoying The Talos Principle but getting a bit bored with how most of the puzzles boiled down to "figure out how to get a line of sight to the next thing." In a 3D FPS that can be pleasurable in itself--but I was wondering about more complicated stuff, like: what if you had to construct polygons of certain numbers of sides by reflecting lasers around and creating a perimeter?

<iframe width="560" height="315" src="https://www.youtube.com/embed/PmjzUGcJGRs" frameborder="0" allowfullscreen></iframe>

That ended up feeling interesting, if not an easy thing to construct puzzles with. From there I got building--and, hey, uh oh--it got out of control and I ended up engineering a bunch of features (without really thinking through the gameplay ramifications first, or how they might build towards the game I was making...). Things like:

- a native Unity plugin calling out to a [complicated geometry library](https://www.cgal.org/) detecting intersections and polygons from an arbitrary set of intersection points
- black holes that bend lasers
- mirrors that only work when they are "lit" from within
- a big material palette system so that I could swap out level color palettes on the fly
- a world map so that you could pick levels non-linearly
- deciding at one point that it should be a mobile game instead and rearranging the orientation of all the levels
- a save/load system
- ...more

<iframe width="560" height="315" src="https://www.youtube.com/embed/xHiIlt9ReuY" frameborder="0" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/H-LF40ZaI4U" frameborder="0" allowfullscreen></iframe>

Soon I had an enormous pile of features and half-finished level prototypes. 

I learned just enough Blender to make a whole slew of weird angular shapes with the same weird aesthetic. I struggled with making things look "good enough." I experimented with color palettes. I ended up adding a kaleidoscopic feedback loop in the background that gave the game more of a distinct look.

{% include image.html url="/img/gamefailures/lwr_1.jpg" description="// TODO: check with ppl if counting how many times lasers intersect is actually fun?" %}

I started assembling the levels I liked together into some kind of sequence and showing it to people--this time I did do a better job playtesting. I took it to local games events on an iPad and received feedback on where people got stuck or what they liked. I got people ages from 8-60 excited about it and it felt good.

Often the first and loudest feedback was that the controls were too finicky--and in this game controls were the biggest secret time sink. I wanted it to work intuitively on iPads, and I struggled awhile with how to let people rotate things around in an way that was obvious and felt good. After a long time I eventually settled on a solution where you can touch and drag *any* laser and move it, even if it's been reflected in mirrors 30 times before--the game will try to rotate it's originating laser gun so that it eventually points to where your finger ended up. It feels alright! But it wasn't easy to get right.

{% include image.html url="/img/gamefailures/lwr_2.jpg" description="A verisimilitudinous medical cosmetic surgery simulator this was not." %}

Also tough was finding a visual language for distinguishing rotatable things from static things. Without a lot of (any, actually) modelling skills or much actual experience in visual design I started to grok the amount of craft that goes into making something intelligible (light that bonfire again). But I wanted to (start to learn to) scale those hazy and towering cross-disciplinary mountain ranges in the distance that in previous lives I hadn't even bothered to consider surmountable.

In retrospect, these design challenges are maybe more of the kinds of polishing-things-till-they-feel-ok-hills (controls, game feel, readability) I felt better dying--or at least spending some time--on, rather than technical feature rabbit-holing. In fits and starts and dead-ends I was learning what it meant to design a progression of challenges. To teach something and then to expand upon it and then to ask something new of the player in a way that feels fair. To draw the player's eye somewhere so they don't get stuck looking at the unimportant bit.

{% include image.html url="/img/gamefailures/lwr_3.jpg" description="Cut with kindergarten scissors" %}

In the end though, I still felt myself doing plenty of the aforementioned [rabbit-holing](http://imgs.xkcd.com/comics/nerd_sniping.png)--and running out of steam. Many new puzzles were boiling down to the same line of sight rut I found in Talos Principle, and others required a whole bunch of engineering for features I wasn't even sure were fun.

At current count, the game has 16 levels I place in the "sort-of finished" category. There's another 40 that need work, or express redundant concepts, or for whatever reason don't fit into a larger whole.

{% include image.html url="/img/gamefailures/lwr_4.jpg" description="Wait, photons don't collide with each other, do they?" %}

Is a puzzle game better when you distill it down to its absolute minimal state? Where every beat is something new? Do I want to make games that lead people along a pleasant garden path? Or do I want to construct elegantly minimal and brutal puzzle boxes they have to Houdini their way out of? There's no right answer here--just questions for myself to ponder.

<img src="/img/gamefailures/lwr_5.jpg">
{% include image.html url="/img/gamefailures/lwr_5.jpg" description="I know what this needs...more cube primitives!" %}
## in which I indulge in a minor dalliance outside of Unity's beefy embrace

I was frustrated with the feedback loop involved in compiling Unity to iOS, and my own speed at making new levels. My proglang nerd brain was getting bored by all that C# maybe?

<a href="http://kevinw.github.io/games/traplands"><img src="/img/gamefailures/traplands_title.gif"></a>

Another project was born--an action puzzler called [Traplands](http://kevinw.github.io/games/traplands). 

I had found a tiny WebGL game engine with 2D graphics, sound, and input named [Foster](https://github.com/NoelFB/foster) and it looked super fun to make stuff in.

This turned out to be true! There's something magic about the tight loop of Typescript → browser → git push and it's online to spam friends with, with nary a multi-minute build process to be found.

<img src="/img/gamefailures/traplands_level.jpg">

Things it didn't have that I built for game:

- a webpack configuration so I could ship minified builds
- pathfinding algorithms so my enemies could hunt you around the levels
- a Tiled level loader because why not
- logic for importing aseprite sequences and parameters
- y-based sprite depth sorting
- a "edit mode" gui for editing prefab properties from the browser and then saving changes back to the game data
- a data driven entity-component-system inspired by Unity's, with prefab inheritance because then it would be even BETTER than Unity's

...Also I learned Typescript.

<img src="/img/gamefailures/traplands_spikes.jpg" style="max-width:400px;">

The trajectory of this game's development shouldn't be a mystery at this point; after making a few dozen levels, I was feeling stuck, and feedback from players was encouraging, but not ecstatic. I did get into a better flow where the game was super data-driven; I could actually make new levels in Tiled without doing any coding. There's something to be said for getting into a "making content" flow that I'm learning is important.

I was also missing a ton of things from Unity. Straying away from the Danish behemoth made me realize how deep its toolbox of useful stuff really is. If you need to collide a circle with a tilemap, and your physics engine doesn't hand you that abstraction, it's very tempting to make that functionality (instead of maybe cutting the feature that requires it). If my goal was to help start fleshing out an open-source WebGL framework for making small games online, I succeeded. But if it was to finish a game, I was still lost in the weeds...

## What I learned (and more questions than I started with)

**Beware the rabbit hole.** Knowing how to program can help you make games, but it can also lead you down paths into the deep and alluring forest of engine tweaking/building/optimizing. It helps to know you can probably make any feature you want, with enough time. But it's also dangerous. Pick something interesting to build towards and do nothing but reach that goal.

**Game-making is multidisciplinary (so give yourself time and the emotional leeway to branch out).** You need a lot of different skills to make games. I didn't even mention all the time I was trying to make weird ambient music with different granular synthesis apps.

**Make something conceptually new, something with cultural relevance and something to say, something pretty, something smart, something funny, or something kinetic and crunchy and fun. But maybe pick ONE of these at a time for now so you actually have a shot, u noob.** Enough said.

And finally--since embarking on this journey, maybe the most successfully *fun* game I made was improvised with a friend on the floor for a deck of cards. Which leads to another lesson (besides "tech gets in the way") that has been haunting this graveyard like a lonely ghost moaning obvious and bold-faced bloggy truisms--**this gamedev stuff is much easy with collaborators; make games with friends.**

<img src="/img/high-five-cards.jpg">

## developing an healthy gamedev art practice, or just jamming

I'm not sure I'm done with these games, but at least they exist and I can point to them.

What if I had some kind of artificial constraint forcing me to finish things? To keep the scope of my game manageable? To ship a beginning, middle, and end?

(This something exists! It's called a game jam. I've successfully made stuff for jams before. They function as real, working psychological gauntlets designed to force you to power through some of these problems. So one of my goals is do more jams I guess?)

More broadly though, I'll keep at it. And who knows, there are whole other worlds out there--VR, more conceptual and relational art in spaces like museums, digital installations--so many ways to make playthings for people. I'm not giving up...it's really fun to fail at this.