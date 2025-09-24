const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveData: (data) => ipcRenderer.send('save-data', data),
    onDataLoaded: (callback) => ipcRenderer.on('data-loaded', (event, ...args) => callback(...args))
});
