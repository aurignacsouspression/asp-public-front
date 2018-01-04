# asp-public-front

This repo contains the source code used for the front-end part of the public website [http://www.aurignacsouspression.fr](http://www.aurignacsouspression.fr)

## Todo list

* Migration to TypeScript
* Migration to Angular 2+
* Integration with [helloasso](https://www.helloasso.com/vendre-mes-billets) for ticketing
* Add list of local accomodations for the event

## Build it locally

In addition to classic `npm`, you need to have the following tools installed :

* [Gulp](https://gulpjs.com/)
* [Bower](https://bower.io/)

Then :

```sh
npm i
bower i
gulp build
```

To run it : this repo is intented to be run as part of a complete [docker](https://www.docker.com/) environment (configuration files not provided), but you can customize `gulpfile.js` if you want to tailor it to your use.
