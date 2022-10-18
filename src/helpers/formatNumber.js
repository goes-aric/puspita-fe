export default {
  formatNumber(num = 0) {
    num = num ?? 0
    let parts = num.toString().replace(/[^0-9.-]/g, '')
    parts = num.toString().split(".")
    parts[0] = parts[0].replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    let result = parts.join(".")
    result = result.replace(/(\..*)\./g, '$1').replace(/(?!^)-/g, '').replace(/^0+(\d)/gm, '$1')
  
    return result
  },
  unformatNumber(num = 0) {
    num = num ?? 0
    let parts = num.toString().split(".")
    parts[0] = parts[0].replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '')
    const result = parts.join(".")
  
    return result
  },
  toFixed(num = 0, digits = 0) {
    const precision = 10 ** digits
    const n = num * precision * (1 + Number.EPSILON)
    const roundedNumber = Math.round(n) / precision
    
    return roundedNumber.toFixed(digits)
  },
  onlyNumber(event) {
    event = (event) ? event : window.event
    let charCode = (event.which) ? event.which : event.keyCode
    if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
      event.preventDefault()
    } else {
      return true
    }
  }
}