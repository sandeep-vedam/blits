export const getHash = () => {
  return (document.location.hash || '/').replace(/^#/, '')
}

export const matchHash = (path, routes = []) => {
  const route = routes
    .filter((r) => {
      return r.path === path
    })
    .pop()
  return route
}

export const navigate = function () {
  if (this.parent.___routes) {
    const hash = getHash()
    const route = matchHash(hash, this.parent.___routes)
    if (route) {
      if (this.__currentView) {
        for (let i = 0; i < this.__currentView.el.length - 1; i++) {
          if (this.__currentView.el[i] && this.__currentView.el[i].delete) {
            this.__currentView.el[i].delete()
            this.__currentView.el[i] = null
          } else {
            if (this.__currentView.el[i] && this.__currentView.el[i].destroy) {
              this.__currentView.el[i].destroy()
            }
          }
        }
        this.__currentView.destroy()
      }
      this.__currentView = route.component({}, this.el[1], this)
      this.__currentView.focus()
    } else {
      console.log(`Route ${hash} not found`)
    }
  }
}

export const to = (location) => {
  window.location.hash = `#${location}`
}

export default {
  navigate,
  to,
}
