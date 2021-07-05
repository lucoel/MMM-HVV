# MMM-HVV 🚇
MagicMirror Module that displays departure information about public transportation in Hamburg, Germany. It uses [`v5.hvv.transport.rest`](https://v5.hvv.transport.rest/) (also see [hvv-rest](https://github.com/derhuerst/hvv-rest)).

![Preview](.github/preview.png)

## Installation
Clone this module into your MagicMirror's `modules` directory and install dependencies:

```sh
cd modules
git clone https://github.com/lucoel/MMM-HVV
```

Now make changes to your `config.js` file.

## How to use this module
Add this to your `config/config.js` file.

```javascript
{
    /* ...your other config */

    modules: [

        /* ...your other modules */

        {
            module: 'MMM-HVV',
            position: 'bottom_left',
            config: {
                station: Number,
            }
        }
    ]
}
```
### Find your station/stop ID
> This step is definitely not ideal. Maybe there will be a better solution in the future.

The REST API can [`GET /locations`](https://v5.hvv.transport.rest/api.html#get-locations).

### Example
```sh
curl 'https://v5.hvv.transport.rest/locations?query=fischmarkt&results=1' -s | jq
```
```json
[
  {
    "type": "stop",
    "id": "5839",
    "name": "Fischmarkt",
    "location": {
      "type": "location",
      "id": "5839", // <- this is what you need
      "latitude": 53.547375,
      "longitude": 9.950816
    },
    "products": {
      // ...
    }
  }
]
```

With this method you can of course also search for your (optional) direction ID.


## Configuration Options

| Option | Description | Default |
| ------------- | ------------- | ------------- |
| `station`  |  The station/stop ID where you want to start | **REQUIRED** |
| `destination`  | Only show departures for a specific direction/destination ID | null |
| `maxDepartureTime`  | Maximum time until departure in minutes | 20 |
| `showIcons`  | Show line icons for every departure | true |
| `header`  | Custom header text | HVV Departures |
| `animationSpeed`  | Animation speed to display/hide new results. (WIP) | 1000 |
