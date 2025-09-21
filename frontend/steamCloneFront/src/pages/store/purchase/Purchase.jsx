import React, { useMemo, useState, useCallback, useEffect } from 'react';
import './Purchase.scss';
import Notification from '../../../components/Notification';

const formatUAH = (n) =>
  `UAH ${(n ?? 0).toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const onlyDigits = (s = '') => s.replace(/\D/g, '');

const detectCardBrand = (digits) => {
  if (!digits) return 'unknown';
  if (/^4/.test(digits)) return 'visa';
  if (/^(5[1-5])/.test(digits) || /^(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  return 'unknown';
};

const luhnCheck = (num) => {
  if (!num) return false;
  let sum = 0, dbl = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = parseInt(num[i], 10);
    if (dbl) { d *= 2; if (d > 9) d -= 9; }
    sum += d; dbl = !dbl;
  }
  return sum % 10 === 0;
};

const formatCardNumber = (raw) => {
  const digits = onlyDigits(raw).slice(0, 19);
  const brand = detectCardBrand(digits);
  if (brand === 'amex') {
    const a = digits.slice(0, 4);
    const b = digits.slice(4, 10);
    const c = digits.slice(10, 15);
    return [a, b, c].filter(Boolean).join(' ').trim();
  }
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};

const formatExp = (raw) => {
  const d = onlyDigits(raw).slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
};

const isValidExp = (exp) => {
  const m = exp.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const month = parseInt(m[1], 10);
  const year = 2000 + parseInt(m[2], 10);
  if (month < 1 || month > 12) return false;
  const expDate = new Date(year, month, 0, 23, 59, 59, 999);
  return expDate >= new Date();
};

const sanitizePhone = (v) => {
  let d = onlyDigits(v).slice(0, 15);
  if (d.startsWith('380') && d.length > 3) {
    const country = '+380';
    const rest = d.slice(3);
    const p1 = rest.slice(0, 2);
    const p2 = rest.slice(2, 5);
    const p3 = rest.slice(5, 7);
    const p4 = rest.slice(7, 9);
    return [country, p1 && ' ', p1, p2 && ' ', p2, p3 && ' ', p3, p4 && ' ', p4].filter(Boolean).join('');
  }
  return d ? `+${d}` : '';
};

const validate = ({ cardNumber, fullName, exp, cvv, addr, city, zip, phone }) => {
  const errors = {};
  const rawCard = onlyDigits(cardNumber);
  const brand = detectCardBrand(rawCard);

  if (!rawCard || rawCard.length < 13 || !luhnCheck(rawCard)) {
    errors.cardNumber = 'Invalid card number.';
  }
  if (!fullName.trim() || fullName.trim().split(/\s+/).length < 2) {
    errors.fullName = 'Enter first and last name.';
  }
  if (!isValidExp(exp)) {
    errors.exp = 'Invalid date (MM/YY).';
  }
  const cvvDigits = onlyDigits(cvv);
  const cvvLen = brand === 'amex' ? 4 : 3;
  if (cvvDigits.length !== cvvLen && cvvDigits.length !== 3 && cvvDigits.length !== 4) {
    errors.cvv = 'CVV must contain 3–4 digits.';
  }
  if (!addr.trim()) errors.addr = 'Enter billing address.';
  if (!city.trim()) errors.city = 'Enter city.';
  if (!/^\d{4,6}$/.test(onlyDigits(zip))) errors.zip = 'Invalid postal code.';
  if (onlyDigits(phone).length < 10) errors.phone = 'Invalid phone number.';
  return errors;
};

const Purchase = () => {
  const item = useMemo(() => ({
    id: 'rdr2',
    title: 'Red Dead Redemption 2',
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/k3hnchag_expires_30_days.png',
    oldUAH: 2599,
    newUAH: 649,
    discountPct: 75
  }), []);

  const price = 2599.00;
  const saleDiscount = 1949.25;
  const vat = 108.29;
  const total = 645.75;

  const [cardNumber, setCardNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [exp, setExp] = useState('');
  const [cvv, setCvv] = useState('');
  const [addr, setAddr] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [saveMethod, setSaveMethod] = useState(false);
  const [agreePublisher, setAgreePublisher] = useState(false);

  const [placing, setPlacing] = useState(false);
  const [notif, setNotif] = useState(null);
  const [errors, setErrors] = useState({});

  const cardBrand = detectCardBrand(onlyDigits(cardNumber));

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedMethod') || 'null');
      if (saved?.cardNumber) {
        setCardNumber(formatCardNumber(saved.cardNumber));
        if (saved.fullName) setFullName(saved.fullName);
        if (saved.exp) setExp(saved.exp);
      }
    } catch {}
  }, []);

  const onCardChange = useCallback((e) => setCardNumber(formatCardNumber(e.target.value)), []);
  const onExpChange = useCallback((e) => setExp(formatExp(e.target.value)), []);
  const onCvvChange = useCallback((e) => setCvv(onlyDigits(e.target.value).slice(0, 4)), []);
  const onZipChange = useCallback((e) => setZip(onlyDigits(e.target.value).slice(0, 6)), []);
  const onPhoneChange = useCallback((e) => setPhone(sanitizePhone(e.target.value)), []);

  const canSubmit = agreePublisher && !placing;

  const placeOrder = async (e) => {
    e?.preventDefault?.();
    const errs = validate({ cardNumber, fullName, exp, cvv, addr, city, zip, phone });
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setNotif({ type: 'error', msg: 'Please check the fields.' });
      return;
    }
    if (!agreePublisher) {
      setNotif({ type: 'error', msg: 'Please agree to share your email with the publisher.' });
      return;
    }

    setPlacing(true);
    setNotif(null);
    try {
      await new Promise((r) => setTimeout(r, 1100));
      if (saveMethod) {
        localStorage.setItem('savedMethod', JSON.stringify({
          fullName: fullName.trim(),
          cardNumber: onlyDigits(cardNumber),
          exp
        }));
      }
      setNotif({ type: 'success', msg: 'Payment successful! Order placed.' });
    } catch {
      setNotif({ type: 'error', msg: 'Payment failed. Try again later.' });
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="checkout-stage">
      <div className="notif-wrap">
        <Notification
          message={notif?.msg || null}
          type={notif?.type || 'info'}
          onClose={() => setNotif(null)}
        />
      </div>

      <div className="checkout-platform">
        <div className="platform-inner">
          <div className="platform-head">
            <div className="title">Checkout</div>
            <div className="brands">
              <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-19/68w105DQZA.png" alt="Visa" />
              <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-19/7df5F4tGLj.png" alt="Mastercard" />
            </div>
          </div>

          <div className="platform-content">
            <div className="platform-grid">
              <form className="form-col" onSubmit={placeOrder}>
                <div className="fields">
                  <div className={`field ${errors.cardNumber ? 'has-error' : ''}`}>
                    <label htmlFor="cc-number">Card number</label>
                    <div className="field-control">
                      <input
                        id="cc-number"
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={onCardChange}
                        aria-invalid={!!errors.cardNumber}
                        aria-describedby="err-card"
                      />
                      <div className="brand-icon" data-brand={cardBrand} title={cardBrand} />
                    </div>
                    <div id="err-card" className="error">{errors.cardNumber || ''}</div>
                  </div>

                  <div className={`field ${errors.fullName ? 'has-error' : ''}`}>
                    <label htmlFor="cc-name">First name &amp; last name</label>
                    <div className="field-control">
                      <input
                        id="cc-name"
                        type="text"
                        autoComplete="cc-name"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        aria-invalid={!!errors.fullName}
                        aria-describedby="err-name"
                      />
                    </div>
                    <div id="err-name" className="error">{errors.fullName || ''}</div>
                  </div>

                  <div className="field-row">
                    <div className={`field ${errors.exp ? 'has-error' : ''}`}>
                      <label htmlFor="cc-exp">MM/YY</label>
                      <div className="field-control">
                        <input
                          id="cc-exp"
                          type="text"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          placeholder="MM/YY"
                          value={exp}
                          onChange={onExpChange}
                          aria-invalid={!!errors.exp}
                          aria-describedby="err-exp"
                        />
                      </div>
                      <div id="err-exp" className="error">{errors.exp || ''}</div>
                    </div>

                    <div className={`field ${errors.cvv ? 'has-error' : ''}`}>
                      <label htmlFor="cc-cvv">CVV</label>
                      <div className="field-control has-addon">
                        <input
                          id="cc-cvv"
                          type="password"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          placeholder="***"
                          value={cvv}
                          onChange={onCvvChange}
                          maxLength={4}
                          aria-invalid={!!errors.cvv}
                          aria-describedby="err-cvv"
                        />
                        <div className="cvv-help" tabIndex={0} aria-label="CVV help" role="button">
                          <span className="q">?</span>
                          <div className="cvv-tip">3 digits on the back (AmEx: 4 on the front)</div>
                        </div>
                      </div>
                      <div id="err-cvv" className="error">{errors.cvv || ''}</div>
                    </div>
                  </div>

                  <div className={`field ${errors.addr ? 'has-error' : ''}`}>
                    <label htmlFor="addr">Billing address</label>
                    <div className="field-control">
                      <input
                        id="addr"
                        type="text"
                        placeholder="Street, house/apartment"
                        value={addr}
                        onChange={(e) => setAddr(e.target.value)}
                        aria-invalid={!!errors.addr}
                        aria-describedby="err-addr"
                      />
                    </div>
                    <div id="err-addr" className="error">{errors.addr || ''}</div>
                  </div>

                  <div className="field-row">
                    <div className={`field ${errors.city ? 'has-error' : ''}`}>
                      <label htmlFor="city">City</label>
                      <div className="field-control">
                        <input
                          id="city"
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          aria-invalid={!!errors.city}
                          aria-describedby="err-city"
                        />
                      </div>
                      <div id="err-city" className="error">{errors.city || ''}</div>
                    </div>

                    <div className={`field ${errors.zip ? 'has-error' : ''}`}>
                      <label htmlFor="zip">Zip or Postal code</label>
                      <div className="field-control">
                        <input
                          id="zip"
                          type="text"
                          inputMode="numeric"
                          placeholder="e.g. 01001"
                          value={zip}
                          onChange={onZipChange}
                          aria-invalid={!!errors.zip}
                          aria-describedby="err-zip"
                        />
                      </div>
                      <div id="err-zip" className="error">{errors.zip || ''}</div>
                    </div>
                  </div>

                  <div className={`field ${errors.phone ? 'has-error' : ''}`}>
                    <label htmlFor="phone">Full phone number</label>
                    <div className="field-control">
                      <input
                        id="phone"
                        type="tel"
                        placeholder="+380 XX XXX XX XX"
                        value={phone}
                        onChange={onPhoneChange}
                        aria-invalid={!!errors.phone}
                        aria-describedby="err-phone"
                      />
                    </div>
                    <div id="err-phone" className="error">{errors.phone || ''}</div>
                  </div>

                  <label className="check save-method">
                    <input
                      type="checkbox"
                      checked={saveMethod}
                      onChange={(e) => setSaveMethod(e.target.checked)}
                    />
                    <span>Save this payment method for future purchases</span>
                  </label>

                  <p className="save-note">
                    This way, payment method will be selected as the default for all purchases made using Flux payment. You can delete your saved payment information anytime on this payment screen.
                  </p>
                </div>
              </form>

              <div className="divider" aria-hidden="true" />

              <div className="summary-col">
                <div className="summary-head">
                  <div className="title">Order Summary</div>
                  <button
                    className="close-x"
                    aria-label="Close"
                    type="button"
                    onClick={() => window.history.back()}
                    title="Close"
                  />
                </div>

                <div className="order-item">
                  <img src={item.imageUrl} alt={item.title} />
                  <div className="info">
                    <div className="gtitle">{item.title}</div>
                    <div className="price-chip">
                      <span className="off">-{item.discountPct}%</span>
                      <div className="nums">
                        <span className="from">{formatUAH(item.oldUAH)}</span>
                        <span className="now">{formatUAH(item.newUAH)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sum-box">
                  <div className="row"><span>Price</span><span>{formatUAH(price)}</span></div>
                  <div className="row"><span>Sale discount</span><span>-{formatUAH(saleDiscount)}</span></div>
                  <div className="row"><span>VAT included(20%)</span><span>{formatUAH(vat)}</span></div>
                  <div className="hr" />
                  <div className="row total"><span>Total</span><span>{formatUAH(total)}</span></div>
                </div>

                <label className="check agree-line">
                  <input
                    type="checkbox"
                    checked={agreePublisher}
                    onChange={(e) => setAgreePublisher(e.target.checked)}
                  />
                  <span>
                    Click here to agree to share your email with <b>Rockstar Games</b>. <b>Rockstar Games</b> will use your
                    email address for marketing and otherwise in accordance with its
                    <a href="#" onClick={(e)=>e.preventDefault()}> privacy policy</a>, so we encourage you to read it.
                  </span>
                </label>

                <p className="legal">
                  You are purchasing a digital license for this product. For full terms, see <a href="#" onClick={(e)=>e.preventDefault()}>purchase policy</a>. By selecting ‘Place Order’ below, you certify that you are over 18 and an authorized user of this payment method, and agree to the <a href="#" onClick={(e)=>e.preventDefault()}>Flux Subscriber Agreement</a>.
                </p>

                <p className="help">
                  Need Help? <a href="#" onClick={(e)=>e.preventDefault()}>Contact Us</a>
                </p>
              </div>
            </div>
          </div>

          <div className="platform-action">
            <button
              className="place-order-btn"
              disabled={!canSubmit}
              onClick={placeOrder}
              aria-label="Place order"
              type="button"
            >
              Place order
            </button>
            {placing && <div className="placing-note">Processing...</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purchase;