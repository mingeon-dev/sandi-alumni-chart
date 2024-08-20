export default {
  id: 'pieLabelsLine',
  afterDraw(chart) {
    const { ctx, width, height } = chart

    const cx = chart._metasets[0].data[0].x
    const cy = chart._metasets[0].data[0].y

    const sum = chart.data.datasets[0].data.reduce((a, b) => a + b, 0)
    let yOffset = 0

    chart.data.datasets.forEach((dataset, i) => {
      chart.getDatasetMeta(i).data.forEach((datapoint, index) => {
        const percent = ((chart.data.datasets[0].data[index] * 100) / sum).toFixed(0)
        const content = `${chart.data.labels[index]} ${percent}%`

        if (percent < 5) {
          yOffset += 10
        }

        const { x: a, y: b } = datapoint.tooltipPosition()

        const x = 2 * a - cx
        const y = 2 * b - cy

        const halfwidth = width / 2
        const halfheight = height / 2
        const xLine = x >= halfwidth ? x + 10 : x - 10
        const yLine = y >= halfheight ? y + 10 + yOffset : y - 10 - yOffset

        const extraLine = x >= halfwidth ? 10 : -10

        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.arc(x, y, 2, 0, 2 * Math.PI, true)
        ctx.fill()
        ctx.moveTo(x, y)
        ctx.lineTo(xLine, yLine)
        ctx.lineTo(xLine + extraLine, yLine)
        ctx.strokeStyle = 'black'
        ctx.stroke()

        const textXPosition = x >= halfwidth ? 'left' : 'right'
        const plusFivePx = x >= halfwidth ? 5 : -5
        ctx.textAlign = textXPosition
        ctx.textBaseline = 'middle'
        ctx.fillStyle = 'black'

        ctx.fillText(content, xLine + extraLine + plusFivePx, yLine)
      })
    })
  }
}
