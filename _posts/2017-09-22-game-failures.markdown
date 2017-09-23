---
layout: post
title: Game Failures
cover_url: /img/game_failures_question_mark.jpg
---

## learning how to make games is hard

<img src="/img/game_failures_question_mark.jpg" title="a collage of maybes">

I've been a freelancer for awhile and gotten to work on some really amazing projects; games and otherwise!

But I've also been trying to make my own games with some of my time. And I feel like I've been failing.

I know this was maybe only news to me and me alone, but: I learned that making games is really hard. Harder than I thought.

## how I learned interactive fiction is hard to make

First I wanted to learn Unity, so I started making a [surreal dating simulator](https://keelo.itch.io/strangedates).

<img src="/img/StrangeDatesTitle.jpg">

I thought cloning something would be instructive; that maybe it would be easy and fun to start by emulating a dating app for phones, get a feel for Unity's 2D frameworks, and then see if I could build a game around what came out of that.

So I had made this whole dating app interface with Unity's UI tools.

<img src="/img/gamefailures/strange_dates.jpg">

And you would have conversations with strangers.

<img src="/img/gamefailures/strange_dates_convo.jpg">

And have random "dates" with them.

<iframe width="560" height="315" src="https://www.youtube.com/embed/mWKdsbO-F9A" frameborder="0" allowfullscreen></iframe>

In the process, I realized a few things. One, that good interactive writing isn't easy--I felt pressure that if my game had all these multiple paths, I had better make all of them really good--and that's a ton of work. I was also realizing that the engineering part of my brain really loves solving technical challenges. *And* that I enjoyed procrastinating from writing, specifically by engineering more *stuff*.

As examples of some of things I remember doing instead of writing gameplay content:

- making the UI "responsive" so it would work on different desktop ratios and on differently sized mobile screens
- creating from scratch an entire ["script" language format](/img/gamefailures/convo_format.png) for interactive fiction
- creating a parser for totally said over-engineered format
- keyboard accessibility so you could play it on a tablet, a keyboard, or a gamepad, or a mouse
- emojii support?!
- a bunch of text fading and wrapping code that made things feel more polished
- conversation pauses and natural feeling rhythms to texting
- shaders to wobble stuff for when you get drunk
- adapting the conversation system to an "IRL" mode so some scenes could be outside your phone
- scene transitions
- a save load system
- ...more

I'm sure you can spot the problem here--I was adding features and polish instead of planning and writing the game.

The more time I spent crafting this polished interactive text engine thing, the less time I was seeing if there was a game there I wanted to have made at the end of it. Worse, after awhile I got a bit bored by the limitations I had created--preprogrammed conversations with multiple-choice style forking. It was in no way even flirting with anything anyone would call a "new mechanic." Which is fine. But I didn't have enough energy left over to feel inspired about how to make it a compelling game.


<iframe width="560" height="315" src="https://www.youtube.com/embed/hxKb7o1vLCI" frameborder="0" allowfullscreen></iframe>


I also was mostly too shy to show it to friends; a big mistake. Something I learned later is the hit/nervousness/minor adrenaline rush you get from watching people play it (and find its limitations) is a really nice motivating factor.

## how I learned puzzle games are hard to make

<img src="/img/gamefailures/lwr_1.png">

At some point I got distracted and started working on something called [Laser Wart Removal](https://keelo.itch.io/laserwartremoval).

I wanted to make something in 3D, but still on a 2D plane, to uh, take a next step in my Unity journey. I started playing around with a laser I made by raycasting a LineRenderer around. I started drawing puzzles. I remember enjoying The Talos Principle but getting a bit bored with how most of the puzzles boiled down to "figure out how to get a line of sight to the next thing." In a 3D FPS that can be pleasurable in itself--but I was wondering about more complicated stuff, like: what if you had to construct polygons of certain numbers of sides by reflecting lasers around and creating a perimeter?

<iframe width="560" height="315" src="https://www.youtube.com/embed/PmjzUGcJGRs" frameborder="0" allowfullscreen></iframe>

It got out of control from there and I ended up engineering a bunch of stuff without really thinking through the gameplay first:

- a native unity plugin calling out to a complicated geometry library called [CGAL](https://www.cgal.org/) to detect intersections and polygons from an arbitrary set of intersection points
- black holes that bend lasers
- mirrors that only work when they are "lit" from within
- a big material palette system so that I could swap out level color palettes on the fly
- adding a world map so that you could pick levels non-linearly
- deciding at one point that it should be a mobile game instead and rearranging the orientation of all the levels
- a save load system
- ...more

<iframe width="560" height="315" src="https://www.youtube.com/embed/xHiIlt9ReuY" frameborder="0" allowfullscreen></iframe>

I would say for this game that the secret time sink--the mammoth iceberg of work lurking beneath the surface--was the combination of getting the controls right, and of establishing a visual language for which things on screen can manipulated. I wanted it to work on iPads, and I struggled awhile with how to let people rotate things around in an intuitive way. After a long time I eventually settled on a solution where you can touch and drag *any* laser and move it, even if it's been reflected in mirrors 30 times before--the game will try to rotate it's originating laser gun so that it points to where your finger ended up. It feels nice! But it wasn't easy to get right. These are the kinds of polishing-things-till-they-feel-ok-hills I died on.

There was one major thing I did better this time around--I did do a lot more playtesting with this game. I took it to local games events in on an iPad and showed it to people, and to their friends who don't even play games. I got good feedback about where people got stuck, and what people found cool. I got people ages from 8-60 excited about it. That was always very motivating!

I learned a bit of Blender to be able to make abstract geometrical shapes and walls and gears. I struggled with making things look "good enough." I experimented with color palettes. I ended up adding a kaleidoscopic feedback loop thing in the background that gave the game more of a distinct look:

<img src="/img/gamefailures/lwr_2.jpg">

In the end though, the game still only has 16 levels, and I got tired of working on it.

<img src="/img/gamefailures/lwr_3.jpg">

<img src="/img/gamefailures/lwr_4.jpg">

<img src="/img/gamefailures/lwr_5.jpg">

## traplands

I was frustrated with the feedback loop involved in compiling Unity to iOS.

I found a WebGL framework named [Foster](https://github.com/NoelFB/foster) which was a tiny game engine with 2D graphics, sound, and input, and not much else. I can't stress enough.

Depth sorting, an entity-component-system...

## Learnings

**Knowing how to program is not the same as knowing how to make a good game.**

## What I'm going to do about it

What if I something forcing me to finish? To keep the scope of my game managable? To ship? This something exists! It's called a game jam. I need to do more game jams before

# todo

I did lots of freelance work and travelled the world and came out of my shell.

Maybe the most successful game I made since starting was with a friend and a deck of cards on the floor.

<img src="/img/high-five-cards.jpg">