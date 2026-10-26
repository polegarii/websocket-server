const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

let tvSocket = null;

wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`Novo cliente conectado: ${ip}`);

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'register_tv') {
                tvSocket = ws;
                console.log('TV registrada.');
            } else if (data.type === 'command' && tvSocket) {
                console.log('Comando recebido:', data.command);
                tvSocket.send(JSON.stringify({ action: data.command }));
            }
        } catch (err) {
            console.error('Erro ao processar mensagem:', err);
        }
    });
});
