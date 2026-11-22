const localtunnel = require('localtunnel');

(async () => {
  try {
    console.log('Connecting to localtunnel for port 3000...');
    const tunnel = await localtunnel({ port: 3000 });

    console.log('======================================================');
    console.log('VK STUDIO Public Tunnel is Live:');
    console.log(tunnel.url);
    console.log('======================================================');

    tunnel.on('close', () => {
      console.log('Localtunnel connection closed.');
    });

    tunnel.on('error', (err) => {
      console.error('Localtunnel error:', err);
    });
  } catch (err) {
    console.error('Failed to start localtunnel:', err.message);
  }
})();
