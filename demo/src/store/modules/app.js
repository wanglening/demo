import { login as loginApi } from '@/api/login'
import router from '@/router'
import { setTokenTime } from '@/utils/auth'
export default {
  namespaced: true,
  state: () => ({
    token: localStorage.getItem('token') || '',
    siderType: true,
    lang: localStorage.getItem('lang') || 'zh',
    PrpsTimeScale: 20, // prps图标刷新周期
    fixOrfresh: '0', // 图标状态：实时刷新or固定('0':固定；'1':刷新)
    PrpsClickPointdata: [[0, 0, 0], [0, 0, 0]],
    PrpdClickPointdata: [[0, 0, 0], [0, 0, 0]],
    PhaseAmplePointdata: [[0, 0], [0, 0]],
    Cursorstate: 0, // 光标状态（启用：1、未启用：0）
    ChartUsingCursor: 0, // 使用光标的图谱（0：PRPD,1:PRPS）
    ChartType: ["AP", "PQ"],
  }),
  mutations: {
    setChartType(state, charttype) {
      state.ChartType = charttype
    },
    setChartUsingCursor(state, chartusingcursor) {
      state.ChartUsingCursor = chartusingcursor
    },
    setCursorstate(state, cursorstate) {
      state.Cursorstate = cursorstate
    },
    setPhaseAmplePointdata(state, phaseamplepointdata) {
      state.PhaseAmplePointdata = phaseamplepointdata
    },
    setPrpdClickPointdata(state, prpdclickpointdata) {
      state.PrpdClickPointdata = prpdclickpointdata
    },
    setPrpsClickPointdata(state, prpsclickpointdata) {
      state.PrpsClickPointdata = prpsclickpointdata
    },
    setfixOrfresh(state, fixorfresh) {
      state.fixOrfresh = fixorfresh
    },
    setPrpsTimescale(state, prpstimescale) {
      state.PrpsTimeScale = prpstimescale
    },
    setToken (state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    changeSiderType (state) {
      state.siderType = !state.siderType
    },
    changLang (state, lang) {
      state.lang = lang
    }
  },
  actions: {
    // 登录
    login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginApi(userInfo)
          .then((res) => {
            commit('setToken', res.data.token)
            setTokenTime()
            console.log(res.data.token)
            router.replace('/web')
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 退出
    logout ({ commit }) {
      commit('setToken', '')
      localStorage.clear()
      router.replace('/login')
    }
  }
}
