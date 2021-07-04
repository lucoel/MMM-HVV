# MMM-HVV 🚇
MagicMirror Module that displays departure information about public transportation in Hamburg, Germany. It uses [`v5.hvv.transport.rest`](https://v5.hvv.transport.rest/) (also see [hvv-rest](https://github.com/derhuerst/hvv-rest)).

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
                direction: Number
            }
        }
    ]
}
```

## Configuration Options

| Option | Description | Default |
| ------------- | ------------- | ------------- |
| `station`  | **REQUIRED** The station where you want to start. | null |
| `direction`  | **REQUIRED** The direction you want to use.  | null |
| `maxDepartureTime`  | Maximum time until departure in minutes | 20 |
| `showIcons`  | Show line icons for every departure | true |
| `animationSpeed`  | Animation speed to display/hide new results. (WIP) | 1000 |
