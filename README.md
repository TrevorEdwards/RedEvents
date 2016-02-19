# RedEvents

RedEvents is a NodeJS API for those who wish to develop informational services for Cornell students.

See it running [here](http://redevents-trevtrev.rhcloud.com/).

# Structure
The api divides its services into different routes.

The routes have a few different functions:

  contacts.js simply serves a contacts file that is hosted on the server

  events.js parses XML from Cornell's events data, converts it to JSON, and stores it in the database.

  libraries.js parses Cornell's library hours web page and stores the results in the database.


Database access is handled in shareddb.js.

# Contributing

If you would like to contribute, feel free to make an issue about what you want.

Any data that could be relevant to Cornell is welcome.

Pull requests are always welcome!
