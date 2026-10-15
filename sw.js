self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));

self.addEventListener('push',event=>{
  let data={};
  try{data=event.data?event.data.json():{}}catch{data={body:event.data?.text()||''}}
  const title=data.title||'🏒 EHL Familietips';
  const options={
    body:data.body||'Ny oppdatering i Familietips',
    tag:data.tag||'ehl-update',
    renotify:true,
    icon:'./ehl-icon.svg',
    badge:'./ehl-icon.svg',
    data:{url:data.url||'./'}
  };
  event.waitUntil(self.registration.showNotification(title,options));
});

self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const target=new URL(event.notification.data?.url||'./',self.registration.scope).href;
  event.waitUntil((async()=>{
    const list=await clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of list){
      if(client.url.startsWith(self.registration.scope)){
        await client.focus();
        if('navigate' in client) await client.navigate(target);
        return;
      }
    }
    await clients.openWindow(target);
  })());
});