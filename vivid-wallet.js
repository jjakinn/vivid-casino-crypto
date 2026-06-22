/**
 * VividBetting Wallet Integration
 * Add this to vivid-casino-crypto/index.html
 */

// ============================================
// WALLET CONFIG
// ============================================
const WALLET_CONFIG = {
  API_URL: 'https://api.vividbetting.com',
  COINS: [
    { id: 'BTC', name: 'Bitcoin', icon: '₿', color: '#F7931A' },
    { id: 'ETH', name: 'Ethereum', icon: 'Ξ', color: '#627EEA' },
    { id: 'SOL', name: 'Solana', icon: '◎', color: '#00FFA3' },
    { id: 'TRX', name: 'Tron', icon: '◈', color: '#FF060A' },
    { id: 'USDT_ETH', name: 'USDT (ERC-20)', icon: '₮', color: '#26A17B' },
    { id: 'USDC_ETH', name: 'USDC (ERC-20)', icon: '₮', color: '#2775CA' },
    { id: 'USDT_TRX', name: 'USDT (TRC-20)', icon: '₮', color: '#26A17B' },
    { id: 'USDC_SOL', name: 'USDC (SPL)', icon: '₮', color: '#2775CA' }
  ]
};

// ============================================
// WALLET STATE
// ============================================
const WalletState = {
  user: null,
  balances: {},
  transactions: [],
  selectedCoin: WALLET_CONFIG.COINS[0],
  activeTab: 'deposit',
  depositAddress: null,
  loading: false,
  txResult: null,
  error: null,
  amount: ''
};

// ============================================
// API FUNCTIONS
// ============================================
const WalletAPI = {
  async getBalances() {
    if (!WalletState.user?.token) return null;
    try {
      const res = await fetch(`${WALLET_CONFIG.API_URL}/api/wallet/balances`, {
        headers: { 'Authorization': `Bearer ${WalletState.user.token}` }
      });
      const data = await res.json();
      if (data.success) {
        const map = {};
        data.balances.forEach(b => map[b.coinId] = b);
        WalletState.balances = map;
        return map;
      }
    } catch (e) { console.error('getBalances', e); }
    return null;
  },

  async getDepositAddress(coinId) {
    if (!WalletState.user?.token) return null;
    try {
      const res = await fetch(`${WALLET_CONFIG.API_URL}/api/wallet/deposit-address/${coinId}`, {
        headers: { 'Authorization': `Bearer ${WalletState.user.token}` }
      });
      const data = await res.json();
      return data.success ? data.address : null;
    } catch (e) { console.error('getDepositAddress', e); }
    return null;
  },

  async verifyDeposit(txHash, coinId, amount) {
    if (!WalletState.user?.token) return null;
    try {
      const res = await fetch(`${WALLET_CONFIG.API_URL}/api/wallet/deposit/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WalletState.user.token}`
        },
        body: JSON.stringify({ txHash, coinId, amount })
      });
      return await res.json();
    } catch (e) { console.error('verifyDeposit', e); }
    return null;
  },

  async withdraw(coinId, amount, toAddress) {
    if (!WalletState.user?.token) return null;
    try {
      const res = await fetch(`${WALLET_CONFIG.API_URL}/api/wallet/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WalletState.user.token}`
        },
        body: JSON.stringify({ coinId, amount: parseFloat(amount), toAddress })
      });
      return await res.json();
    } catch (e) { console.error('withdraw', e); }
    return null;
  }
};

