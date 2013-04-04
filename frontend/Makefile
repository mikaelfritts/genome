ASSETS = $(shell ls -1 public/scripts/assets/*.js)
CONTROLLERS = $(shell ls -1 public/scripts/controllers/*.js)
STYLES = public/styles/bootstrap/bootstrap.css	public/styles/bootstrap/bootstrap-responsive.css	public/styles/main.css

ASSETS_JS = $(ASSETS:%.js=<script type="text/javascript" src="%.js"></script>)
CONTROLLERS_JS = $(CONTROLLERS:%.js=<script type="text/javascript" src="%.js"></script>)
PRODUCTION_JS = <script type="text/javascript" src="public/scripts/application.min.js"></script>
MAIN_JS = <script type="text/javascript" src="public/scripts/main.js"></script>

STYLES_CSS = $(STYLES:%.css=<link href="%.css" rel="stylesheet" type="text/css">)
PRODUCTION_CSS = <link href="public/styles/styles.min.css" rel="stylesheet" type="text/css">

YUI_JS = java -jar ./bin/yuicompressor-2.4.2.jar
YUI_JS_FLAGS = --type js

YUI_CSS = java -jar ./bin/yuicompressor-2.4.2.jar
YUI_CSS_FLAGS = --type css

CAT = $(shell which cat)

LESSC := $(shell which lessc)

all: install_lessc compile_less reset template_js template_css compile do_styles compress nginx

install_lessc:
  ifeq "$(LESSC)" ""
	  $(error "Please installed the LESS Compiler. 'sudo npm install -g less'")
  endif
  
compile_less:
	lessc public/styles/main.less > public/styles/main.css

reset: 
	\rm -rf public/scripts/application.js public/scripts/application.min.js index.html index-dev.html public/styles/styles.css public/styles/styles.min.css nginx.conf
	
template_js:
	sed 's!{{JS}}!${ASSETS_JS}${CONTROLLERS_JS}${MAIN_JS}!g' index.tpl > index-dev.html
	sed 's!{{JS}}!${PRODUCTION_JS}!g' index.tpl > index.html
	
template_css:
	sed 's!{{CSS}}!${STYLES_CSS}!g' index-dev.html > index-dev.html.tmp
	sed 's!{{CSS}}!${PRODUCTION_CSS}!g' index.html > index.html.tmp
	mv index-dev.html.tmp index-dev.html
	mv index.html.tmp index.html

compile:
	@$(foreach ASSET, $(ASSETS), $(shell $(CAT) $(ASSET) >> public/scripts/application.js))
	@$(foreach CONTROLLER, $(CONTROLLERS), $(shell $(CAT) $(CONTROLLER) >> public/scripts/application.js))
	@echo $(shell $(CAT) public/scripts/main.js >> public/scripts/application.js)
	
do_styles:
	@$(foreach STYLE, $(STYLES), $(shell $(CAT) $(STYLE) >> public/styles/styles.css))
	
compress:
	$(YUI_JS) $(YUI_FLAGS_JS) -o public/scripts/application.min.js public/scripts/application.js
	$(YUI_CSS) $(YUI_FLAGS_CSS) -o public/styles/styles.min.css public/styles/styles.css
	
nginx: 
	sed 's!dirname!${PWD}/!g' nginx.conf.sample > nginx.conf
