const FormData = require('form-data')
const axios = require('axios')
const dayjs = require('dayjs')

module.exports = {
  site: 'tvmusor.hu',
  url: 'http://www.tvmusor.hu/a/get-events/',
  request: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data({ channel, date }) {
      const params = new URLSearchParams()
      params.append(
        'data',
        JSON.stringify({
          blocks: [`${channel.site_id}|${date.format('YYYY-MM-DD')}`]
        })
      )

      return params
    }
  },
  parser({ content, channel, date }) {
    let programs = []
    const items = parseItems(content, channel, date)
    items.forEach(item => {
      programs.push({
        title: item.j,
        category: item.h,
        description: item.c,
        icon: parseIcon(item),
        start: dayjs(item.e),
        stop: dayjs(item.f)
      })
    })

    return programs
  },
  async channels() {
    const data = await axios
      .get(`http://www.tvmusor.hu/most/`)
      .then(r => r.data)
      .catch(console.log)

    const [_, channelData] = data.match(/const CHANNEL_DATA = (.*);/)
    const json = channelData.replace('},}', '}}').replace(/(\d+):/g, '"$1":')
    const channels = JSON.parse(json)

    return Object.values(channels).map(item => {
      return {
        lang: 'hu',
        site_id: item.id,
        name: item.name
      }
    })
  }
}

function parseIcon(item) {
  return item.z ? `http://www.tvmusor.hu/images/events/408/${item.z}` : null
}

function parseItems(content, channel, date) {
  const data = JSON.parse(content)
  if (!data || !data.data || !data.data.loadedBlocks) return []
  const blocks = data.data.loadedBlocks
  const blockId = `${channel.site_id}_${date.format('YYYY-MM-DD')}`

  return Array.isArray(blocks[blockId]) ? blocks[blockId] : []
}