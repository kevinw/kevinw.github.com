POSTS=$(wildcard _posts/*.markdown)

site: $(POSTS)
	jekyll --pygments --no-lsi --safe

all: site
