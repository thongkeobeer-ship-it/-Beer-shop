/* ---------------------------------------------------------------
   PURCHASE SYSTEM
   --------------------------------------------------------------- */
const purchaseConfirm = document.getElementById('purchaseConfirm');
const pcBackdrop = document.getElementById('pcBackdrop');
const pcAccount  = document.getElementById('pcAccount');
const pcPrice    = document.getElementById('pcPrice');
const pcStock    = document.getElementById('pcStock');
const pcCancel   = document.getElementById('pcCancel');
const pcConfirm  = document.getElementById('pcConfirm');
const flowToast     = document.getElementById('flowToast');
const flowToastText = document.getElementById('flowToastText');
let pendingAccount = null;

function openPurchaseConfirm(acc){
  pendingAccount = acc;
  pcAccount.textContent = acc.title;
  pcPrice.textContent = formatKip(acc.price);
  pcStock.textContent = acc.stock ? 'In Stock' : 'Sold Out';
  purchaseConfirm.classList.add('open');
  purchaseConfirm.setAttribute('aria-hidden', 'false');
  lockBody();
}
function closePurchaseConfirm(){
  purchaseConfirm.classList.remove('open');
  purchaseConfirm.setAttribute('aria-hidden', 'true');
  unlockBodyIfClear();
}
pcCancel.addEventListener('click', closePurchaseConfirm);
pcBackdrop.addEventListener('click', closePurchaseConfirm);

pcConfirm.addEventListener('click', () => {
  if (pendingAccount){
    pendingAccount.stock = false;
    if (flowState.accountId === pendingAccount.id) openAccountDetail(pendingAccount.id);
  }
  closePurchaseConfirm();
  showToast(`Purchase confirmed — ${pendingAccount ? pendingAccount.title : ''}`);
  pendingAccount = null;
});

function showToast(text){
  flowToastText.textContent = text;
  flowToast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => flowToast.classList.remove('show'), 3200);
}
