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

  fetchHVV: async function () {
    try {
      const destination = this.config.destination ? `&direction=${this.config.destination}` : ''
      const endpoint = `https://v6.db.transport.rest/stops/${this.config.station}/departures?duration=${this.config.maxDepartureTime}&remarks=false${destination}`

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      Object.keys(data).forEach(key => {
        data[key].forEach(departure => {
          const direction = departure.direction
          const when = moment(departure.when).fromNow()

          let line = departure.line.name.replaceAll(' ','')
          if (line.includes("Bus")) {
            line = line.replaceAll("Bus", "")
          }
          const icon = this.config.showIcons
            ? `<td class="icon"><img class="grayscale" src="https://cloud.geofox.de/icon/linename?name=${line}&height=20&outlined=true&fileFormat=SVG"/></td>`
            : '';

          const row = document.createElement('tr')

          row.innerHTML = `<td class="direction">${direction}</td>` + icon + `<td class="time bright">${when}</td> `
          table = document.getElementById('results')
          table.appendChild(row)
        })
      })
    } catch (error) {
      Log.error(`${this.name}: Something went wrong. Please check module's config. ${error}`);
    }
  },

  getDom: function () {
    const div = document.createElement('div')
    div.id = "HVV"

    if (!this.config.station) {
      div.innerHTML = `<p class="bright">Station/stop is not defined in config.</p>`
      Log.error(`${this.name}: Station not defined in config.`);
    }

    const header = document.createElement('header')
    header.innerHTML = this.config.header
    div.appendChild(header)

    const table = document.createElement('table')
    table.id = 'results'
    table.className = 'small'
    div.appendChild(table)

    this.fetchHVV()

    return div
  },

  notificationReceived: function (notification) {
    if (notification === 'CLOCK_MINUTE') {
      this.updateDom()
      Log.info('New HVV departures available.')
    }
  },
})
