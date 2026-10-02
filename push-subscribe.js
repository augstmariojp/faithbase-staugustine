(function(){
    var VAPID_PUBLIC_KEY = "BJIvgAWOg8q_2nZtebCvioHQpqdPLchoeXuxvZQYNadmAqCnBCJ0Tef8fxaEqj16qIz62WZk19v5gTZquybK_ag";
  
    function urlBase64ToUint8Array(base64String){
      var padding = '='.repeat((4 - base64String.length % 4) % 4);
      var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
      var rawData = window.atob(base64);
      var outputArray = new Uint8Array(rawData.length);
      for (var i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
      return outputArray;
    }
  
    window.faithbaseEnableNotifications = async function(){
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        alert('Push notifications are not supported on this browser.');
        return false;
      }
      if (typeof supabaseClient === 'undefined') {
        console.error('supabaseClient not found');
        return false;
      }
  
      var userResult = await supabaseClient.auth.getUser();
      var user = userResult.data && userResult.data.user;
      if (!user) {
        alert('Please log in first.');
        return false;
      }
  
      var permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return false;
      }
  
      var registration = await navigator.serviceWorker.ready;
      var subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });
      }
  
      var subJson = subscription.toJSON();
      var r = await supabaseClient.from('push_subscriptions').upsert({
        user_id: user.id,
        endpoint: subJson.endpoint,
        p256dh: subJson.keys.p256dh,
        auth: subJson.keys.auth
      }, { onConflict: 'endpoint' });
  
      if (r.error) {
        console.error('Failed to save push subscription:', r.error);
        return false;
      }
  
      return true;
    };
  })();