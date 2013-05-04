POSTS=$(wildcard _posts/*.markdown)

site: $(POSTS)
	jekyll --pygments --no-lsi --safe

resume: resume.markdown site
	wkhtmltopdf http://localhost/resume/index.html resume.pdf

all: site
