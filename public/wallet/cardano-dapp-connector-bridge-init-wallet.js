// This is an example how a wallet app could implement the connection.

function initConnection(iframe, origin) {

  var _debug                  = true // set to true for debug logs.

  var _walletNamespace        = 'eternl' // your wallet namespace
  var _initialApiObject       = bridgeInitialApi // CIP0030 initial api object
  var _fullApiObject          = bridgeFullApi // CIP0030 full api object

  var _bridge                 = { type: 'cardano-dapp-connector-bridge', source: null, origin: null }
  var _methodMap              = {

    // Initial 3 methods to establish connection. More endpoints will be added by the wallet.

    connect:                  'connect',
    handshake:                'handshake',

    enable:                   'enable',
    isEnabled:                'isEnabled',
    getNetworkId:             'getNetworkId',

    getBalance:               'getBalance',
    getChangeAddress:         'getChangeAddress',
    getRewardAddresses:       'getRewardAddresses',
    getUnusedAddresses:       'getUnusedAddresses',
    getUsedAddresses:         'getUsedAddresses',
    getUtxos:                 'getUtxos',
    getCollateral:            'getCollateral',

    signData:                 'signData',
    signTx:                   'signTx',
    submitTx:                 'submitTx',
  }

  var _iframe                 = iframe
  var _origin                 = origin

  var _sendResponse           = function (method, uid, data) {

    if(!_iframe) throw new Error('Iframe not initialized.')

    var iframeWindow          = _iframe.contentWindow

    if(iframeWindow && _origin) {

      iframeWindow.postMessage({

        type:                 _bridge.type,
        walletNamespace:      _walletNamespace,

        method:               method,
        uid:                  uid,

        response:             data.response ?? null,
        error:                data.error ?? null

      }, _origin)
    }
  }

  var _sendInitialAPI         = function () {

    if(!_iframe) throw new Error('Iframe not initialized.')

    var iframeWindow          = _iframe.contentWindow

    if(iframeWindow && _origin) {

      iframeWindow.postMessage({

        type:                 _bridge.type,
        walletNamespace:      _walletNamespace,

        method:               _methodMap.connect,

        initialApi:           _initialApiObject,

      }, _origin)
    }
  }

  function isValidMessage(payload) {

    if(!payload.origin || !payload.source || !payload.data)       return false
    if(payload.data.type !== _bridge.type)                        return false
    if(_walletNamespace && payload.data.to !== _walletNamespace)  return false

    return true
  }

  async function onAPIMessage (payload) {

    if(!isValidMessage(payload)) return

    if(_debug) {

      console.log('++++++++++++++++++++++++')
      console.log('App: onAPIMessage: got message')
      console.log('App: onAPIMessage: origin:', payload.origin)
      // console.log('App: onAPIMessage: source:', payload.source) // Don't log source, might break browser security rules
      console.log('App: onAPIMessage: data: ',  payload.data)
      console.log('App: onAPIMessage: valid: ', isValidMessage(payload))
      console.log('++++++++++++++++++++++++')
    }

    var uid                   = payload.data?.uid
    var api                   = payload.data?.method

    if(!uid)                  { return }
    if(!api)                  { return }

    switch(api) {

      case _methodMap.isEnabled:          _sendResponse(api, uid, { success: true, response: true });           return;
      case _methodMap.enable:             _sendResponse(api, uid, { success: true, response: _fullApiObject }); return;

      case _methodMap.getNetworkId:       _sendResponse(api, uid, handleGetNetworkId('mainnet'));               return;
      case _methodMap.getBalance:         _sendResponse(api, uid, handleGetBalance());                          return;

      case _methodMap.getUsedAddresses:   _sendResponse(api, uid, handleGetUsedAddresses(payload.data.args));   return;
      case _methodMap.getUnusedAddresses: _sendResponse(api, uid, handleGetUnusedAddresses());                  return;
      case _methodMap.getRewardAddresses: _sendResponse(api, uid, handleGetRewardAddresses());                  return;
      case _methodMap.getChangeAddress:   _sendResponse(api, uid, handleGetChangeAddress());                    return;
      case _methodMap.getUtxos:           _sendResponse(api, uid, await handleGetUtxos(payload.data.args));     return;
      case _methodMap.getCollateral:      _sendResponse(api, uid, await handleGetCollateral());                 return;

      case _methodMap.signTx:             _sendResponse(api, uid, await handleSignTx(payload.data.args));       return;
      case _methodMap.signData:           _sendResponse(api, uid, await handleSignData(payload.data.args));     return;
      case _methodMap.submitTx:           _sendResponse(api, uid, await handleSubmitTx(payload.data.args));     return;
    }
  }

  return new Promise((resolve, reject) => {

    if(!_iframe) return reject('iframe not initialized.')

    var iframeWindow          = _iframe.contentWindow

    if(iframeWindow) {

      if(_debug) { console.log('Wallet: connect') }

      var toId                = setTimeout( () => {

        reject('DApp connection failed (timed out). Please try again later. (slow connection?)')

      }, 1000 * 30)

      try {

        var onMessage         = (payload) => {

          if(!isValidMessage(payload)) return

          if(_debug) {

            console.log('************************')
            console.log('Wallet: onMessage: got message')
            console.log('Wallet: onMessage: origin:', payload.origin)
            // console.log('Wallet: onMessage: source:', payload.source) // Don't log source, might break browser security rules
            console.log('Wallet: onMessage: data: ',  payload.data)
            console.log('Wallet: onMessage: valid: ', isValidMessage(payload))
            console.log('************************')
          }

          clearTimeout(toId)

          window.removeEventListener("message", onMessage, false)
          window.removeEventListener("message", onAPIMessage, false)

          if(_debug) { console.log('Wallet: onMessage: handshake?: ',  (payload.data.method === _methodMap.handshake)) }

          if(payload.data.method === _methodMap.handshake) {

            _iframe           = iframe
            _origin           = payload.origin

            window.addEventListener("message", onAPIMessage, false)

            _sendResponse(payload.data.method, payload.data.uid, { success: true, response: true, error: null })

            resolve(true)

          } else {

            reject('DApp connection to failed (handshake).')
          }
        }

        window.removeEventListener("message", onAPIMessage, false)
        window.addEventListener("message", onMessage, false)

        _sendInitialAPI()

      } catch (e) {

        console.error(e)

        return reject('DApp connection to failed (message).')
      }

    } else {

      return reject('ContentWindow undefined.')
    }
  })
}