// ============================================
// UI FUNCTIONS
// ============================================
const WalletUI = {
  // Initialize wallet button in header
  initHeaderButton() {
    const headerButtons = document.querySelector('.header-buttons ul');
    if (!headerButtons) return;
    
    const walletLi = document.createElement('li');
    walletLi.innerHTML = `
      <button id="wallet-btn" class="header-btn btn-wallet" style="background:linear-gradient(135deg,#00ffa3,#00c853);border:none;border-radius:8px;padding:8px 20px !important;display:flex !important;align-items:center;gap:8px;color:#000 !important;font-weight:600;visibility:visible !important;opacity:1 !important;margin-left:8px;" onclick="WalletUI.openModal()">
        🏦 Wallet
      </button>
    `;
    headerButtons.appendChild(walletLi);
  },

  // Open modal
  openModal() {
    const modal = document.getElementById('vivid-wallet-modal');
    if (modal) {
      modal.style.display = 'flex';
      WalletUI.loadData();
    }
  },

  // Close modal
  closeModal() {
    const modal = document.getElementById('vivid-wallet-modal');
    if (modal) modal.style.display = 'none';
  },

  // Load user data
  async loadData() {
    // Try to get user from your existing auth system
    const userToken = localStorage.getItem('vivid_token') || sessionStorage.getItem('vivid_token');
    const userId = localStorage.getItem('vivid_user_id');
    
    if (userToken && userId) {
      WalletState.user = { id: userId, token: userToken };
      await WalletAPI.getBalances();
    } else {
      WalletState.user = null;
    }
    
    WalletUI.render();
  },

  // Select coin
  selectCoin(coinId) {
    WalletState.selectedCoin = WALLET_CONFIG.COINS.find(c => c.id === coinId);
    WalletState.depositAddress = null;
    WalletState.txResult = null;
    WalletState.error = null;
    WalletUI.render();
    
    if (WalletState.activeTab === 'deposit') {
      WalletUI.loadDepositAddress();
    }
  },

  // Load deposit address
  async loadDepositAddress() {
    if (!WalletState.user) return;
    WalletState.loading = true;
    WalletUI.render();
    
    const address = await WalletAPI.getDepositAddress(WalletState.selectedCoin.id);
    WalletState.depositAddress = address;
    WalletState.loading = false;
    WalletUI.render();
  },

  // Set tab
  setTab(tab) {
    WalletState.activeTab = tab;
    WalletState.txResult = null;
    WalletState.error = null;
    WalletUI.render();
    
    if (tab === 'deposit') {
      WalletUI.loadDepositAddress();
    }
  },

  // Verify deposit
  async verifyDeposit() {
    const txHash = document.getElementById('deposit-txhash')?.value;
    const amount = parseFloat(document.getElementById('deposit-amount')?.value);
    
    if (!txHash || !amount) {
      WalletState.error = 'Enter transaction hash and amount';
      WalletUI.render();
      return;
    }
    
    WalletState.loading = true;
    WalletUI.render();
    
    const result = await WalletAPI.verifyDeposit(txHash, WalletState.selectedCoin.id, amount);
    
    WalletState.loading = false;
    
    if (result?.success) {
      WalletState.txResult = { type: 'deposit', ...result };
      WalletAPI.getBalances();
    } else {
      WalletState.error = result?.error || 'Verification failed';
    }
    
    WalletUI.render();
  },

  // Withdraw
  async withdraw() {
    const amount = parseFloat(document.getElementById('withdraw-amount')?.value);
    const address = document.getElementById('withdraw-address')?.value;
    
    if (!amount || !address) {
      WalletState.error = 'Enter amount and address';
      WalletUI.render();
      return;
    }
    
    WalletState.loading = true;
    WalletUI.render();
    
    const result = await WalletAPI.withdraw(WalletState.selectedCoin.id, amount, address);
    
    WalletState.loading = false;
    
    if (result?.success) {
      WalletState.txResult = { type: 'withdrawal', ...result };
      WalletAPI.getBalances();
    } else {
      WalletState.error = result?.error || 'Withdrawal failed';
    }
    
    WalletUI.render();
  },

  // Copy to clipboard
  copy(text) {
    navigator.clipboard.writeText(text);
    const btn = event.target;
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = original, 2000);
  },

  // Get explorer URL
  getExplorerUrl(chain, txHash) {
    const explorers = {
      bitcoin: `https://mempool.space/tx/${txHash}`,
      ethereum: `https://etherscan.io/tx/${txHash}`,
      solana: `https://solscan.io/tx/${txHash}`,
      tron: `https://tronscan.org/#/transaction/${txHash}`
    };
    return explorers[chain] || '#';
  },

  // Render modal
  render() {
    const modal = document.getElementById('vivid-wallet-modal');
    if (!modal) return;
    
    const coin = WalletState.selectedCoin;
    const balance = WalletState.balances[coin.id];
    const isLoggedIn = !!WalletState.user;
    
    modal.innerHTML = `
      <div class="wallet-modal" onclick="event.stopPropagation()">
        <div class="wallet-header">
          <h2>🏦 Wallet</h2>
          <button class="wallet-close" onclick="WalletUI.closeModal()">×</button>
        </div>
        
        ${!isLoggedIn ? `
          <div class="wallet-login-prompt">
            <p>Please log in to access your wallet</p>
            <button onclick="document.getElementById('login-modal').style.display='block';WalletUI.closeModal();" 
              style="background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:8px;padding:12px 32px;color:#fff;font-weight:600;cursor:pointer;margin-top:16px;">
              Log In
            </button>
          </div>
        ` : `
          <div class="coin-selector">
            ${WALLET_CONFIG.COINS.map(c => `
              <button class="coin-btn ${c.id === coin.id ? 'active' : ''}" 
                onclick="WalletUI.selectCoin('${c.id}')"
                style="--coin-color:${c.color}">
                <span class="coin-icon">${c.icon}</span>
                <span class="coin-name">${c.symbol}</span>
                <span class="coin-balance">${(balance?.balance || 0).toFixed(4)}</span>
              </button>
            `).join('')}
          </div>
          
          <div class="wallet-tabs">
            <button class="${WalletState.activeTab === 'deposit' ? 'active' : ''}" onclick="WalletUI.setTab('deposit')">Deposit</button>
            <button class="${WalletState.activeTab === 'withdraw' ? 'active' : ''}" onclick="WalletUI.setTab('withdraw')">Withdraw</button>
          </div>
          
          ${WalletState.activeTab === 'deposit' ? `
            <div class="wallet-section">
              <div class="balance-display">
                <div>Balance: <strong>${(balance?.balance || 0).toFixed(6)} ${coin.id}</strong></div>
              </div>
              
              ${WalletState.depositAddress ? `
                <div class="address-section">
                  <p>Send ${coin.name} to this address:</p>
                  <div class="address-box">
                    <code>${WalletState.depositAddress}</code>
                    <button onclick="WalletUI.copy('${WalletState.depositAddress}')">Copy</button>
                  </div>
                  <div class="qr-code">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${WalletState.depositAddress}" alt="QR">
                  </div>
                </div>
                
                <div class="verify-section">
                  <p>Already sent? Verify your deposit:</p>
                  <input type="text" id="deposit-txhash" placeholder="Transaction Hash" />
                  <input type="number" id="deposit-amount" placeholder="Amount (${coin.id})" step="0.000001" />
                  <button class="action-btn deposit-btn" onclick="WalletUI.verifyDeposit()" ${WalletState.loading ? 'disabled' : ''}>
                    ${WalletState.loading ? 'Verifying...' : 'Verify Deposit'}
                  </button>
                </div>
              ` : `
                <div class="loading">Loading address...</div>
              `}
            </div>
          ` : `
            <div class="wallet-section">
              <div class="balance-display">
                <div>Available: <strong>${(balance?.available || 0).toFixed(6)} ${coin.id}</strong></div>
              </div>
              
              <input type="number" id="withdraw-amount" placeholder="Amount (${coin.id})" step="0.000001" />
              <input type="text" id="withdraw-address" placeholder="${coin.name} address" />
              
              <button class="action-btn withdraw-btn" onclick="WalletUI.withdraw()" ${WalletState.loading ? 'disabled' : ''}>
                ${WalletState.loading ? 'Processing...' : `Withdraw ${coin.id}`}
              </button>
            </div>
          `}
          
          ${WalletState.error ? `<div class="error-msg">❌ ${WalletState.error}</div>` : ''}
          
          ${WalletState.txResult ? `
            <div class="success-msg">
              ✅ ${WalletState.txResult.type === 'deposit' ? 'Deposit verified!' : 'Withdrawal queued!'}
              ${WalletState.txResult.signature ? `
                <a href="${WalletUI.getExplorerUrl(coin.chain, WalletState.txResult.signature)}" target="_blank">View</a>
              ` : ''}
            </div>
          ` : ''}
        `}
      </div>
    `;
  }
};

