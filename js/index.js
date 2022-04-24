let deferredPrompt

if ('serviceWorker' in navigator) {
  console.log('Service Worker: support')

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../service-worker.js').then((reg) => {
      console.log('Service Worker: Registered')
      if ('Notification' in window) {
        console.log('Notification permission default status:', Notification.permission)
        Notification.requestPermission( (status) => {
          console.log('Notification permission status:', status)
          if (Notification.permission == 'granted') {
            navigator.serviceWorker.getRegistration().then(reg => {
              reg.showNotification('PWA demo', {
                icon: './images/icon-192x192.png',
                body: 'Welcome to Subscription Notifications',
              })
            })
          }
        })
      }
    }).catch((err) => {
      console.log(`Service Worker: Error: ${err}`)
    })

    // 監聽下載案
    const installDialog = document.querySelector('.install-dialog__container')
    installDialog.addEventListener('click', () => {
      if(deferredPrompt !== undefined) {
        deferredPrompt.prompt()
    
        deferredPrompt.userChoice.then((choiceResult) => {
          console.log(choiceResult.outcome) // accepted or dismissed
          installDialog.classList.remove('show')
          if(choiceResult.outcome == 'dismissed') {
            console.log('User cancelled home screen install')
          }
          else {
            installDialog.classList.remove('show')
            console.log('User added to home screen')
          }
          deferredPrompt = null
        })
      }
    })
  })
}

// 監聽推廣下載
window.addEventListener('beforeinstallprompt', (event) => {
  console.log('Service Worker: Beforeinstallprompt')
  // 阻止預設推廣
  event.preventDefault()
  deferredPrompt = event
  const installDialog = document.querySelector('.install-dialog__container')
  installDialog.classList.add('show')
  return false
})


