import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
})

if (!window.__ACCESS_GRANTED) {
  const appEl = document.getElementById('app')
  if (appEl) {
    appEl.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#555;text-align:center;padding:20px;">
        <div style="font-size:48px;margin-bottom:16px;">🔒</div>
        <h2 style="margin:0 0 12px;font-size:20px;color:#333;">접근이 제한된 페이지입니다</h2>
        <p style="margin:0;font-size:14px;line-height:1.6;">
          이 페이지는 지정된 링크를 통해서만 접근할 수 있습니다.<br/>
          아래 링크 중 하나를 통해 다시 방문해 주세요.
        </p>
        <div style="margin-top:24px;display:flex;flex-direction:column;gap:10px;">
          <a href="https://cafe.naver.com/sandip" style="color:#4a90e2;text-decoration:none;font-size:14px;">cafe.naver.com/sandip</a>
        </div>
      </div>
    `
  }
} else {
  const app = createApp(App)

  app.use(router)
  app.use(vuetify)

  app.mount('#app')
}
