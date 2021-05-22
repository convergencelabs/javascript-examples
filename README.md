<img alt="Convergence Logo" height="80" src="https://convergence.io/assets/img/convergence-logo.png" >

# Convergence Examples

![Build Status](https://travis-ci.org/convergencelabs/javascript-examples.svg?branch=master)](https://travis-ci.org/convergencelabs/javascript-examples)

This repository contains several examples that demonstrate using various features of [Convergence](https://convergence.io).

## Dependencies

 * ruby, gem
 * jeykll >= 3.9.x
 * Convergence >= 1.0.0-rc.7

## Development Setup

 1. Ensure development dependencies are installed for your platform.
 1. `npm install`
 1. `bundle install`
 1. Copy the `src/config.example.js` to `src/config.js`.
 1. Update `src/config.js` as appropriate for your domain. The default assumes that a [convergence server](https://convergence.io/quickstart/) is running on `localhost:8000`.
 1. `npm start`
 1. Open http://localhost:4000

Alternatively, you can use Docker to build and run a container as shown below.


## Building and Running the Container
To build the examples and associated docker container:

```shell script
npm run build
./scripts/docker-build.sh
```

The container can then be run using:

```shell script
./scripts/docker-run.sh
```

If you need to modify how the container is run, simply copy the commands in the `docker-run.sh` file and modify as required.

## Convergence Server
An easy way to get the convergence server up and running for the examples is launch the Convergence Omnibus Contianer:

```
docker run --name convergence -p "8000:80" convergencelabs/convergence-omnibus
```

## Branches
The `master` branch contains examples that work with the latest released version of Convergence.  The `develop` branch contains new / updated examples that work with the current version of Convergence that is in development and may or may not worth with the latest release version.  If you are not developing Convergence you should probably stick with `master`.

## Support
[Convergence Labs](https://convergencelabs.com) provides several different channels for support:

- Please use the [Convergence Community Forum](https://forum.convergence.io) for general and technical questions, so the whole community can benefit.
- For paid dedicated support or custom development services, [contact us](https://convergence.io/contact-sales/) directly.
- Chat with us on the [Convergence Public Slack](https://slack.convergence.io).
- Email <support@convergencelabs.com> for all other inquiries.
