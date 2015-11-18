---
layout: post
title: Puzzle Boxes
---

# puzzle boxes

### maybe every copy of the game could be different, which means that you can't share keys

generate a private key for each build.
sign each encrypted box with the private key, and then the solution string + public key could be unique for each thing

so the solution string + 

## the central conceit
  - each "next" level is stored in a Russian-doll-like encrypted block, containing all the proceeding encrypted blocks inside it. the decryption key itself is actually represented by the state of the game which is the solution to the puzzle.

## misc
  - it doesn't all have to be one mechanic, or even obviously a normal "puzzle" game...you could use this idea with a "riddle" game, where the answer to the riddle is just text, which itself is the decryption key.
  - how to have the game's mechanics reflect a) the importance of secrets and b) hacking. [hacking in itself is fun. why am I looking to stop it? -maybe build in a meta back door which is the real secret]
  - TODO: quickly arrive at a constraint that will drive the game design: develop a way to interactively see the number of bits in the decryption key. know the number of bits you need to be "uncrackable." then make sure that the design is above that bar.
  - one big philosophical question: why do secrets have potency?
  - lookup the history of that unsolved FBI cipher
  - lookup the history of that beautifully illustrated unsolved cipher book
  - secrets behind secrets. it would be nice to have breadcrumbs along the way proving to people that being the FIRST to get somewhere is valuable. in this game, you can't just crack it open and see.
    - a bitcoin wallet address with some money in it
    - something really embarrassing.
  - read up on what they did with FEZ...audio spectrography
  - what is the difference between a secret nobody finds and pure entropy?
  - todo: research computational time. tune the game's possibility space so that even if all the matter in the universe were to be converted to computronium, you'd still require more than the expected length of the universe to crack them. also research how fast algorithms fall to previously unknown vulnerabilities
  - which encryption algorithm?
  - internal criticism: should I have a game before I try to load it with secrets?
  - is it better to have an impossible puzzle at the end? important: it's interesting that an impossible (i.e., nonsensical, one without a solution) puzzle is indistinguishable from one with a real solution that we haven't found yet. something with NP completeness here...the search is the fun part.

## unanswered questions
  - Q: which games have the longest running undiscovered secret?
  - Q: is a cipher or secret so difficult it is not solved in our lifetimes even interesting?
    - secrets are like stories in that they need people to give them meaning and life.
  - Q: how do techniques involved in malware construction reflect building this game?
    - why do people build malware? is it the same motivation?
    - malware and the people who attack have a living/breathing cat-and-mouse dynamic that a static game would not--is there a way to reflect the nature of THAT game? (the stakes are obviously much higher geopolitically in nuclear-centrifuge-targeting malware).
  - Q: could there be branching paths? Are there encryption algorithms with more than one solution/decryption key? could the paths then reconverge? or do you double the size of the game after that?
  - Q: is this better as a game making framework? as a library for use by other games? something in the asset store?

## references
  - enigma/turing
  - donkey kong title screen secret
  - konami code
  - write an automated tool for finding codes in ROMs, search the total romspace 

