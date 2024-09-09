Module.register('MMM-HVV', {
  defaults: {
    maxDepartureTime: 20,
    showIcons: true,
    header: 'HVV Departures'
  },

  start: function () {
    Log.log('HVV frontend started. ' + `Departures from station ${this.config.station} to destination ${this.config.destination}.`)
    this.sendSocketNotification('HVV_START')
  },

  getStyles: function () {
    return ['MMM-HVV.css']
  },

  getScripts () {
		return ["moment.js"];
	},

  fetchHVV: function () {
    var destination = this.config.destination ? `&direction=${this.config.destination}` : ''
    var endpoint = `https://v6.db.transport.rest/stops/${this.config.station}/departures?duration=${this.config.maxDepartureTime}&remarks=false${destination}`


    fetch(endpoint)
      .then(response => {
        return response.json()
      })
      .then(data => {
        for (var key in data) {
          data[key].forEach(departure => {
            var direction = departure.direction
            var when = moment(departure.when).fromNow()

            var line = departure.line.name.replaceAll(' ','')
            if (line.includes("Bus")) {
              line = line.replaceAll("Bus", "")
            }
            var icon = this.config.showIcons ? `<td class="icon"><img class="grayscale" src="https://cloud.geofox.de/icon/linename?name=${line}&height=20&outlined=true&fileFormat=SVG"/></td>` : ''

            var row = document.createElement('tr')

            row.innerHTML = `<td class="direction">${direction}</td>` + icon + `<td class="time bright">${when}</td> `
            table = document.getElementById('results')
            table.appendChild(row)
          });
        }
      })
      .catch(error => {
        Log.error(this.name + ': Something went wrong. Please check modules config. ' + error)
      })
  },

  getDom: function () {
    var div = document.createElement('div')
    div.id = "HVV"

    var header = document.createElement('header')
    header.innerHTML = this.config.header
    div.appendChild(header)

    var table = document.createElement('table')
    table.id = 'results'
    table.className = 'small'
    div.appendChild(table)

    if (this.config.station) {
      this.fetchHVV()
    } else {
      table.innerHTML = `<p class="bright">Station/stop is not defined in config.</p>`
      Log.error(this.name + ': Station not defined in config.')
    }

    return div
  },

  notificationReceived: function (notification) {
    var self = this

    if (notification === 'CLOCK_MINUTE') {
      self.updateDom()
      Log.info('New HVV departures available.')
    }
  },
})
