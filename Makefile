# http://clarkgrubb.com/makefile-style-guide

MAKEFLAGS += --warn-undefined-variables --no-print-directory
SHELL := bash
.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := all
.DELETE_ON_ERROR:
.SUFFIXES:

export REPO_NAME = croudtech/sentry-monitor
export IMAGE_TAG = latest
export DOCKER_IMAGE_URL = $(REPO_NAME):$(IMAGE_TAG)

.PHONY: build
build:
	@docker build -t $(DOCKER_IMAGE_URL) .

.PHONY: push
push:
	@docker push $(DOCKER_IMAGE_URL)

.PHONY: develop
develop:
	@docker run --env-file=.env -v `pwd`/src:/app --workdir /app -it $(DOCKER_IMAGE_URL) bash

.PHONY: execute
execute: 
	@docker run -p 3000:3000 --env-file=.env -it $(DOCKER_IMAGE_URL)

.PHONY: all
all: build push