// ============================================
// STYLES
// ============================================
const walletStyles = document.createElement('style');
walletStyles.textContent = `
  #vivid-wallet-modal {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.85);
    z-index: 99999;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
  }
  
  .wallet-modal {
    background: #0f0f23;
    border: 1px solid #1e1e3a;
    border-radius: 16px;
    width: 90%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 24px;
    color: #fff;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }
  
  .wallet-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .wallet-header h2 {
    margin: 0;
    font-size: 22px;
  }
  
  .wallet-close {
    background: none;
    border: none;
    color: #888;
    font-size: 28px;
    cursor: pointer;
    padding: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  
  .wallet-close:hover {
    background: rgba(255,255,255,0.1);
    color: #fff;
  }
  
  .coin-selector {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    margin-bottom: 16px;
  }
  
  .coin-btn {
    background: rgba(255,255,255,0.05);
    border: 2px solid transparent;
    border-radius: 10px;
    padding: 10px 6px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    transition: all 0.2s;
    color: #fff;
    font-size: 11px;
  }
  
  .coin-btn:hover {
    background: rgba(255,255,255,0.1);
  }
  
  .coin-btn.active {
    border-color: var(--coin-color, #00ffa3);
    background: rgba(255,255,255,0.08);
  }
  
  .coin-btn .coin-icon {
    font-size: 18px;
  }
  
  .coin-btn .coin-name {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 10px;
  }
  
  .coin-btn .coin-balance {
    font-size: 9px;
    color: #888;
  }
  
  .wallet-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 12px;
  }
  
  .wallet-tabs button {
    flex: 1;
    background: transparent;
    border: none;
    color: #888;
    padding: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
    transition: all 0.2s;
  }
  
  .wallet-tabs button:hover {
    background: rgba(255,255,255,0.05);
    color: #ccc;
  }
  
  .wallet-tabs button.active {
    background: rgba(0,255,163,0.15);
    color: #00ffa3;
  }
  
  .wallet-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .balance-display {
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
    padding: 12px;
    text-align: center;
    font-size: 13px;
    color: #888;
  }
  
  .balance-display strong {
    color: #fff;
    font-size: 16px;
  }
  
  .address-section {
    text-align: center;
  }
  
  .address-section p {
    color: #888;
    font-size: 12px;
    margin-bottom: 8px;
  }
  
  .address-box {
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
    padding: 12px;
    display: flex;
    gap: 8px;
    align-items: center;
    word-break: break-all;
    margin-bottom: 12px;
  }
  
  .address-box code {
    flex: 1;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    color: #00ffa3;
  }
  
  .address-box button {
    background: rgba(0,255,163,0.2);
    border: none;
    color: #00ffa3;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 12px;
    white-space: nowrap;
  }
  
  .qr-code {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
  }
  
  .qr-code img {
    border-radius: 10px;
    background: #fff;
    padding: 6px;
  }
  
  .verify-section {
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-top: 16px;
  }
  
  .verify-section p {
    color: #888;
    font-size: 12px;
    margin-bottom: 8px;
  }
  
  .wallet-modal input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 12px;
    color: #fff;
    font-size: 14px;
    margin-bottom: 8px;
    box-sizing: border-box;
  }
  
  .wallet-modal input:focus {
    outline: none;
    border-color: #00ffa3;
    background: rgba(255,255,255,0.08);
  }
  
  .wallet-modal input::placeholder {
    color: #666;
  }
  
  .action-btn {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .deposit-btn {
    background: #00ffa3;
    color: #000;
  }
  
  .deposit-btn:hover {
    background: #00e694;
  }
  
  .withdraw-btn {
    background: #ff4757;
    color: #fff;
  }
  
  .withdraw-btn:hover {
    background: #ff3344;
  }
  
  .action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .error-msg {
    background: rgba(255,71,87,0.15);
    color: #ff4757;
    padding: 10px;
    border-radius: 10px;
    font-size: 13px;
  }
  
  .success-msg {
    background: rgba(0,255,163,0.15);
    color: #00ffa3;
    padding: 10px;
    border-radius: 10px;
    font-size: 13px;
  }
  
  .success-msg a {
    color: #00ffa3;
    text-decoration: underline;
    margin-left: 8px;
  }
  
  .loading {
    text-align: center;
    color: #888;
    padding: 20px;
  }
  
  .wallet-login-prompt {
    text-align: center;
    padding: 40px 20px;
  }
  
  .wallet-login-prompt p {
    color: #888;
    margin-bottom: 16px;
  }
`;

document.head.appendChild(walletStyles);

// Create modal container
const modalContainer = document.createElement('div');
modalContainer.id = 'vivid-wallet-modal';
modalContainer.onclick = () => WalletUI.closeModal();
document.body.appendChild(modalContainer);

// Initialize when DOM ready - use MutationObserver to handle dynamically rendered content
function initWallet() {
  // Try to find header buttons
  const headerButtons = document.querySelector('.header-buttons ul');
  
  if (headerButtons && !document.getElementById('wallet-btn')) {
    WalletUI.initHeaderButton();
    return true;
  }
  return false;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Try immediately
    if (!initWallet()) {
      // If not found, watch for it
      const observer = new MutationObserver((mutations, obs) => {
        if (initWallet()) {
          obs.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      
      // Timeout after 10 seconds
      setTimeout(() => observer.disconnect(), 10000);
    }
  });
} else {
  if (!initWallet()) {
    const observer = new MutationObserver((mutations, obs) => {
      if (initWallet()) {
        obs.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 10000);
  }
}
