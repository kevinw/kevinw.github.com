#!/bin/bash -e

URL="https://raw.githubusercontent.com/MaxBittker/Mojulo/gh-pages"

dl() {
  FULLURL=$URL/$1
  echo "downloading $FULLURL"
  curl -s $FULLURL > $1
}

dl "Mojulo.js"
dl "mathparser.js"
