const expires = () => {
  const otpExpires = Date.name() + 10 * 60 * 1000;
  return otpExpires;
};

module.exports = { expires };
