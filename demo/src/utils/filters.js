const dayjs = require('dayjs')

const filterTimes = (val, format = 'YYY-MM-DD') => {
    if (!isNull(val)) {
        val = parseInt(val) * 1000
        return dayjs(val).format(format)
    } else {
        return '--'
    }
}

const isNull = (date) => {
    if (!date) return true
    if (JSON.stringify(date) === '{}') return true
    if (JSON.stringify(date) === '[]') return true
}
export default app => {
    app.config.globalProperties.filters = {
        filterTimes
    }
}
