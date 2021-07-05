Module.register('MMM-HVV', {
  defaults: {
    animationSpeed: 1000,
    station: null,
    direction: null,
    maxDepartureTime: 20,
    showIcons: true,
    header: 'HVV Departures'
  },

  start: function () {
    Log.log('HVV frontend started')
    this.sendSocketNotification('HVV_START')
  },

  getStyles: function () {
    return ['MMM-HVV.css']
  },

  getScripts: function () {
    return ['moment.js']
  },

  fetchHVV: function () {
    var endpoint = `https://v5.hvv.transport.rest/stops/${this.config.station}/departures?direction=${this.config.direction}&duration=${this.config.maxDepartureTime}`

    fetch(endpoint)
      .then(response => {
        return response.json()
      })
      .then(data => {
        for (var key in data) {
          var line = data[key].line.name
          var direction = data[key].direction
          var when = moment(data[key].when).fromNow()
          var icon = this.config.showIcons ? `<td class="icon"><img class="grayscale" src="https://cloud.geofox.de/icon/linename?name=${line}&height=20&fileFormat=SVG"/></td>` : ''
          var row = document.createElement('tr')
          row.innerHTML = `<td class="direction">${direction}</td>` + icon + `<td class="time bright">${when}</td>`
          table = document.getElementById('results')
          table.appendChild(row)
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

    this.fetchHVV()

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