var bridgeExperimentalFull    = {

  getCollateral:              'getCollateral'
}

var bridgeInitialApi          = {

  isBridge:                   true,

  isEnabled:                  'isEnabled',
  enable:                     'enable',
  experimental: {

    appVersion: {

      major:                  1,
      minor:                  6,
      patch:                  2
    }
  },

  apiVersion:                 '0.1.0',
  name:                       'eternl',
  icon:                       'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMS1jMDAwIDc5LmVkYTJiM2ZhYywgMjAyMS8xMS8xNy0xNzoyMzoxOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4ZmU4ODM0My1iMjExLTQ2YWEtYmE3MS0xZWFiZmZkNWZjMzEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NURCQTYwMDhBMTI1MTFFQzhBMjdGRTQzMjI4NjJBRDIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NURCQTYwMDdBMTI1MTFFQzhBMjdGRTQzMjI4NjJBRDIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjEgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1YzY1MGU0NC04MzE3LTQxMjMtOGFlNy03ZWQyZTVlYmVhMTciIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0N2NhMTg2Yy04YThlLThkNDYtYWE3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',
}

var bridgeFullApi = {

  getNetworkId:               'getNetworkId',
  getUsedAddresses:           'getUsedAddresses',
  getUnusedAddresses:         'getUnusedAddresses',
  getRewardAddresses:         'getRewardAddresses',
  getChangeAddress:           'getChangeAddress',
  getBalance:                 'getBalance',
  getUtxos:                   'getUtxos',

  signTx:                     'signTx',
  signData:                   'signData',
  submitTx:                   'submitTx',

  getCollateral:              'getCollateral',

  experimental: {

    getCollateral:            'getCollateral'
  }
}

var handleGetNetworkId        = (networkId) => {

  var respNetworkId           = 0

  if(networkId === 'mainnet') respNetworkId = 1
  if(networkId === 'testnet') respNetworkId = 0
  if(networkId === 'guild')   respNetworkId = 141

  return { success: true, response: respNetworkId }
}
var handleGetBalance          = () => {

  var balanceCbor             = '00'

  return { success: true, response: balanceCbor }
}
var handleGetUtxos            = async (args) => {

  console.log(args)

  var utxoList                = []

  return { success: true, response: utxoList }
}

var handleGetUnusedAddresses  = () => {

  var addrList                = []

  return { success: true, response: addrList }
}
var handleGetUsedAddresses    = (args) => {

  console.log(args)

  var addrList                = []

  return { success: true, response: addrList }
}
var handleGetRewardAddresses  = () => {

  var addrList                = []

  return { success: true, response: addrList }
}
var handleGetChangeAddress    = () => {

  var addrCbor                = ''

  return { success: true, response: addrCbor }
}
var handleGetCollateral       = async () => {

  var utxoList                = []

  return { success: true, response: utxoList }
}

var handleSignTx              = async (args) => {

  console.log(args)

  return { success: false, error: 'unknown error' }
}
var handleSignData            = async (args) => {

  console.log(args)

  return { success: false, error: 'unknown error' }
}
var handleSubmitTx            = async (args) => {

  console.log(args)

  return {

    code:                     2,
    info:                     'submit tx failed'
  }
}

var iframe = document.getElementById('dappIframe')

iframe.onload = function() {

  initConnection(iframe, 'http://localhost:63342')
}

