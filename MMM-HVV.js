Module.register('MMM-HVV', {
  defaults: {
    animationSpeed: 1000,
    station: null,
    direction: null,
    maxDepartureTime: 20,
  },

  start: function () {
    Log.log('HVV frontend started')
    this.sendSocketNotification('HVV_START')
  },

  getStyles: function () {
    return ['MMM-HVV.css']
  },

  getScripts: function () {
    return ["moment.js"]
  },

  fetchHVV: function () {
    var endpoint = `https://1.hvv.transport.rest/stations/${this.config.station}/departures?direction=${this.config.direction}&duration=${this.config.maxDepartureTime}`

    fetch(endpoint)
      .then(response => {
        return response.json()
      })
      .then(data => {
        for (var key in data) {
          var line = data[key].line.name
          var direction = data[key].direction
          var when = moment(data[key].when).fromNow()
          var row = document.createElement('tr')
          row.innerHTML = `<td class="direction">${direction} (${line})</td><td class="time bright">${when}</td>`
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
    header.innerHTML = "HVV Abfahrten"
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
