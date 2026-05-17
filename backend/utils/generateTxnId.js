const generateTxnId = () => {
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `TXN_${suffix}`;
};

module.exports = generateTxnId;