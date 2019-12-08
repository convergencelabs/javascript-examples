
# Convergence Examples

[![Build Status](https://travis-ci.org/convergencelabs/javascript-examples.svg?branch=master)](https://travis-ci.org/convergencelabs/javascript-examples)

This repository contains several examples that demonstrate using various features of [Convergence](https://convergence.io).

## Dependencies

 * ruby, gem
 * jeykll >= 3.6.x

## Development Setup

 1. Ensure development dependencies are installed for your platform.
 1. `npm install`
 1. `bundle install`
 1. Copy the `src/config.example.js` to `src/config.js`.
 1. Update `src/config.js` as appropriate for your domain. The default assumes that a [convergence server](https://convergence.io/quickstart/) is running on `localhost:8000`. You can run one in docker: `docker run -p "8000:80" --name convergence convergencelabs/convergence-de`
 1. `npm start`
 1. Open http://localhost:4000

Alternatively, you can use Docker to build and run a container: `npm run docker-prep`

## Branches
The `master` branch contains examples that work with the latest released version of Convergence.  The `develop` branch contains new / updated examples that work with the current version of Convergence that is in development and may or may not worth with the latest release version.  If you are not developing Convergence you should probably stick with `master`.

