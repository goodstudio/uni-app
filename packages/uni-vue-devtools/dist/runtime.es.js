function getTarget() {
    // eslint-disable-next-line no-restricted-globals
    if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-restricted-globals
        return window;
    }
    if (typeof globalThis !== 'undefined') {
        return globalThis;
    }
    if (typeof my !== 'undefined') {
        return my;
    }
}
class Socket {
    constructor(host) {
        this.sid = '';
        this.ackTimeout = 5000;
        this.closed = false;
        this._ackTimer = 0;
        this._onCallbacks = {};
        this.host = host;
        setTimeout(() => {
            this.connect();
        }, 50);
    }
    connect() {
        // close: 1
        // message: 4
        // noop: 6
        // open: 0
        // ping: 2
        // pong: 3
        // upgrade: 5
        this._socket = uni.connectSocket({
            url: `ws://${this.host}/socket.io/?EIO=4&transport=websocket`,
            complete() {
                // NOOP
            },
        });
        this._socket.onOpen((res) => {
            // NOOP
        });
        this._socket.onMessage(({ data }) => {
            if (typeof data !== 'string') {
                return;
            }
            if (data[0] === '0') {
                this._send('40');
                const res = JSON.parse(data.slice(1));
                this.sid = res.sid;
            }
            else if (data[0] + data[1] === '40') {
                this.sid = JSON.parse(data.slice(2)).sid;
                this._trigger('connect');
            }
            else if (data === '3') {
                this._send('2');
            }
            else if (data === '2') {
                this._send('3');
            }
            else {
                const match = /\[.*\]/.exec(data);
                if (!match)
                    return;
                try {
                    const [event, args] = JSON.parse(match[0]);
                    this._trigger(event, args);
                }
                catch (err) {
                    console.error('Vue DevTools onMessage: ', err);
                }
            }
        });
        this._socket.onClose((res) => {
            this.closed = true;
            this._trigger('disconnect', res);
        });
        this._socket.onError((res) => {
            console.error(res.errMsg);
        });
    }
    on(event, callback) {
        (this._onCallbacks[event] || (this._onCallbacks[event] = [])).push(callback);
    }
    emit(event, data) {
        if (this.closed) {
            return;
        }
        this._heartbeat();
        // message: 4 + parser.EVENT: 2
        this._send(`42${JSON.stringify(typeof data !== 'undefined' ? [event, data] : [event])}`);
    }
    disconnect() {
        clearTimeout(this._ackTimer);
        if (this._socket && !this.closed) {
            // message: 4 + close: 1
            this._send('41');
            this._socket.close({});
        }
    }
    _heartbeat() {
        clearTimeout(this._ackTimer);
        this._ackTimer = setTimeout(() => {
            this._socket && this._socket.send({ data: '3' });
        }, this.ackTimeout);
    }
    _send(data) {
        this._socket && this._socket.send({ data });
    }
    _trigger(event, args) {
        const callbacks = this._onCallbacks[event];
        if (callbacks) {
            callbacks.forEach((callback) => {
                callback(args);
            });
        }
    }
}
getTarget().__VUE_DEVTOOLS_SOCKET__ = new Socket(__VUE_DEVTOOLS_HOST__ + ':' + __VUE_DEVTOOLS_PORT__);
